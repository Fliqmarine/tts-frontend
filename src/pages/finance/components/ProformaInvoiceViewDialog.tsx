import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import {
  Box,
//   Button,
  Chip,
  Dialog,
//   DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useMemo, type ReactNode } from "react";
import type { ProformaInvoice } from "../types/proformaInvoice.types";

const DEMO_INVOICE_ID = "demo-proforma-001";

const numberValue = (value: string | number) => {
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

type ViewDialogProps = {
  invoice: ProformaInvoice | null;
  onClose: () => void;
};

function DetailItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}
      >
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500, wordBreak: "break-word" }}>
        {children || "—"}
      </Typography>
    </Box>
  );
}

function SectionHeader({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        borderBottom: "2px solid",
        borderColor: "divider",
        pb: 0.75,
        mb: 1.5,
      }}
    >
      {icon}
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
    </Box>
  );
}

export default function ProformaInvoiceViewDialog({ invoice, onClose }: ViewDialogProps) {
  const totalsByCurrency = useMemo(() => {
    const totals: Record<string, { subtotal: number; vat: number; gross: number }> = {};
    (invoice?.lines ?? []).forEach((line) => {
      const net = numberValue(line.unitPrice) * numberValue(line.quantity);
      const gross = net * (1 + numberValue(line.vat) / 100);
      const current = totals[line.currency] ?? { subtotal: 0, vat: 0, gross: 0 };
      totals[line.currency] = {
        subtotal: current.subtotal + net,
        vat: current.vat + (gross - net),
        gross: current.gross + gross,
      };
    });
    return totals;
  }, [invoice]);

  if (!invoice) return null;

  const invoiceNumber = `PF-${
    invoice.id === DEMO_INVOICE_ID ? "DEMO-001" : invoice.id.slice(0, 8).toUpperCase()
  }`;

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xl" scroll="paper">
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          pb: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
          <Typography variant="h6"  sx={{ fontWeight: 700 }}>
            Proforma Invoice{" "}
                <Box component="span" sx={{ color: "primary.main" }}>
                    {invoiceNumber}
                </Box>
          </Typography>
          <Chip
            size="small"
            color="primary"
            variant="outlined"
            label={invoice.paymentTerms === "COD" ? "COD" : `${invoice.paymentTerms} days`}
          />
        </Box>
        <IconButton aria-label="Close" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: "action.hover", p: { xs: 1.5, sm: 2 } }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {/* Details + address */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1.7fr) minmax(240px, 1fr)" },
              gap: 1.5,
            }}
          >
            <Paper elevation={3} sx={{ p: 2, minWidth: 0 }}>
              <SectionHeader
                icon={<DescriptionOutlinedIcon color="primary" />}
                title="Client & Invoice Details"
              />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(3, minmax(0, 1fr))" },
                  gap: 2,
                }}
              >
                <DetailItem label="Client"><Box component="span" sx={{ color: "primary.main",fontWeight: 700 }}>{invoice.client}</Box></DetailItem>
                <DetailItem label="Vessel"><Box component="span" sx={{ color: "primary.main",fontWeight: 700 }}>{invoice.vesselName}</Box></DetailItem>
                <DetailItem label="Manifest no."><Box component="span" sx={{ color: "primary.main",fontWeight: 700 }}>{invoice.manifestNumber}</Box></DetailItem>
                <DetailItem label="Client PO no.">{invoice.clientPoNumber}</DetailItem>
                <DetailItem label="Invoice date">{formatDate(invoice.invoiceDate)}</DetailItem>
                <DetailItem label="Currency">{invoice.currency}</DetailItem>
                <Box sx={{ gridColumn: "1 / -1" }}>
                  <DetailItem label="Notes">
                    <Box component="span" sx={{ whiteSpace: "pre-line" }}>
                      {invoice.notes}
                    </Box>
                  </DetailItem>
                </Box>
              </Box>
            </Paper>

            <Paper elevation={3} sx={{ p: 2, minWidth: 0 }}>
              <SectionHeader
                icon={<DescriptionOutlinedIcon color="primary" />}
                title="Client Address"
              />
              <Typography variant="body2" sx={{ whiteSpace: "pre-line", fontWeight: 500 }}>
                {invoice.clientAddress || "—"}
              </Typography>
            </Paper>
          </Box>

          {/* Items */}
          <Paper elevation={3} sx={{ p: 2, minWidth: 0 }}>
            <SectionHeader
              icon={<ReceiptLongOutlinedIcon color="primary" />}
              title={`Invoice Items (${invoice.lines.length})`}
            />
            <TableContainer sx={{ maxHeight: 360 }}>
              <Table size="small" stickyHeader sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow>
                    {[
                      { label: "#", align: "left" },
                      { label: "Description", align: "left" },
                      { label: "Additional Description", align: "left" },
                      { label: "Currency", align: "center" },
                      { label: "Unit Price", align: "right" },
                      { label: "Qty", align: "right" },
                      { label: "Total Price", align: "right" },
                      { label: "VAT", align: "right" },
                      { label: "Gross Value", align: "right" },
                    ].map((column) => (
                      <TableCell
                        key={column.label}
                        align={column.align as "left" | "center" | "right"}
                        sx={{ fontWeight: 700, whiteSpace: "nowrap", bgcolor: "background.paper" }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoice.lines.map((line, index) => {
                    const unitPrice = numberValue(line.unitPrice);
                    const quantity = numberValue(line.quantity);
                    const total = unitPrice * quantity;
                    const gross = total * (1 + numberValue(line.vat) / 100);
                    return (
                      <TableRow key={line.id} hover>
                        <TableCell sx={{ color: "text.secondary" }}>{index + 1}</TableCell>
                        <TableCell>{line.description || "—"}</TableCell>
                        <TableCell sx={{ color: "text.secondary" }}>
                          {line.additionalDescription || "—"}
                        </TableCell>
                        <TableCell align="center">{line.currency}</TableCell>
                        <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                          {formatAmount(unitPrice, line.currency)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                          {quantity}
                        </TableCell>
                        <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                          {formatAmount(total, line.currency)}
                        </TableCell>
                        <TableCell align="right">{numberValue(line.vat)}%</TableCell>
                        <TableCell
                          align="right"
                          sx={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}
                        >
                          {formatAmount(gross, line.currency)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Totals */}
          <Paper
            elevation={3}
            sx={{
              p: 2,
              alignSelf: { md: "flex-end" },
              width: { xs: "100%", md: "auto" },
              minWidth: { md: 380 },
            }}
          >
            <SectionHeader
              icon={<CalculateOutlinedIcon color="primary" />}
              title="Invoice Totals"
            />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "flex-end" }}>
              {Object.entries(totalsByCurrency).map(([currency, totals]) => (
                <Box
                  key={currency}
                  sx={{
                    flex: { xs: "1 1 100%", sm: "1 1 240px" },
                    minWidth: 240,
                    p: 1.5,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    bgcolor: "action.hover",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Subtotal ({currency})
                    </Typography>
                    <Typography variant="body2" sx={{ fontVariantNumeric: "tabular-nums" }}>
                      {formatAmount(totals.subtotal, currency)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 3, mt: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      VAT
                    </Typography>
                    <Typography variant="body2" sx={{ fontVariantNumeric: "tabular-nums" }}>
                      {formatAmount(totals.vat, currency)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Total ({currency})
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      sx={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}
                    >
                      {formatAmount(totals.gross, currency)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </DialogContent>

      {/* <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogActions> */}
    </Dialog>
  );
}