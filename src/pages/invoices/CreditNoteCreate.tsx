import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { PreAlertDetails } from "../jobs/types/preAlert.types";
import type { InvoiceLineRow } from "./types/invoices.types";
import type { SavedMainInvoice } from "./mainInvoiceStorage";

type CreditNoteLine = InvoiceLineRow & {
  sourceSubInvoice: string;
};

type SavedCreditNote = {
  creditNoteNo: string;
  sourceInvoiceId: string;
  sourceInvoiceNo: string;
  preAlertId: string;
  invoiceType: "main" | "extra";
  recipient: string;
  currency: string;
  creditNoteDate: string;
  lines: CreditNoteLine[];
  totalAmount: number;
  savedAt: string;
};

const CREDIT_NOTES_STORAGE_KEY = "tts-demo-credit-notes";

type CreditNoteSource = {
  invoice: SavedMainInvoice;
  preAlert?: PreAlertDetails;
  type: "main" | "extra";
};

const createCreditNoteLines = (invoice: SavedMainInvoice): CreditNoteLine[] =>
  invoice.subInvoices.flatMap((subInvoice) =>
    subInvoice.lines.map((line) => ({
      ...line,
      id: `${subInvoice.id}-${line.id}-${crypto.randomUUID()}`,
      sourceSubInvoice: subInvoice.manifestNo || subInvoice.shipmentRef,
    })),
  );

const getLineTotal = (line: CreditNoteLine) => {
  const quantity = Number(line.qty) || 0;
  const unitPrice = Number(line.unitPrice) || 0;
  const vat = Number(line.vat) || 0;
  const subtotal = quantity * unitPrice;
  return subtotal + (subtotal * vat) / 100;
};

const formatAmount = (value: number, currency: string) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency || "AED",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const cardSx = {
  p: { xs: 1, sm: 1.5 },
  borderRadius: 1,
  display: "flex",
  flexDirection: "column",
  gap: 1,
  minWidth: 0,
} as const;

