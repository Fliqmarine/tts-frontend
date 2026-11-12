import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ProformaInvoice } from "../types/proformaInvoice.types";
import ProformaInvoiceViewDialog from "./ProformaInvoiceViewDialog";
import { FileCell } from "../../stocks/components/StockFollowupTable";



type ProformaInvoiceIndexTableProps = {
  invoices: ProformaInvoice[];
  hasActiveFilters: boolean;
  onDelete: (invoice: ProformaInvoice) => void;
};

const DEMO_INVOICE_ID = "demo-proforma-001";
const DEMO_DOCUMENTS = [
  { name: "proforma-invoice.pdf", url: "/files/proforma-invoice.pdf" },
];
const DEMO_INVOICE: ProformaInvoice = {
  id: DEMO_INVOICE_ID,
  client: "Northstar Freight",
  clientAddress: "18 Harbour Road\nLondon, United Kingdom\nE14 9QH",
  clientPoNumber: "PO-REF-1042",
  vesselName: "MV Atlantic Star",
  manifestNumber: "MAN-REF-2026-015",
  invoiceDate: "2026-10-15",
  paymentTerms: "30",
  currency: "AED",
  notes: "Sample proforma invoice for reference only.",
  lines: [
    {
      id: "demo-proforma-line-001",
      description: "Marine spare parts",
      additionalDescription: "Engine maintenance components",
      currency: "AED",
      unitPrice: "1250",
      quantity: "2",
      vat: "5",
    },
  ],
  createdAt: "2026-10-15T00:00:00.000Z",
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

const getGrossByCurrency = (invoice: ProformaInvoice) =>
  invoice.lines.reduce<Record<string, number>>((totals, line) => {
    const unitPrice = Number(line.unitPrice) || 0;
    const quantity = Number(line.quantity) || 0;
    const vat = Number(line.vat) || 0;
    totals[line.currency] =
      (totals[line.currency] ?? 0) + unitPrice * quantity * (1 + vat / 100);
    return totals;
  }, {});

export default function ProformaInvoiceIndexTable({
  invoices,
  hasActiveFilters,
  onDelete,
}: ProformaInvoiceIndexTableProps) {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedInvoice, setSelectedInvoice] = useState<ProformaInvoice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProformaInvoice | null>(null);
  const [isDemoInvoiceVisible, setIsDemoInvoiceVisible] = useState(true);

  const displayInvoices =
    invoices.length === 0 && !hasActiveFilters && isDemoInvoiceVisible
      ? [DEMO_INVOICE]
      : invoices;
  const currentPage = Math.min(
    page,
    Math.max(0, Math.ceil(displayInvoices.length / rowsPerPage) - 1),
  );
  const pageInvoices = displayInvoices.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage,
  );

  return (
    <>
      <Paper variant="outlined" sx={{ overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "calc(100vh - 330px)" }}>
          <Table stickyHeader size="small" sx={{ minWidth: 1100 }}>
            <TableHead>
              <TableRow>
                {[
                  "Client",
                  "Invoice No",
                  "Invoice Date",
                  "Client PO No",
                  "Vessel",
                  "Manifest No",
                  "Payment Terms",
                  "Currency",
                  "Total Amount",
                  "Status",
                  "Docs",
                  "Actions",
                ].map((label) => (
                  <TableCell
                    key={label}
                    sx={{ fontWeight: 700, whiteSpace: "nowrap", bgcolor: "background.paper" }}
                  >
                    {label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {pageInvoices.map((invoice) => {
                const isDemoInvoice = invoice.id === DEMO_INVOICE_ID;
                const grossByCurrency = getGrossByCurrency(invoice);
                const grossLabel = Object.entries(grossByCurrency)
                  .map(([currency, amount]) => formatAmount(amount, currency))
                  .join(" + ");

                return (
                  <TableRow key={invoice.id} hover>
                    <TableCell sx={{ whiteSpace: "nowrap", fontWeight: 600 }}>
                      {invoice.client || "—"}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      PF-{isDemoInvoice ? "DEMO-001" : invoice.id.slice(0, 8).toUpperCase()}
                      {isDemoInvoice && (
                        <Chip size="small" label="Demo" color="info" sx={{ ml: 1 }} />
                      )}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {formatDate(invoice.invoiceDate)}
                    </TableCell>
                    <TableCell>{invoice.clientPoNumber || "—"}</TableCell>
                    <TableCell>{invoice.vesselName || "—"}</TableCell>
                    <TableCell>{invoice.manifestNumber || "—"}</TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {invoice.paymentTerms === "COD" ? "COD" : `${invoice.paymentTerms} days`}
                    </TableCell>
                    <TableCell>{invoice.currency || "—"}</TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {grossLabel || formatAmount(0, invoice.currency)}
                    </TableCell>
                    <TableCell>
                      <Chip size="small" label="Pending" color="warning" />
                    </TableCell>
                    <TableCell align="center">
                      <FileCell files={isDemoInvoice ? DEMO_DOCUMENTS : []} type="doc" />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() =>
                            navigate(
                              `/finance/proforma-invoices/receipt-update/${encodeURIComponent(invoice.id)}`,
                              { state: { invoice } },
                            )
                          }>
                            Update Receipt
                        </Button>
                        <Tooltip title="View proforma invoice">
                          <IconButton
                            color="info"
                            size="small"
                            aria-label={`View proforma invoice for ${invoice.client}`}
                            onClick={() => setSelectedInvoice(invoice)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit proforma invoice">
                          <IconButton
                            color="primary"
                            size="small"
                            aria-label={`Edit proforma invoice for ${invoice.client}`}
                            onClick={() =>
                              navigate(
                                `/finance/proforma-invoices/edit/${encodeURIComponent(invoice.id)}`,
                                { state: { invoice } },
                              )
                            }
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete proforma invoice">
                          <IconButton
                            size="small"
                            color="error"
                            aria-label={`Delete proforma invoice for ${invoice.client}`}
                            onClick={() => setDeleteTarget(invoice)}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
              {pageInvoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={12} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">
                      {hasActiveFilters
                        ? "No matching proforma invoices."
                        : "No proforma invoices yet."}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={displayInvoices.length}
          page={currentPage}
          onPageChange={(_, nextPage) => setPage(nextPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(Number(event.target.value));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </Paper>

      <ProformaInvoiceViewDialog
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        aria-labelledby="delete-proforma-invoice-title"
        aria-describedby="delete-proforma-invoice-description"
        fullWidth
        maxWidth="xs"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              p: 1,
              mb:50,
              boxShadow: (theme) => theme.shadows[10],
            },
          },
        }}
      >
        <DialogTitle
          id="delete-proforma-invoice-title"
          component="div"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            pt: 3,
            pb: 1,
          }}
        >
          <Box
            sx={(theme) => ({
              width: 64,
              height: 64,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              bgcolor: alpha(theme.palette.error.main, 0.12),
              color: "error.main",
              boxShadow: `0 0 0 8px ${alpha(theme.palette.error.main, 0.06)}`,
            })}
          >
            <DeleteOutlineIcon sx={{ fontSize: 32 }} />
          </Box>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
            Delete proforma invoice?
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", pb: 1 }}>
          <Typography
            id="delete-proforma-invoice-description"
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            Are you sure you want to delete{" "}
            <Box component="span" sx={{ fontWeight: 600, color: "error.main" }}>
              {deleteTarget?.client || "this proforma invoice"}
              {deleteTarget?.id && ` (PF-${deleteTarget.id.slice(0, 8).toUpperCase()})`}
            </Box>
            ? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pt: 2, pb: 3, gap: 1.5 }}>
          <Button
            onClick={() => setDeleteTarget(null)}
            variant="outlined"
            color="inherit"
            fullWidth
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              borderColor: "divider",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!deleteTarget) return;
              if (deleteTarget.id === DEMO_INVOICE_ID) {
                setIsDemoInvoiceVisible(false);
              } else {
                onDelete(deleteTarget);
              }
              setDeleteTarget(null);
            }}
            color="error"
            variant="contained"
            fullWidth
            autoFocus
            disableElevation
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}