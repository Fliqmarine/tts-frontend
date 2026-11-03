import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/Delete";
import DownloadOutlinedIcon from "@mui/icons-material/Download";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import {
  Alert,
  Box,
  Button,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  type SxProps,
  type Theme,
} from "@mui/material";
import { useMemo, useState, type ChangeEvent } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { PreAlertDetails } from "./types/preAlert.types";

const STAGE4_STORAGE_KEY = "tts-demo-pre-alert-stage-4";
const CURRENCIES = ["AED", "USD", "EUR", "GBP", "INR"];
const AED_PER_USD = 3.6725;

type StoredInvoiceFile = {
  name: string;
  dataUrl?: string;
};

type VendorInvoiceRow = {
  id: string;
  vendorName: string;
  manifestNo: string;
  invoiceNo: string;
  invoiceDate: string;
  overdueDate: string;
  purchaseAmount: string;
  currency: string;
  vatPercent: string;
  vatAmount: string;
  finalAmountUsd: string;
  invoiceFiles: StoredInvoiceFile[];
  [key: string]: unknown;
};

type FieldKey =
  | "vendorName"
  | "manifestNo"
  | "invoiceNo"
  | "invoiceDate"
  | "overdueDate"
  | "purchaseAmount"
  | "currency"
  | "vatPercent"
  | "vatAmount"
  | "finalAmountUsd";

type FieldDef = {
  key: FieldKey;
  label: string;
  type: "text" | "date" | "number" | "currency";
  width: string; // percentage of the table, adds up to 100 with the upload + action columns
};

/* Widths are percentages so the table always fits its container (no horizontal scroll). */
const FIELDS: FieldDef[] = [
  { key: "vendorName", label: "Vendor Name", type: "text", width: "12%" },
  { key: "manifestNo", label: "Manifest No", type: "text", width: "11%" },
  { key: "invoiceNo", label: "Invoice No", type: "text", width: "9%" },
  { key: "invoiceDate", label: "Invoice Date", type: "date", width: "8.5%" },
  { key: "overdueDate", label: "Overdue Date", type: "date", width: "8.5%" },
  { key: "purchaseAmount", label: "Purchase Amount", type: "number", width: "8%" },
  { key: "currency", label: "Currency", type: "currency", width: "7%" },
  { key: "vatPercent", label: "VAT (%)", type: "number", width: "5%" },
  { key: "vatAmount", label: "VAT Amount", type: "number", width: "7%" },
  { key: "finalAmountUsd", label: "Final Amount (USD)", type: "number", width: "8%" },
];
const UPLOAD_WIDTH = "8%";
const ACTION_WIDTH = "2%";

type Stage4Row = PreAlertDetails & {
  vendorInvoices?: unknown;
};

type EditVendorLocationState = {
  preAlert?: Stage4Row;
};

const readStage4Rows = (): Stage4Row[] => {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STAGE4_STORAGE_KEY) ?? "[]");
    if (Array.isArray(parsed)) return parsed as Stage4Row[];
    console.error("Stage 4 Pre-Alert storage has an invalid format.");
  } catch (error) {
    console.error("Could not read Stage 4 Pre-Alerts from storage.", error);
  }
  return [];
};

const toStringValue = (value: unknown) => value == null ? "" : String(value);

const getFinalAmountUsd = (invoice: Record<string, unknown>) => {
  if (invoice.finalAmountUsd != null && invoice.finalAmountUsd !== "") {
    return toStringValue(invoice.finalAmountUsd);
  }
  if (invoice.finalAmountAed == null || invoice.finalAmountAed === "") return "";

  const amountAed = Number(invoice.finalAmountAed);
  return Number.isFinite(amountAed) ? (amountAed / AED_PER_USD).toFixed(2) : "";
};

