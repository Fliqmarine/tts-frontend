import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { PreAlertDetails } from "../jobs/types/preAlert.types";
import type { InvoiceLineRow } from "./types/invoices.types";
import type { SavedMainInvoice } from "./mainInvoiceStorage";

type CreditNoteSource = {
  invoice: SavedMainInvoice;
  preAlert?: PreAlertDetails;
  type: "main" | "extra";
};

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

const getCreditNotesForInvoice = (invoiceId: string): SavedCreditNote[] => {
  const stored = localStorage.getItem(CREDIT_NOTES_STORAGE_KEY);
  if (!stored) return [];

  const parsed: unknown = JSON.parse(stored);
  if (!Array.isArray(parsed)) {
    throw new Error("Saved credit notes have an invalid storage format.");
  }
  return (parsed as SavedCreditNote[]).filter((note) => note.sourceInvoiceId === invoiceId);
};

const formatAmount = (value: number, currency: string) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency || "AED",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatDate = (value: string) =>
  value ? new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString() : "—";

const cardSx = {
  p: { xs: 1, sm: 1.5 },
  borderRadius: 1,
  display: "flex",
  flexDirection: "column",
  gap: 1,
  minWidth: 0,
} as const;

export default function CreditNoteView() {
  const location = useLocation();
  const navigate = useNavigate();
  const source = location.state as CreditNoteSource | null;
  const invoice = source?.invoice;
  const preAlert = source?.preAlert;
  const [{ creditNotes, error }] = useState(() => {
    if (!invoice) return { creditNotes: [], error: "" };
    try {
      return { creditNotes: getCreditNotesForInvoice(invoice.invoiceId), error: "" };
    } catch (readError) {
      console.error("Could not read saved credit notes.", readError);
      return { creditNotes: [], error: "Credit notes could not be loaded from browser storage." };
    }
  });

  if (!invoice || !preAlert || !source) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert
          severity="error"
          action={<Button color="inherit" onClick={() => navigate("/finance/sale-invoice")}>Back to invoices</Button>}
        >
          Select an invoice from the Sale Invoice list to view its credit notes.
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
          <Typography variant="h5" sx={{ fontWeight: 700 }}>View Credit Notes</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
            {preAlert.manifestNumber ? `Manifest ${preAlert.manifestNumber}` : `Invoice ${invoice.invoiceNo}`}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Chip label={`${creditNotes.length} ${creditNotes.length === 1 ? "Credit Note" : "Credit Notes"}`} variant="outlined" sx={{ fontWeight: 600 }} />
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
            Back
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper variant="outlined" sx={cardSx}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <ReceiptLongOutlinedIcon fontSize="small" color="primary" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Original Invoice Details</Typography>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" },
            gap: 1,
          }}
        >
          <InfoField label="Invoice No" value={invoice.invoiceNo} />
          <InfoField label="Invoice Type" value={source.type === "extra" ? "Extra Invoice" : "Main Invoice"} />
          <InfoField label="Recipient" value={invoice.form.recipient || preAlert.client || "—"} />
          <InfoField label="Currency" value={invoice.form.invoiceCurrency || "AED"} />
          <InfoField label="Manifest Number" value={preAlert.manifestNumber || "—"} />
        </Box>
      </Paper>

      {creditNotes.length === 0 && !error && (
        <Alert severity="info">
          No credit notes have been saved for invoice {invoice.invoiceNo}.
        </Alert>
      )}

      {creditNotes.map((creditNote) => (
        <Paper key={creditNote.creditNoteNo} variant="outlined" sx={cardSx}>
          <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <DescriptionOutlinedIcon fontSize="small" color="primary" />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{creditNote.creditNoteNo}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Created {formatDate(creditNote.savedAt)}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                Credit Note Date: {formatDate(creditNote.creditNoteDate)}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {formatAmount(creditNote.totalAmount, creditNote.currency)}
              </Typography>
            </Box>
          </Box>

          <TableContainer component={Paper} variant="outlined" sx={{ overflowX: "auto", borderRadius: 1 }}>
            <Table size="small" sx={{ minWidth: 700, tableLayout: "fixed" }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, bgcolor: "action.hover" }}>Description</TableCell>
                  <TableCell sx={{ width: 140, fontWeight: 600, bgcolor: "action.hover" }}>Manifest / Shipment</TableCell>
                  <TableCell align="right" sx={{ width: 100, fontWeight: 600, bgcolor: "action.hover" }}>Quantity</TableCell>
                  <TableCell align="right" sx={{ width: 140, fontWeight: 600, bgcolor: "action.hover" }}>Unit Price</TableCell>
                  <TableCell align="right" sx={{ width: 90, fontWeight: 600, bgcolor: "action.hover" }}>VAT %</TableCell>
                  <TableCell align="right" sx={{ width: 150, fontWeight: 600, bgcolor: "action.hover" }}>Line Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {creditNote.lines.map((line) => {
                  const quantity = Number(line.qty) || 0;
                  const subtotal = quantity * (Number(line.unitPrice) || 0);
                  const lineTotal = subtotal + (subtotal * (Number(line.vat) || 0)) / 100;
                  return (
                    <TableRow key={line.id}>
                      <TableCell>{line.description || "—"}</TableCell>
                      <TableCell>{line.sourceSubInvoice || "—"}</TableCell>
                      <TableCell align="right">{line.qty}</TableCell>
                      <TableCell align="right">{formatAmount(Number(line.unitPrice) || 0, creditNote.currency)}</TableCell>
                      <TableCell align="right">{line.vat}</TableCell>
                      <TableCell align="right">{formatAmount(lineTotal, creditNote.currency)}</TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell colSpan={5} align="right" sx={{ fontWeight: 700 }}>Total Credit</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    {formatAmount(creditNote.totalAmount, creditNote.currency)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ))}
    </Stack>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>{value}</Typography>
    </Box>
  );
}
