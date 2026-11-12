import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import {
  Alert,
  Box,
  Button,
  Chip,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { useMemo, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DEMO_BANKS } from "../master/banks/bankData";
import {
  PROFORMA_RECEIPT_STATUSES,
  PROFORMA_RECEIPTS_STORAGE_KEY,
  PROFORMA_INVOICE_STORAGE_KEY,
  PROFORMA_CLIENTS,
  ProformaReceiptRecordSchema,
  ProformaInvoiceSchema,
  type ProformaInvoice,
  type ProformaCurrencyTotals,
  type ProformaReceiptFormValues,
  type ProformaReceiptLocationState,
  type ProformaReceiptRecord,
  type ProformaReceiptStatus,
} from "./types/proformaInvoice.types";

const DEMO_INVOICE_ID = "demo-proforma-001";

const activeBanks = DEMO_BANKS.filter((bank) => bank.isActive);

/* ---------- shared styles ---------- */

const fieldSx: SxProps<Theme> = {
  minWidth: 0,
  "& .MuiOutlinedInput-root": { borderRadius: 1, backgroundColor: "background.paper" },
};

const sectionSx: SxProps<Theme> = {
  p: { xs: 1.5, sm: 2 },
  display: "flex",
  flexDirection: "column",
  gap: 0.5,
  minWidth: 0,
};

const sectionHeaderSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  borderBottom: "2px solid",
  borderColor: "divider",
  pb: 0.75,
  mb: 1.5,
};

/* ---------- helpers ---------- */

const numericValue = (value: string | number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatDate = (value: string) =>
  value ? new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString() : "—";

const formatAmount = (value: number, currency: string) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency || "AED",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const getInvoiceNumber = (invoice: ProformaInvoice) =>
  `PF-${invoice.id === DEMO_INVOICE_ID ? "DEMO-001" : invoice.id.slice(0, 8).toUpperCase()}`;

const createInitialReceiptForm = (
  invoice: ProformaInvoice,
  invoiceTotal?: number,
): ProformaReceiptFormValues => ({
  invoiceId: invoice.id,
  client: invoice.client,
  bankId: "",
  bankReference: "",
  clientReference: "",
  comments: "",
  receivedDate: new Date().toISOString().slice(0, 10),
  amount: invoiceTotal === undefined ? "" : String(invoiceTotal),
  status: "Invoice Generated",
  documents: [],
});

const loadReceiptForm = (
  invoice: ProformaInvoice,
  invoiceTotal?: number,
): { form: ProformaReceiptFormValues; error: string } => {
  const initialForm = createInitialReceiptForm(invoice, invoiceTotal);
  try {
    const stored: unknown = JSON.parse(
      window.localStorage.getItem(PROFORMA_RECEIPTS_STORAGE_KEY) ?? "[]",
    );
    if (!Array.isArray(stored)) {
      throw new Error("Saved proforma receipt data has an invalid format.");
    }

    const records = stored.map((item) => ProformaReceiptRecordSchema.parse(item));
    const savedReceipt = records.find((item) => item.invoiceId === invoice.id);
    return savedReceipt
      ? { form: { ...savedReceipt, amount: String(savedReceipt.amount) }, error: "" }
      : { form: initialForm, error: "" };
  } catch (error) {
    console.error("Could not load proforma receipt details.", error);
    return {
      form: initialForm,
      error: error instanceof Error ? error.message : "Could not load proforma receipt details.",
    };
  }
};

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error(`Could not read ${file.name}.`));
        return;
      }
      resolve(reader.result);
    };
    reader.onerror = () => reject(reader.error ?? new Error(`Could not read ${file.name}.`));
    reader.readAsDataURL(file);
  });

/* ---------- small UI pieces ---------- */

function SectionHeader({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <Box sx={sectionHeaderSx}>
      {icon}
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
    </Box>
  );
}

function DetailItem({
  label,
  children,
  highlight = false,
}: {
  label: string;
  children?: ReactNode;
  highlight?: boolean;
}) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontWeight: highlight ? 700 : 500,
          color: highlight && children ? "primary.main" : "text.primary",
          wordBreak: "break-word",
        }}
      >
        {children || "—"}
      </Typography>
    </Box>
  );
}

/* ---------- page ---------- */