const readInvoiceFiles = (invoice: Record<string, unknown>): StoredInvoiceFile[] => {
  const storedFiles = invoice.invoiceFiles;
  if (Array.isArray(storedFiles)) {
    return storedFiles.flatMap((file) => {
      if (typeof file === "string") return [{ name: file }];
      if (file && typeof file === "object" && "name" in file && typeof file.name === "string") {
        const dataUrl = "dataUrl" in file && typeof file.dataUrl === "string" ? file.dataUrl : undefined;
        return [{ name: file.name, dataUrl }];
      }
      return [];
    });
  }

  const fileNames = invoice.invoiceFileNames;
  return Array.isArray(fileNames)
    ? fileNames.filter((name): name is string => typeof name === "string").map((name) => ({ name }))
    : [];
};

const createEmptyInvoice = (manifestNo: string): VendorInvoiceRow => ({
  id: crypto.randomUUID(),
  vendorName: "",
  manifestNo,
  invoiceNo: "",
  invoiceDate: "",
  overdueDate: "",
  purchaseAmount: "",
  currency: "AED",
  vatPercent: "",
  vatAmount: "",
  finalAmountUsd: "",
  invoiceFiles: [],
});

const rowsFromPreAlert = (preAlert: Stage4Row | undefined): VendorInvoiceRow[] => {
  if (!preAlert) return [];
  const storedInvoices = preAlert.vendorInvoices;
  if (Array.isArray(storedInvoices) && storedInvoices.length > 0) {
    return storedInvoices.flatMap((storedInvoice) => {
      if (!storedInvoice || typeof storedInvoice !== "object") return [];
      const invoice = storedInvoice as Record<string, unknown>;
      return [{
        ...invoice,
        id: toStringValue(invoice.id) || crypto.randomUUID(),
        vendorName: toStringValue(invoice.vendorName),
        manifestNo: toStringValue(invoice.manifestNo) || preAlert.manifestNumber,
        invoiceNo: toStringValue(invoice.invoiceNo),
        invoiceDate: toStringValue(invoice.invoiceDate),
        overdueDate: toStringValue(invoice.overdueDate),
        purchaseAmount: toStringValue(invoice.purchaseAmount),
        currency: toStringValue(invoice.currency) || "AED",
        vatPercent: toStringValue(invoice.vatPercent),
        vatAmount: toStringValue(invoice.vatAmount),
        finalAmountUsd: getFinalAmountUsd(invoice),
        invoiceFiles: readInvoiceFiles(invoice),
      }];
    });
  }

  return [createEmptyInvoice(preAlert.manifestNumber)];
};

const readFileAsDataUrl = (file: File): Promise<StoredInvoiceFile> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve({ name: file.name, dataUrl: reader.result });
      } else {
        reject(new Error(`Could not read "${file.name}" as a data URL.`));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error(`Could not read "${file.name}".`));
    reader.readAsDataURL(file);
  });

/* Compact inputs: small height, tight padding, no number spinners eating width. */
const fieldSx: SxProps<Theme> = {
  "& .MuiInputBase-root": { fontSize: 13, bgcolor: "background.paper", borderRadius: 1 },
  "& .MuiInputBase-input": { py: "6px", px: "8px" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: "primary.light" },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main", borderWidth: 1 },
  "& input[type=number]": { MozAppearance: "textfield" },
  "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
  "& input[type=date]": { px: "6px" },
  "& .MuiInputLabel-root": { fontSize: 13 },
};

const headCellSx: SxProps<Theme> = {
  bgcolor: "action.hover",
  color: "text.primary",
  fontWeight: 600,
  fontSize: 12,
  lineHeight: 1.2,
  px: 0.75,
  py: 1,
  borderBottom: "2px solid",
  borderColor: "divider",
};

const bodyCellSx: SxProps<Theme> = {
  px: 0.2,
  py: 1,
  verticalAlign: "top",
  borderBottom: "1px solid",
  borderColor: "divider",
};

