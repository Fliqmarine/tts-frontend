import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import SendIcon from "@mui/icons-material/Send";
import { Alert, Box, Button, IconButton, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useMemo, useState, type FormEvent } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { PreAlertDetails } from "./types/preAlert.types";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const STAGE3_STORAGE_KEY = "tts-demo-pre-alert-stage-3";
const STAGE4_STORAGE_KEY = "tts-demo-pre-alert-stage-4";
const VENDORS = ["Al Futtaim Logistics", "Gulf Agency Company", "Agility Global", "DP World Services", "Aramex Freight", "Kuehne + Nagel ME", "DB Schenker UAE", "Tristar Transport"];
const CURRENCIES = ["AED", "USD", "EUR", "GBP", "INR"];
const FIELD_HEIGHT = 36;

const compactTableSx = {
  tableLayout: "fixed",
  width: "100%",
  "& .MuiTableCell-root": { px: 0.5, py: 0.75, verticalAlign: "middle", borderColor: "divider" },
  "& .MuiTableCell-head": { fontWeight: 700, fontSize: 12, lineHeight: 1.2, color: "text.secondary", bgcolor: "action.hover", py: 1 },
  "& .MuiInputBase-root": { fontSize: 13, height: FIELD_HEIGHT, width: "100%" },
  "& .MuiOutlinedInput-input": { height: FIELD_HEIGHT, boxSizing: "border-box", py: 0, pl: 1, pr: 0.5 },
  "& .MuiSelect-select": { display: "flex", alignItems: "center", pr: "24px !important" },
  "& .MuiSelect-icon": { right: 2 },
  "& input[type=number]": { MozAppearance: "textfield" },
  "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button": { WebkitAppearance: "none", margin: 0 },
  "& input[type=date]": { fontSize: 12, pr: 0 },
} as const;

const COLUMNS: { label: string; width: string; align?: "right" | "center" }[] = [
  { label: "Vendor Name", width: "14%" },
  { label: "Manifest No", width: "12%" },
  { label: "Invoice No", width: "11%" },
  { label: "Invoice Date", width: "8%" },
  { label: "Overdue Date", width: "8%" },
  { label: "Purchase Amount", width: "8%" },
  { label: "Currency", width: "7%" },
  { label: "VAT %", width: "5%" },
  { label: "VAT Amount", width: "7%" },
  { label: "Final Amount (AED)", width: "8%" },
  { label: "Invoice", width: "10%", align: "center" },
  { label: "", width: "0%", align: "center" },
];


const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

type PreAlertRow = PreAlertDetails & { mailSent?: "Yes" | "No"; [key: string]: unknown };
type VendorInvoice = {
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
  finalAmountAed: string;
  invoiceFiles: File[];
};
type DocumentKey = "proofOfDelivery" | "clientPo" | "emailConfirmation";

const emptyInvoice = (manifestNo: string): VendorInvoice => ({ id: crypto.randomUUID(), vendorName: "", manifestNo, invoiceNo: "", invoiceDate: "", overdueDate: "", purchaseAmount: "", currency: "AED", vatPercent: "", vatAmount: "", finalAmountAed: "", invoiceFiles: [] });

function SelectedFile({ file, onRemove }: { file: File; onRemove: () => void }) {
  return (
    <Tooltip title={file.name}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, px: 1, py: 0.25, borderRadius: 1, border: "1px solid", borderColor: "success.light", bgcolor: "rgba(46,125,50,0.06)", maxWidth: "100%", minWidth: 0 }}>
        <InsertDriveFileIcon sx={{ fontSize: 13, color: "success.main", flexShrink: 0 }} />
        <Typography variant="caption" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "success.main", fontWeight: 500, maxWidth: { xs: 160, sm: 180 } }}>{file.name}</Typography>
        <IconButton aria-label={`Remove ${file.name}`} size="small" onClick={onRemove} sx={{ p: 0.15, ml: 0.25, flexShrink: 0 }}><CloseIcon sx={{ fontSize: 14 }} /></IconButton>
      </Box>
    </Tooltip>
  );
}

