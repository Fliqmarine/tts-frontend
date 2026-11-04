import { useMemo, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import type { VendorInvoiceFilters, VendorInvoiceRow } from "../types/vendorInvoice.types";

type Props = {
  filters: VendorInvoiceFilters;
  rows: VendorInvoiceRow[];
};

const columns = [
  "Vendor",
  "Invoice No.",
  "Manifest No.",
  "Vessel",
  "Mode of Arrival",
  "Invoice Date",
  "Overdue Date",
  "Amount",
  "Status",
  "Bank",
];

const formatDate = (value: string) =>
  value ? new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString() : "—";

export default function VendorInvoiceTable({ filters, rows }: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredRows = useMemo(() => rows.filter((row) => {
    if (filters.vendor && row.vendorName !== filters.vendor) return false;
    if (filters.vessel && row.vessel !== filters.vessel) return false;
    if (filters.modeOfArrival && row.modeOfArrival !== filters.modeOfArrival) return false;
    if (filters.status && row.status !== filters.status) return false;
    if (filters.bank && row.bank !== filters.bank) return false;
    if (filters.fromDate && row.invoiceDate.slice(0, 10) < filters.fromDate) return false;
    if (filters.toDate && row.invoiceDate.slice(0, 10) > filters.toDate) return false;
    return true;
  }), [filters, rows]);

  const safePage = Math.min(page, Math.max(0, Math.ceil(filteredRows.length / rowsPerPage) - 1));
  const pageRows = filteredRows.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage);

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "action.hover" }}>
              {columns.map((column) => (
                <TableCell key={column} sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {pageRows.length > 0 ? pageRows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.vendorName}</TableCell>
                <TableCell>{row.invoiceNo}</TableCell>
                <TableCell>{row.manifestNo}</TableCell>
                <TableCell>{row.vessel || "—"}</TableCell>
                <TableCell>{row.modeOfArrival || "—"}</TableCell>
                <TableCell>{formatDate(row.invoiceDate)}</TableCell>
                <TableCell>{formatDate(row.overdueDate)}</TableCell>
                <TableCell>{row.finalAmountAed || row.purchaseAmount} {row.currency}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.bank || "—"}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">
                    {rows.length ? "No vendor invoices match these filters." : "No vendor invoices found."}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredRows.length}
        page={safePage}
        onPageChange={(_, nextPage) => setPage(nextPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(Number(event.target.value));
          setPage(0);
        }}
        rowsPerPageOptions={[10, 25, 50]}
      />
    </Paper>
  );
}