export default function EditVendorDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isWide = useMediaQuery(theme.breakpoints.up("lg"));
  const { id } = useParams();
  const locationPreAlert = (location.state as EditVendorLocationState | null)?.preAlert;
  const preAlert = useMemo(
    () => locationPreAlert ?? readStage4Rows().find((row) => row.id === id),
    [id, locationPreAlert],
  );
  const [invoices, setInvoices] = useState<VendorInvoiceRow[]>(() => rowsFromPreAlert(preAlert));
  const [error, setError] = useState("");

  const totalUsd = useMemo(
    () => invoices.reduce((sum, invoice) => {
      const value = Number(invoice.finalAmountUsd);
      return Number.isFinite(value) ? sum + value : sum;
    }, 0),
    [invoices],
  );

  const updateInvoice = <K extends keyof VendorInvoiceRow>(
    invoiceId: string,
    field: K,
    value: VendorInvoiceRow[K],
  ) => {
    setInvoices((current) =>
      current.map((invoice) => invoice.id === invoiceId ? { ...invoice, [field]: value } : invoice),
    );
    setError("");
  };

  const addInvoice = () => {
    setInvoices((current) => [...current, createEmptyInvoice(preAlert?.manifestNumber ?? "")]);
  };

  const removeInvoice = (invoiceId: string) => {
    setInvoices((current) => current.length > 1
      ? current.filter((item) => item.id !== invoiceId)
      : current);
  };

  const addFiles = async (invoiceId: string, event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (selectedFiles.length === 0) return;

    try {
      const storedFiles = await Promise.all(selectedFiles.map(readFileAsDataUrl));
      setInvoices((current) =>
        current.map((invoice) => invoice.id === invoiceId
          ? { ...invoice, invoiceFiles: [...invoice.invoiceFiles, ...storedFiles] }
          : invoice),
      );
      setError("");
    } catch (fileError) {
      console.error("Could not read vendor invoice upload.", fileError);
      setError(fileError instanceof Error ? fileError.message : "Could not read the selected invoice file.");
    }
  };

  const saveInvoices = () => {
    if (!preAlert) {
      setError("Pre-Alert details are unavailable. Open this page from the Stage 4 table.");
      return;
    }

    const incompleteRow = invoices.find((invoice) =>
      !invoice.vendorName || !invoice.manifestNo || !invoice.invoiceNo || !invoice.invoiceDate
      || !invoice.overdueDate || !invoice.purchaseAmount || !invoice.currency
      || invoice.vatPercent === "" || invoice.vatAmount === "" || !invoice.finalAmountUsd
      || invoice.invoiceFiles.length === 0,
    );
    if (invoices.length === 0 || incompleteRow) {
      setError("Complete all vendor invoice fields and upload at least one invoice file for each row.");
      return;
    }

    const latestRows = readStage4Rows();
    const existingRow = latestRows.find((row) => row.id === preAlert.id);
    const updatedPreAlert: Stage4Row = {
      ...(existingRow ?? preAlert),
      vendorInvoices: invoices.map((invoice) => ({
        ...invoice,
        finalAmountUsd: invoice.finalAmountUsd,
        invoiceFiles: invoice.invoiceFiles,
        invoiceFileNames: invoice.invoiceFiles.map((file) => file.name),
      })),
    };
    const updatedRows = [
      ...latestRows.filter((row) => row.id !== preAlert.id),
      updatedPreAlert,
    ];

    try {
      localStorage.setItem(STAGE4_STORAGE_KEY, JSON.stringify(updatedRows));
      navigate("/jobs/pre-alert-stage-4");
    } catch (storageError) {
      console.error("Could not save vendor invoice details.", storageError);
      setError("Could not save vendor invoice details. The uploaded files may exceed the available browser storage.");
    }
  };

  const renderField = (invoice: VendorInvoiceRow, field: FieldDef, withLabel: boolean) => {
    const common = {
      size: "small" as const,
      fullWidth: true,
      label: withLabel ? field.label : undefined,
      value: invoice[field.key],
      onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        updateInvoice(invoice.id, field.key, event.target.value),
      sx: fieldSx,
      inputProps: { "aria-label": field.label },
    };

    if (field.type === "currency") {
      return (
        <TextField select {...common}>
          {CURRENCIES.map((currency) => (
            <MenuItem key={currency} value={currency} sx={{ fontSize: 13 }}>{currency}</MenuItem>
          ))}
        </TextField>
      );
    }
    if (field.type === "date") {
      return <TextField {...common} type="date" slotProps={{ inputLabel: { shrink: true } }} />;
    }
    return <TextField {...common} type={field.type} />;
  };

  const renderUpload = (invoice: VendorInvoiceRow) => (
    <Stack spacing={0.5} sx={{ minWidth: 0 }}>
      <Button
        component="label"
        size="small"
        variant="outlined"
        startIcon={<CloudUploadOutlinedIcon sx={{ fontSize: 16 }} />}
        sx={{
          textTransform: "none",
          fontSize: 12,
          py: 0.25,
          color: "primary.main",
          borderColor: "primary.main",
          alignSelf: "flex-start",
          "&:hover": { borderColor: "primary.dark", bgcolor: "action.hover" },
        }}
      >
        Add files
        <input
          hidden
          type="file"
          multiple
          accept="application/pdf,image/jpeg,image/png,image/webp,.doc,.docx,.eml,.msg"
          onChange={(event) => { void addFiles(invoice.id, event); }}
        />
      </Button>

      {invoice.invoiceFiles.length === 0 ? (
        <Typography variant="caption" color="text.secondary">No files uploaded</Typography>
      ) : invoice.invoiceFiles.map((file, index) => (
        <Box
          key={`${file.name}-${index}`}
          sx={{ display: "flex", alignItems: "center", gap: 0.25, minWidth: 0, bgcolor: "action.hover", borderRadius: 1, pl: 0.5 }}
        >
          <InsertDriveFileOutlinedIcon sx={{ fontSize: 16, color: "primary.main" }} />
          {file.dataUrl ? (
            <Tooltip disableInteractive title={file.name} >
              <Typography
                component="a"
                href={file.dataUrl}
                download={file.name}
                variant="caption"
                sx={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "primary.main", textDecoration: "none" }}
              >
                {file.name}
              </Typography>
            </Tooltip>
          ) : (
            <Tooltip disableInteractive title="This file was uploaded before file contents were stored; only its name is available.">
              <Typography variant="caption" sx={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {file.name}
              </Typography>
            </Tooltip>
          )}
          {file.dataUrl && (
            <Tooltip disableInteractive title="Download file">
              <IconButton color="success" size="small" sx={{ p: 0.25 }} aria-label={`Download ${file.name}`} component="a" href={file.dataUrl} download={file.name}>
                <DownloadOutlinedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip disableInteractive title={`Remove ${file.name}`}>
            <IconButton
              size="small"
              color="error"
              sx={{ p: 0.25 }}
              aria-label={`Remove ${file.name}`}
              onClick={() => updateInvoice(invoice.id, "invoiceFiles", invoice.invoiceFiles.filter((_, fileIndex) => fileIndex !== index))}
            >
              <DeleteOutlinedIcon sx={{ fontSize: 12 }} />
            </IconButton>
          </Tooltip>
        </Box>
      ))}
    </Stack>
  );

  if (!preAlert) {
    return (
      <Stack spacing={2}>
        <Alert severity="warning">Pre-Alert details are unavailable. Open this page from the Stage 4 table.</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/jobs/pre-alert-stage-4")}>
          Back to Stage 4
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={1.5} sx={{ minWidth: 0 }}>
      {/* Page header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.2 }}>
            Edit Vendor Details
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.25 }}>
            Manifest{" "}
            <Box component="span" sx={{ fontWeight: 700, color: "primary.main" }}>{preAlert.manifestNumber}</Box>
          </Typography>
        </Box>
        <Button
          size="small"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/jobs/pre-alert-stage-4")}
        >
          Back to Stage 4
        </Button>
      </Box>

      <Paper
        variant="outlined"
        sx={{ p: { xs: 1.25, md: 1.5 }, minWidth: 0, borderColor: "divider", bgcolor: "background.paper", borderRadius: 2 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
            Vendor invoices
          </Typography>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            size="small"
            disableElevation
            onClick={addInvoice}
            sx={{ textTransform: "none" }}
          >
            Add vendor
          </Button>
        </Box>

        {invoices.length === 0 ? (
          <Box sx={{ py: 4, textAlign: "center", color: "text.secondary", bgcolor: "background.paper", border: "1px dashed", borderColor: "divider", borderRadius: 1 }}>
            No vendor details yet. Select Add vendor to add a row.
          </Box>
        ) : isWide ? (
          /* Desktop: one fixed-layout table that always fits the page width */
          <TableContainer sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, bgcolor: "background.paper", overflowX: "hidden" }}>
            <Table size="small" sx={{ width: "100%", tableLayout: "fixed" }}>
              <colgroup>
                {FIELDS.map((field) => <col key={field.key} style={{ width: field.width }} />)}
                <col style={{ width: UPLOAD_WIDTH }} />
                <col style={{ width: ACTION_WIDTH }} />
              </colgroup>
              <TableHead>
                <TableRow>
                  {FIELDS.map((field) => <TableCell key={field.key} sx={headCellSx}>{field.label}</TableCell>)}
                  <TableCell sx={headCellSx}>Invoice Upload</TableCell>
                  <TableCell sx={headCellSx} />
                </TableRow>
              </TableHead>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id} sx={{ "&:hover": { bgcolor: "action.hover" }, "&:last-child td": { borderBottom: "none" } }}>
                    {FIELDS.map((field) => (
                      <TableCell key={field.key} sx={bodyCellSx}>{renderField(invoice, field, false)}</TableCell>
                    ))}
                    <TableCell sx={bodyCellSx}>{renderUpload(invoice)}</TableCell>
                    <TableCell align="center" sx={{ ...bodyCellSx, px: 0 }}>
                      <Tooltip disableInteractive title={invoices.length === 1 ? "At least one vendor row is required" : "Remove vendor row"}>
                        <span>
                        <IconButton color="error" size="small" aria-label="Remove vendor row" disabled={invoices.length === 1} onClick={() => removeInvoice(invoice.id)}>
                          <DeleteOutlinedIcon fontSize="small" />
                        </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          /* Smaller screens: each vendor becomes a compact card, still no horizontal scroll */
          <Stack spacing={1}>
            {invoices.map((invoice, index) => (
              <Paper key={invoice.id} variant="outlined" sx={{ p: 1, borderColor: "divider", borderRadius: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
                    Vendor {index + 1}
                  </Typography>
                  <Tooltip disableInteractive title={invoices.length === 1 ? "At least one vendor row is required" : "Remove vendor row"}>
                    <span>
                    <IconButton color="error" size="small" aria-label="Remove vendor row" disabled={invoices.length === 1} onClick={() => removeInvoice(invoice.id)}>
                      <DeleteOutlinedIcon fontSize="small" />
                    </IconButton>
                    </span>
                  </Tooltip>
                </Box>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 0.5 }}>
                  {FIELDS.map((field) => (
                    <Box key={field.key}>{renderField(invoice, field, true)}</Box>
                  ))}
                </Box>
                <Box sx={{ mt: 0.5 }}>{renderUpload(invoice)}</Box>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>

      {error && <Alert severity="error" sx={{ py: 0.25 }}>{error}</Alert>}

      {/* Footer */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Total (USD){" "}
          <Box component="span" sx={{ fontWeight: 700, color: "primary.main" }}>
            {totalUsd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Box>
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => navigate("/jobs/pre-alert-stage-4")}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            disableElevation
            onClick={saveInvoices}
            sx={{ textTransform: "none" }}
          >
            Update vendor details
          </Button>
        </Box>
      </Box>
    </Stack>
  );
}