function InvoiceUploadCell({ files, onAdd, onClear, onRemove }: { files: File[]; onAdd: (files: File[]) => void; onClear: () => void; onRemove: (index: number) => void }) {
  const has = files.length > 0;
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 0.5, minWidth: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.25 }}>
        <Tooltip title="Upload invoice files">
          <Button
            component="label"
            size="small"
            variant={has ? "outlined" : "contained"}
            color={has ? "success" : "primary"}
            tabIndex={-1}
            startIcon={has ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : <CloudUploadOutlinedIcon sx={{ fontSize: 16 }} />}
            sx={{ textTransform: "none", height: FIELD_HEIGHT, minWidth: 0, px: 1, fontSize: 12, whiteSpace: "nowrap" }}
          >
            {has ? `${files.length} file${files.length > 1 ? "s" : ""}` : "Upload"}
            <VisuallyHiddenInput
              type="file"
              multiple
              accept="application/pdf,image/jpeg,image/png,image/webp"
              onChange={(event) => { onAdd(Array.from(event.target.files ?? [])); event.target.value = ""; }}
            />
          </Button>
        </Tooltip>
        {has && (
           <IconButton size="small" aria-label="Clear all invoice files" onClick={onClear} sx={{ p: 0.25 }}>
              <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>
        )}
      </Box>
      {files.map((file, index) => (
        <Box key={`${file.name}-${index}`} sx={{ display: "flex", alignItems: "center", gap: 0.25, minWidth: 0 }}>
          <Tooltip title={file.name}>
            <Typography variant="caption" sx={{ display: "block", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "success.main", lineHeight: 1.3 }}>
              {file.name}
            </Typography>
          </Tooltip>
          <IconButton size="small" aria-label={`Remove ${file.name}`} onClick={() => onRemove(index)} sx={{ p: 0.1, flexShrink: 0 }}>
            <CloseIcon sx={{ fontSize: 13 }} />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
}

export default function PreAlertStage3To4ConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const locationRow = (location.state as { preAlert?: PreAlertRow } | null)?.preAlert;
  const storedRows = useMemo(() => {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(STAGE3_STORAGE_KEY) ?? "[]");
      return Array.isArray(parsed) ? parsed as PreAlertRow[] : [];
    } catch { return []; }
  }, []);
  const preAlert = locationRow ?? storedRows.find((row) => row.id === id);
  const [documents, setDocuments] = useState<Record<DocumentKey, File[]>>({ proofOfDelivery: [], clientPo: [], emailConfirmation: [] });
  const [invoices, setInvoices] = useState<VendorInvoice[]>(() => preAlert ? [emptyInvoice(preAlert.manifestNumber)] : []);
  const [error, setError] = useState("");
  const manifestOptions = useMemo(() => [...new Set([...(preAlert ? [preAlert.manifestNumber] : []), ...storedRows.map((row) => row.manifestNumber)])], [preAlert, storedRows]);

  const updateInvoice = <K extends Exclude<keyof VendorInvoice, "id">,>(invoiceId: string, field: K, value: VendorInvoice[K]) => {
    setInvoices((current) => current.map((invoice) => invoice.id === invoiceId ? { ...invoice, [field]: value } : invoice));
  };
  const addInvoice = () => setInvoices((current) => [...current, emptyInvoice(preAlert?.manifestNumber ?? "")]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!preAlert) return;
    const documentsComplete = Object.values(documents).every((files) => files.length > 0);
    const invoicesComplete = invoices.length > 0 && invoices.every((invoice) => invoice.vendorName && invoice.manifestNo && invoice.invoiceNo && invoice.invoiceDate && invoice.overdueDate && invoice.purchaseAmount && invoice.currency && invoice.vatPercent !== "" && invoice.vatAmount !== "" && invoice.finalAmountAed && invoice.invoiceFiles.length > 0);
    if (!documentsComplete || !invoicesComplete) {
      setError("Upload all three required documents and complete every vendor invoice row.");
      return;
    }

    const promoted = {
      ...preAlert,
      stage: 4,
      stage4Documents: Object.fromEntries(Object.entries(documents).map(([key, files]) => [key, files.map((file) => file.name)])),
      vendorInvoices: invoices.map(({ invoiceFiles, ...invoice }) => ({ ...invoice, invoiceFileNames: invoiceFiles.map((file) => file.name) })),
    };
    const latestStage3 = (() => {
      try { const parsed: unknown = JSON.parse(localStorage.getItem(STAGE3_STORAGE_KEY) ?? "[]"); return Array.isArray(parsed) ? parsed as PreAlertRow[] : []; }
      catch { return []; }
    })();
    const latestStage4 = (() => {
      try { const parsed: unknown = JSON.parse(localStorage.getItem(STAGE4_STORAGE_KEY) ?? "[]"); return Array.isArray(parsed) ? parsed as PreAlertRow[] : []; }
      catch { return []; }
    })();
    localStorage.setItem(STAGE3_STORAGE_KEY, JSON.stringify(latestStage3.filter((row) => row.id !== preAlert.id)));
    localStorage.setItem(STAGE4_STORAGE_KEY, JSON.stringify([...latestStage4.filter((row) => row.id !== preAlert.id), promoted]));
    navigate("/jobs/pre-alert-stage-4", { replace: true });
  };

  if (!preAlert) {
    return <Stack spacing={2}><Alert severity="warning">Pre-Alert details are unavailable. Open this page from the Stage 3 table.</Alert><Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/jobs/pre-alert-stage-3")}>Back to Stage 3</Button></Stack>;
  }

  const documentFields: { key: DocumentKey; label: string }[] = [
    { key: "proofOfDelivery", label: "Proof of Delivery" },
    { key: "clientPo", label: "Client PO" },
    { key: "emailConfirmation", label: "Email Confirmation" },
  ];

  return (
    <Box component="form" onSubmit={submit}>
      <Stack spacing={2.5}>
        <Box sx={{ display: "flex", alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 2, flexWrap: "wrap" }}>
            <Typography variant="h5" fontWeight={700}>Move Pre-Alert to Stage 4</Typography>
            <Typography variant="h5" fontWeight={700} component="span" color="primary">Manifest: {preAlert.manifestNumber}</Typography>
          </Box>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/jobs/pre-alert-stage-3")}>Back to Stage 3</Button>
        </Box>

        <Paper sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Upload Details</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" }, gap: 2 }}>
            {documentFields.map(({ key, label }) => (
              <Box key={key} sx={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 1, p: 1.5, border: "1px solid", borderColor: "divider", borderRadius: 1, minWidth: 0 }}>
                <Button component="label" variant={documents[key].length ? "outlined" : "contained"} tabIndex={-1} startIcon={documents[key].length ? <CheckCircleIcon color="success" /> : <CloudUploadOutlinedIcon />} color={documents[key].length ? "success" : "primary"} sx={{ textTransform: "none" }}>
                  {documents[key].length ? `Add more ${label} files` : `Upload ${label} *`}
                  <VisuallyHiddenInput type="file" multiple accept="application/pdf,image/jpeg,image/png,image/webp,.doc,.docx,.eml,.msg" onChange={(event) => { const files = Array.from(event.target.files ?? []); setDocuments((current) => ({ ...current, [key]: [...current[key], ...files] })); setError(""); event.target.value = ""; }} />
                </Button>
                {documents[key].length ? <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>{documents[key].map((file, index) => <SelectedFile key={`${file.name}-${index}`} file={file} onRemove={() => setDocuments((current) => ({ ...current, [key]: current[key].filter((_, fileIndex) => fileIndex !== index) }))} />)}</Box> : <Typography variant="caption" color="text.secondary">No files uploaded</Typography>}
              </Box>
            ))}
          </Box>
        </Paper>

        
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 1.5 }}>
              <Typography variant="h6" fontWeight={700}>Vendor Details</Typography>
              <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={addInvoice}>Add Vendor</Button>
            </Box>

            <TableContainer sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1, bgcolor: "background.paper", overflowX: "auto" }}>
              <Table size="small" sx={compactTableSx}>
                <colgroup>{COLUMNS.map((col, index) => <col key={index} style={{ width: col.width }} />)}</colgroup>
                <TableHead><TableRow>{COLUMNS.map((col, index) => <TableCell key={index} align={col.align}>{col.label}</TableCell>)}</TableRow></TableHead>
                
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id} hover>
                      <TableCell>
                        <TextField select required fullWidth hiddenLabel size="small" placeholder="select" value={invoice.vendorName} onChange={(event) => updateInvoice(invoice.id, "vendorName", event.target.value)} SelectProps={{ displayEmpty: true, renderValue: (value) => (value as string) || <Typography component="span" sx={{ fontSize: 13, color: "text.disabled" }}>Select vendor</Typography> }}>
                          {VENDORS.map((vendor) => <MenuItem key={vendor} value={vendor}>{vendor}</MenuItem>)}
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <TextField select required fullWidth hiddenLabel size="small" value={invoice.manifestNo} onChange={(event) => updateInvoice(invoice.id, "manifestNo", event.target.value)} SelectProps={{ displayEmpty: true, renderValue: (value) => (value as string) || <Typography component="span" sx={{ fontSize: 13, color: "text.disabled" }}>Select</Typography> }}>
                          {manifestOptions.map((manifest) => <MenuItem key={manifest} value={manifest}>{manifest}</MenuItem>)}
                        </TextField>
                      </TableCell>
                      <TableCell><TextField required fullWidth hiddenLabel size="small" placeholder="Invoice No" value={invoice.invoiceNo} onChange={(event) => updateInvoice(invoice.id, "invoiceNo", event.target.value)} /></TableCell>
                      <TableCell><TextField required fullWidth hiddenLabel size="small" type="date" value={invoice.invoiceDate} onChange={(event) => updateInvoice(invoice.id, "invoiceDate", event.target.value)} /></TableCell>
                      <TableCell><TextField required fullWidth hiddenLabel size="small" type="date" value={invoice.overdueDate} onChange={(event) => updateInvoice(invoice.id, "overdueDate", event.target.value)} /></TableCell>
                      <TableCell><TextField required fullWidth hiddenLabel size="small" type="number" placeholder="0.00" value={invoice.purchaseAmount} onChange={(event) => { const amount = event.target.value; const vatAmount = amount && invoice.vatPercent ? (Number(amount) * Number(invoice.vatPercent) / 100).toFixed(2) : ""; updateInvoice(invoice.id, "purchaseAmount", amount); updateInvoice(invoice.id, "vatAmount", vatAmount); }} /></TableCell>
                      <TableCell>
                        <TextField select required fullWidth hiddenLabel size="small" value={invoice.currency} onChange={(event) => updateInvoice(invoice.id, "currency", event.target.value)}>
                          {CURRENCIES.map((currency) => <MenuItem key={currency} value={currency}>{currency}</MenuItem>)}
                        </TextField>
                      </TableCell>
                      <TableCell><TextField required fullWidth hiddenLabel size="small" type="number" placeholder="%" value={invoice.vatPercent} onChange={(event) => { const rate = event.target.value; const vatAmount = invoice.purchaseAmount && rate ? (Number(invoice.purchaseAmount) * Number(rate) / 100).toFixed(2) : ""; updateInvoice(invoice.id, "vatPercent", rate); updateInvoice(invoice.id, "vatAmount", vatAmount); }} /></TableCell>
                      <TableCell><TextField required fullWidth hiddenLabel size="small" type="number" placeholder="0.00" value={invoice.vatAmount} onChange={(event) => updateInvoice(invoice.id, "vatAmount", event.target.value)} /></TableCell>
                      <TableCell><TextField required fullWidth hiddenLabel size="small" type="number" placeholder="0.00" value={invoice.finalAmountAed} onChange={(event) => updateInvoice(invoice.id, "finalAmountAed", event.target.value)} /></TableCell>
                      <TableCell  ><InvoiceUploadCell files={invoice.invoiceFiles} onAdd={(files) => updateInvoice(invoice.id, "invoiceFiles", [...invoice.invoiceFiles, ...files])} onClear={() => updateInvoice(invoice.id, "invoiceFiles", [])} onRemove={(fileIndex) => updateInvoice(invoice.id, "invoiceFiles", invoice.invoiceFiles.filter((_, index) => index !== fileIndex))} /></TableCell>
                      <TableCell align="center">
                        <IconButton aria-label="Remove vendor invoice" color="error" size="small" disabled={invoices.length === 1} onClick={() => setInvoices((current) => current.filter((item) => item.id !== invoice.id))}>
                          <DeleteOutlinedIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        

        {error && <Alert severity="error">{error}</Alert>}
        <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
            <Button
                type="submit"
                variant="contained"
                color="success"
                size="large"
                disableElevation
                endIcon={<SendIcon />}
                sx={{
                    minWidth: 190,
                    px: 3,
                    py: 1.25,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    color: "#fff",
                    backgroundColor: "#16a34a",
                    backgroundImage: "linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)",
                    backgroundSize: "200% 100%",
                    backgroundPosition: "0% 50%",
                    boxShadow: "0 2px 8px rgba(22,163,74,0.35)",
                    transition: "transform .15s ease, box-shadow .2s ease, background-position .35s ease",

                    "& .MuiButton-endIcon": {
                    transition: "transform .25s cubic-bezier(.2,.8,.2,1)",
                    },

                    "&:hover": {
                    backgroundColor: "#16a34a",
                    backgroundPosition: "100% 50%",
                    boxShadow: "0 6px 20px rgba(22,163,74,0.45)",
                    transform: "translateX(2px)",
                    "& .MuiButton-endIcon": {
                        transform: "translate(15px, -1px)",
                    },
                    },

                    "&:active": {
                    transform: "translateY(0)",
                    boxShadow: "0 2px 8px rgba(22,163,74,0.35)",
                    "& .MuiButton-endIcon": {
                        transform: "translate(10px, -4px) rotate(-20deg) scale(1)",
                    },
                    },

                    "&:focus-visible": {
                    outline: "3px solid rgba(22,163,74,0.4)",
                    outlineOffset: 2,
                    },

                    "&.Mui-disabled": {
                    backgroundImage: "none",
                    backgroundColor: "action.disabledBackground",
                    color: "action.disabled",
                    boxShadow: "none",
                    },

                    "@media (prefers-reduced-motion: reduce)": {
                    transition: "none",
                    "& .MuiButton-endIcon": { transition: "none" },
                    "&:hover, &:active": {
                        transform: "none",
                        "& .MuiButton-endIcon": { transform: "none" },
                    },
                    },
                }}
                >
                Move to Stage 4
            </Button>
        </Box>


        {/* <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1 }}>
            <Button
                type="submit"
                variant="contained"
                color="success"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{ minWidth: 190, px: 3, py: 1.25, borderRadius: 2, textTransform: "none", fontWeight: 700, boxShadow: 1, "&:hover": { boxShadow: 3 } }}

                sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: 15,
                letterSpacing: 0.2,
                px: 4,
                py: 1.25,
                borderRadius: 2,
                background: "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)",
                boxShadow: "0 4px 14px rgba(46,125,50,0.35)",
                transition: "transform .2s ease, box-shadow .2s ease, background .2s ease",
                "& .MuiButton-endIcon": { transition: "transform .2s ease" },
                "&:hover": {
                    background: "linear-gradient(135deg, #388e3c 0%, #1b5e20 100%)",
                    boxShadow: "0 6px 20px rgba(46,125,50,0.45)",
                    transform: "translateY(-1px)",
                    "& .MuiButton-endIcon": { transform: "translateX(4px)" },
                },
                "&:active": {
                    transform: "translateY(0)",
                    boxShadow: "0 2px 8px rgba(46,125,50,0.35)",
                },
                "&:focus-visible": {
                    outline: "3px solid rgba(46,125,50,0.35)",
                    outlineOffset: 2,
                },
                }}
            >
                Move to Stage 4
            </Button>
        </Box> */}
      </Stack>
    </Box>
  );
}