export default function CreditNoteCreate() {
  const location = useLocation();
  const navigate = useNavigate();
  const source = location.state as CreditNoteSource | null;
  const [lines, setLines] = useState<CreditNoteLine[]>(() =>
    source?.invoice ? createCreditNoteLines(source.invoice) : [],
  );
  const [creditNoteDate, setCreditNoteDate] = useState(
    () => new Date().toISOString().slice(0, 10),
  );
  const [savedCreditNoteNo, setSavedCreditNoteNo] = useState("");
  const [error, setError] = useState("");
  const invoice = source?.invoice;
  const preAlert = source?.preAlert;
  const currency = invoice?.form.invoiceCurrency || "AED";
  const totalAmount = lines.reduce((total, line) => total + getLineTotal(line), 0);

  const updateLine = (id: string, field: keyof CreditNoteLine, value: string) => {
    setLines((current) =>
      current.map((line) => (line.id === id ? { ...line, [field]: value } : line)),
    );
  };

  const saveCreditNote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!invoice || !preAlert || lines.length === 0) return;

    try {
      const savedValue = localStorage.getItem(CREDIT_NOTES_STORAGE_KEY);
      const savedNotes: SavedCreditNote[] = savedValue ? JSON.parse(savedValue) as SavedCreditNote[] : [];
      if (!Array.isArray(savedNotes)) {
        throw new Error("Saved credit notes have an invalid storage format.");
      }

      const sourceCreditNotes = savedNotes.filter(
        (note) => note.sourceInvoiceId === invoice.invoiceId,
      );
      const creditNoteNo = `${invoice.invoiceNo}-CN-${String(sourceCreditNotes.length + 1).padStart(2, "0")}`;
      const savedNote: SavedCreditNote = {
        creditNoteNo,
        sourceInvoiceId: invoice.invoiceId,
        sourceInvoiceNo: invoice.invoiceNo,
        preAlertId: preAlert.id,
        invoiceType: source.type,
        recipient: invoice.form.recipient,
        currency,
        creditNoteDate,
        lines,
        totalAmount,
        savedAt: new Date().toISOString(),
      };

      localStorage.setItem(CREDIT_NOTES_STORAGE_KEY, JSON.stringify([...savedNotes, savedNote]));
      setSavedCreditNoteNo(creditNoteNo);
      setError("");
    } catch (saveError) {
      console.error("Could not save credit note.", saveError);
      setError("Credit note could not be saved. Check browser storage and try again.");
    }
  };

  if (!invoice || !preAlert || !source) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert
          severity="error"
          action={<Button color="inherit" onClick={() => navigate("/finance/sale-invoice")}>Back to invoices</Button>}
        >
          Select an invoice from the Sale Invoice list before creating a credit note.
        </Alert>
      </Box>
    );
  }

  return (
    <Stack sx={{ width: "100%", minWidth: 0 }} spacing={1}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Create Credit Note</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
            {preAlert.manifestNumber ? `Manifest ${preAlert.manifestNumber}` : `Invoice ${invoice.invoiceNo}`}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Chip label={savedCreditNoteNo ? "Saved" : "Draft"} variant="outlined" sx={{ fontWeight: 600 }} />
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
            Back
          </Button>
        </Box>
      </Box>

      {savedCreditNoteNo && (
        <Alert severity="success">Credit note {savedCreditNoteNo} was saved successfully.</Alert>
      )}
      {error && <Alert severity="error">{error}</Alert>}

      <Paper component="form" variant="outlined" onSubmit={saveCreditNote} sx={{ p: 0, border: 0 }}>
        <Box
          component="fieldset"
          disabled={Boolean(savedCreditNoteNo)}
          sx={{ m: 0, p: 0, border: 0, minWidth: 0, display: "flex", flexDirection: "column", gap: 0.5 }}
        >
          <Paper variant="outlined" sx={cardSx}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <ReceiptLongOutlinedIcon fontSize="small" color="primary" />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Credit Note Details</Typography>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" },
                gap: 1,
              }}
            >
              <TextField
                size="small"
                fullWidth
                label="Credit Note No"
                value={savedCreditNoteNo || "Generated on save"}
                disabled
              />
              <TextField
                size="small"
                fullWidth
                required
                type="date"
                label="Credit Note Date"
                value={creditNoteDate}
                onChange={(event) => setCreditNoteDate(event.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                size="small"
                fullWidth
                label="Original Invoice No"
                value={invoice.invoiceNo}
                disabled
              />
              <TextField
                size="small"
                fullWidth
                label="Invoice Currency"
                value={currency}
                disabled
              />
              <TextField
                size="small"
                fullWidth
                multiline
                minRows={2}
                label="Recipient"
                value={invoice.form.recipient || preAlert.client || ""}
                disabled
              />
              <TextField
                size="small"
                fullWidth
                label="Manifest Number"
                value={preAlert.manifestNumber || "—"}
                disabled
              />
            </Box>
          </Paper>

          <Paper variant="outlined" sx={cardSx}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <DescriptionOutlinedIcon fontSize="small" color="primary" />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Credit Note Lines</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Update the copied invoice lines to reflect the amount being credited.
                  </Typography>
                </Box>
              </Box>
              <Button
                type="button"
                size="small"
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setLines((current) => [...current, {
                  id: crypto.randomUUID(),
                  sourceSubInvoice: "",
                  description: "",
                  additionalDescription: "",
                  currency,
                  unitPrice: "",
                  qty: "1",
                  vat: "0",
                }])}
              >
                Add Line
              </Button>
            </Box>
            <TableContainer component={Paper} variant="outlined" sx={{ overflowX: "auto", borderRadius: 1 }}>
              <Table size="small" sx={{ minWidth: 820, tableLayout: "fixed" }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: 250, fontWeight: 600, bgcolor: "action.hover" }}>Description</TableCell>
                    <TableCell sx={{ minWidth: 100, fontWeight: 600, bgcolor: "action.hover" }}>Manifest / Shipment</TableCell>
                    <TableCell align="right" sx={{ width: 110, fontWeight: 600, bgcolor: "action.hover" }}>Quantity</TableCell>
                    <TableCell align="right" sx={{ width: 140, fontWeight: 600, bgcolor: "action.hover" }}>Unit Price</TableCell>
                    <TableCell align="right" sx={{ width: 100, fontWeight: 600, bgcolor: "action.hover" }}>VAT %</TableCell>
                    <TableCell align="right" sx={{ width: 145, fontWeight: 600, bgcolor: "action.hover" }}>Line Total</TableCell>
                    <TableCell align="center" sx={{ width: 56, bgcolor: "action.hover" }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lines.map((line) => (
                    <TableRow key={line.id} hover>
                      <TableCell>
                        <TextField
                          size="small"
                          fullWidth
                          required
                          value={line.description}
                          onChange={(event) => updateLine(line.id, "description", event.target.value)}
                          placeholder="Description"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" noWrap title={line.sourceSubInvoice}>
                          {line.sourceSubInvoice || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          fullWidth
                          type="number"
                          required
                          value={line.qty}
                          slotProps={{ htmlInput: { min: 0, step: "any" } }}
                          onChange={(event) => updateLine(line.id, "qty", event.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          fullWidth
                          type="number"
                          required
                          value={line.unitPrice}
                          slotProps={{ htmlInput: { min: 0, step: "any" } }}
                          onChange={(event) => updateLine(line.id, "unitPrice", event.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          fullWidth
                          type="number"
                          required
                          value={line.vat}
                          slotProps={{ htmlInput: { min: 0, step: "any" } }}
                          onChange={(event) => updateLine(line.id, "vat", event.target.value)}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
                        {formatAmount(getLineTotal(line), currency)}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          type="button"
                          size="small"
                          aria-label={`Remove ${line.description || "credit note line"}`}
                          onClick={() => setLines((current) => current.filter(({ id }) => id !== line.id))}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {lines.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4, color: "text.secondary" }}>
                        No credit note lines. Select Add Line to start.
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell colSpan={5} align="right" sx={{ fontWeight: 700 }}>Total Credit</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                      {formatAmount(totalAmount, currency)}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        <Paper
          elevation={0}
          sx={(theme) => ({
            position: "sticky",
            bottom: 8,
            zIndex: theme.zIndex.appBar - 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
            mt: 1,
            p: 1.5,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: theme.palette.background.paper,
            boxShadow: theme.shadows[6],
          })}
        >
          <Box sx={{ display: { xs: "none", sm: "block" }, pl: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>Total Credit</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatAmount(totalAmount, currency)}</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: { xs: 1, sm: 1.5 }, width: { xs: "100%", sm: "auto" } }}>
            <Button
              type="button"
              variant="outlined"
              color="error"
              sx={{ flex: { xs: 1, sm: "none" } }}
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disableElevation
              sx={{ flex: { xs: 1, sm: "none" }, minWidth: 140 }}
              disabled={!lines.length || Boolean(savedCreditNoteNo)}
            >
              Save Credit Note
            </Button>
          </Box>
        </Paper>
      </Paper>
    </Stack>
  );
}