export default function ProformaReceiptUpdatePage() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as ProformaReceiptLocationState | null;

  const invoice = useMemo(() => {
    if (!invoiceId) return null;

    try {
      const stateInvoice = locationState?.invoice;
      if (stateInvoice?.id === invoiceId) {
        const parsed = ProformaInvoiceSchema.safeParse(stateInvoice);
        if (parsed.success) return parsed.data;
      }

      const stored: unknown = JSON.parse(
        window.localStorage.getItem(PROFORMA_INVOICE_STORAGE_KEY) ?? "[]",
      );
      if (!Array.isArray(stored)) {
        throw new Error("Saved proforma invoice data has an invalid format.");
      }
      return (
        stored.map((item) => ProformaInvoiceSchema.parse(item)).find((item) => item.id === invoiceId) ??
        null
      );
    } catch (error) {
      console.error("Could not load proforma invoice details.", error);
      return null;
    }
  }, [invoiceId, locationState]);

  const totalsByCurrency = useMemo(() => {
    const totals: Record<string, ProformaCurrencyTotals> = {};
    (invoice?.lines ?? []).forEach((line) => {
      const net = numericValue(line.unitPrice) * numericValue(line.quantity);
      const gross = net * (1 + numericValue(line.vat) / 100);
      const current = totals[line.currency] ?? { subtotal: 0, vat: 0, gross: 0 };
      totals[line.currency] = {
        subtotal: current.subtotal + net,
        vat: current.vat + (gross - net),
        gross: current.gross + gross,
      };
    });
    return totals;
  }, [invoice]);

  if (!invoice) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Alert severity="error">
          Proforma invoice details are unavailable. Return to the Proforma Invoices list and select an
          invoice.
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/finance/proforma-invoices")}
          sx={{ alignSelf: "flex-start" }}
        >
          Back to Proforma Invoices
        </Button>
      </Box>
    );
  }

  const invoiceTotalLabel =
    Object.entries(totalsByCurrency)
      .map(([currency, totals]) => formatAmount(totals.gross, currency))
      .join(" + ") || formatAmount(0, invoice.currency);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "100%", minWidth: 0 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          flexWrap: "wrap",
          mb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Proforma Receipt Update{" "}
            <Box component="span" sx={{ color: "primary.main" }}>
              {getInvoiceNumber(invoice)}
            </Box>
          </Typography>
          <Box>
            <Chip size="small" label={`Total: ${invoiceTotalLabel}`} color="primary" />
          </Box>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/finance/proforma-invoices")}
        >
          Back
        </Button>
      </Box>

      {/* Invoice details + address */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 1.7fr) minmax(280px, 1fr)" },
          gap: 1,
          alignItems: "stretch",
        }}
      >
        <Paper elevation={3} sx={sectionSx}>
          <SectionHeader
            icon={<DescriptionOutlinedIcon color="primary" />}
            title="Client & Invoice Details"
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                sm: "repeat(3, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            <DetailItem label="Client" highlight>
              {invoice.client}
            </DetailItem>
            <DetailItem label="Vessel" highlight>
              {invoice.vesselName}
            </DetailItem>
            <DetailItem label="Manifest no." highlight>
              {invoice.manifestNumber}
            </DetailItem>
            <DetailItem label="Client PO no.">{invoice.clientPoNumber}</DetailItem>
            <DetailItem label="Invoice date">{formatDate(invoice.invoiceDate)}</DetailItem>
            <DetailItem label="Currency">{invoice.currency}</DetailItem>
          </Box>
        </Paper>

        <Paper elevation={3} sx={sectionSx}>
          <SectionHeader icon={<DescriptionOutlinedIcon color="primary" />} title="Client Address" />
          <Typography variant="body2" sx={{ whiteSpace: "pre-line", fontWeight: 500 }}>
            {invoice.clientAddress || "—"}
          </Typography>
        </Paper>
      </Box>

      {/* Receipt form */}
      <ProformaReceiptForm
        key={invoice.id}
        invoice={invoice}
        invoiceTotal={totalsByCurrency[invoice.currency]?.gross}
      />
    </Box>
  );
}

/* ---------- receipt form ---------- */

