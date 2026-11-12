import { Alert, Box } from "@mui/material";
import { useMemo, useState } from "react";
import InvoiceReportFilter from "./components/InvoiceReportFilter";
import InvoiceReportHeader from "./components/InvoiceReportHeader";
import InvoiceReportTable from "./components/InvoiceReportTable";
import {
  DEFAULT_INVOICE_REPORT_FILTERS,
  getInvoiceReportRows,
  type InvoiceReportFilters,
  type InvoiceReportRow,
} from "./types/invoiceReport.types";

export default function InvoiceReport() {
  const [initialData] = useState(() => {
    try {
      return { rows: getInvoiceReportRows(), error: "" };
    } catch (error) {
      console.error("Could not load invoice report data.", error);
      return {
        rows: [],
        error: error instanceof Error ? error.message : "Could not load invoice report data.",
      };
    }
  });
  const [filters, setFilters] = useState<InvoiceReportFilters>(
    DEFAULT_INVOICE_REPORT_FILTERS,
  );
  const [rowsForOptions, setRowsForOptions] = useState<InvoiceReportRow[]>(
    initialData.rows,
  );
  const filterOptions = useMemo(() => ({
    client: [...new Set(rowsForOptions.map(({ client }) => client).filter(Boolean))].sort(),
    vessel: [...new Set(rowsForOptions.map(({ vessel }) => vessel).filter(Boolean))].sort(),
    status: [...new Set(rowsForOptions.map(({ status }) => status).filter(Boolean))].sort(),
    mode: [...new Set(rowsForOptions.map(({ mode }) => mode).filter(Boolean))].sort(),
  }), [rowsForOptions]);

  return (
    <Box>
      <InvoiceReportHeader />
      {initialData.error && <Alert severity="error" sx={{ mt: 2 }}>{initialData.error}</Alert>}
      <InvoiceReportFilter
        filters={filters}
        onChange={setFilters}
        options={filterOptions}
      />
      <InvoiceReportTable
        filters={filters}
        rows={initialData.rows}
        showDemoRows={!initialData.error && initialData.rows.length === 0}
        onRowsChange={setRowsForOptions}
      />
    </Box>
  );
}