function ProformaReceiptForm({
  invoice,
  invoiceTotal,
}: {
  invoice: ProformaInvoice;
  invoiceTotal?: number;
}) {
  const navigate = useNavigate();
  const initialState = useMemo(
    () => loadReceiptForm(invoice, invoiceTotal),
    [invoice, invoiceTotal],
  );
  const [form, setForm] = useState(initialState.form);
  const [error, setError] = useState(initialState.error);
  const [saved, setSaved] = useState(false);
  const [readingFiles, setReadingFiles] = useState(false);

  const updateField = <K extends keyof ProformaReceiptFormValues>(
    field: K,
    value: ProformaReceiptFormValues[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setSaved(false);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    setReadingFiles(true);
    setError("");
    try {
      const documents = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          type: file.type,
          dataUrl: await readFileAsDataUrl(file),
        })),
      );
      setForm((current) => ({ ...current, documents: [...current.documents, ...documents] }));
      setSaved(false);
    } catch (fileError) {
      console.error("Could not attach proforma receipt documents.", fileError);
      setError(
        fileError instanceof Error
          ? fileError.message
          : "Could not attach proforma receipt documents.",
      );
    } finally {
      setReadingFiles(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const amount = Number(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }
    if (!form.receivedDate) {
      setError("Select the date the payment was received.");
      return;
    }

    try {
      const stored: unknown = JSON.parse(
        window.localStorage.getItem(PROFORMA_RECEIPTS_STORAGE_KEY) ?? "[]",
      );
      if (!Array.isArray(stored)) {
        throw new Error("Saved proforma receipt data has an invalid format.");
      }

      const receipts: ProformaReceiptRecord[] = stored.map((item) =>
        ProformaReceiptRecordSchema.parse(item),
      );
      const updatedReceipt = ProformaReceiptRecordSchema.parse({ ...form, amount });
      const existingIndex = receipts.findIndex(
        (receipt) => receipt.invoiceId === updatedReceipt.invoiceId,
      );
      if (existingIndex === -1) {
        receipts.push(updatedReceipt);
      } else {
        receipts[existingIndex] = updatedReceipt;
      }

      window.localStorage.setItem(PROFORMA_RECEIPTS_STORAGE_KEY, JSON.stringify(receipts));
      setSaved(true);
    } catch (saveError) {
      console.error("Could not save proforma receipt details.", saveError);
      setError(
        saveError instanceof Error ? saveError.message : "Could not save proforma receipt details.",
      );
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}
    >
      {/* Receipt details */}
      <Paper elevation={3} sx={sectionSx}>
        <SectionHeader icon={<PaymentsOutlinedIcon color="primary" />} title="Receipt Details" />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(7, minmax(0, 1fr))",
            },
            gap: 1,
          }}
        >
          <TextField
            select
            required
            size="small"
            label="Client"
            value={form.client}
            onChange={(event) => updateField("client", event.target.value)}
            sx={fieldSx}
          >
            {form.client && !PROFORMA_CLIENTS.some((client) => client.name === form.client) && (
              <MenuItem value={form.client}>{form.client}</MenuItem>
            )}
            {PROFORMA_CLIENTS.map((client) => (
              <MenuItem key={client.name} value={client.name}>
                {client.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            required
            size="small"
            label="Bank"
            value={form.bankId}
            onChange={(event) => updateField("bankId", event.target.value)}
            sx={fieldSx}
          >
            {activeBanks.map((bank) => (
              <MenuItem key={bank.id} value={String(bank.id)}>
                {bank.bank} — {bank.entity} ({bank.currency})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            required
            size="small"
            type="date"
            label="Received date"
            value={form.receivedDate}
            onChange={(event) => updateField("receivedDate", event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={fieldSx}
          />
          <TextField
            required
            size="small"
            type="number"
            label="Amount"
            value={form.amount}
            onChange={(event) => updateField("amount", event.target.value)}
          />
          <TextField
            size="small"
            label="Bank reference No"
            value={form.bankReference}
            onChange={(event) => updateField("bankReference", event.target.value)}
            sx={fieldSx}
          />
          <TextField
            size="small"
            label="Client reference No"
            value={form.clientReference}
            onChange={(event) => updateField("clientReference", event.target.value)}
            sx={fieldSx}
          />
          <TextField
            select
            required
            size="small"
            label="Status"
            value={form.status}
            onChange={(event) =>
              updateField("status", event.target.value as ProformaReceiptStatus)
            }
            sx={fieldSx}
          >
            {            PROFORMA_RECEIPT_STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            multiline
            minRows={2}
            size="small"
            label="Comments"
            value={form.comments}
            onChange={(event) => updateField("comments", event.target.value)}
            sx={{ ...fieldSx, gridColumn: { xs: "1 / -1", sm: "span 1", lg: "span 2" } }}
          />
          <Box
            sx={{
              gridColumn: { xs: "1 / -1", sm: "span 1", lg: "span 4" },
              display: "flex",
              flexDirection: "column",
              gap: 1,
              minWidth: 0,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              {/* <AttachFileIcon fontSize="small" color="primary" /> */}
              {/* <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Attach documents
              </Typography> */}
            </Box>
            <Box>
              <Button
                component="label"
                variant="outlined"
                size="small"
                startIcon={<CloudUploadOutlinedIcon />}
                disabled={readingFiles}
              >
                {readingFiles ? "Reading files..." : "Attach Document"}
                <input
                  hidden
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
              </Button>
              {/* <Typography variant="caption" color="text.secondary">
                PDF, Word, JPG or PNG
              </Typography> */}
            </Box>
            {form.documents.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {form.documents.map((document, index) => (
                  <Chip
                    key={`${document.name}-${index}`}
                    label={document.name}
                    variant="outlined"
                    color="primary"
                    onDelete={() =>
                      updateField(
                        "documents",
                        form.documents.filter((_, documentIndex) => documentIndex !== index),
                      )
                    }
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {error && <Alert severity="error">{error}</Alert>}
      {saved && <Alert severity="success">Receipt details saved.</Alert>}

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button
          variant="outlined"
          color="error"
          onClick={() => navigate("/finance/proforma-invoices")}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={readingFiles}
        >
          Save receipt
        </Button>
      </Box>
    </Box>
  );
}