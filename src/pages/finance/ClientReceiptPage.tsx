import { Alert, Box } from "@mui/material";
import { useMemo, useState } from "react";
import ClientReceiptFilter from "./components/ClientReceiptFilter";
import ClientReceiptHeader from "./components/ClientReceiptHeader";
import ClientReceiptTable from "./components/ClientReceiptTable";
import {
  addClientReceiptPayment,
  getClientReceiptRows,
  type ClientReceiptFilters,
  type ClientReceiptRow,
  type ClientReceiptStatus,
  type ReceiptUpdate,
} from "./types/clientReceipt.types";

const initialFilters: ClientReceiptFilters = {
  search: "",
  client: "",
  status: "",
  receiptNumber: "",
  invoiceNumber: "",
  fromDate: "",
  toDate: "",
};

export default function ClientReceiptPage() {
  const [initialData] = useState(() => {
    try {
      return { rows: getClientReceiptRows(), error: "" };
    } catch (error) {
      console.error("Could not load client receipt data.", error);
      return {
        rows: [],
        error: error instanceof Error ? error.message : "Could not load client receipt data.",
      };
    }
  });
  const [filters, setFilters] = useState<ClientReceiptFilters>(initialFilters);
  const [rows, setRows] = useState<ClientReceiptRow[]>(initialData.rows);
  const [error, setError] = useState(initialData.error);

  const filterOptions = useMemo(() => ({
    client: [...new Set(rows.map(({ client }) => client).filter(Boolean))].sort(),
    status: [...new Set(rows.map(({ status }) => status).filter(Boolean))].sort(),
  }), [rows]);

  const updateReceipt = async (row: ClientReceiptRow, update: ReceiptUpdate) => {
    try {
      const updatedRow = await addClientReceiptPayment(row, update);
      setRows((current) => current.map((receipt) =>
        receipt.invoiceId === updatedRow.invoiceId ? updatedRow : receipt,
      ));
      setError("");
    } catch (updateError) {
      console.error("Could not update client receipt.", updateError);
      setError(updateError instanceof Error ? updateError.message : "Could not update client receipt.");
      throw updateError;
    }
  };

  const setReceiptStatus = (row: ClientReceiptRow, status: ClientReceiptStatus) => {
    setRows((current) => current.map((receipt) =>
      receipt.invoiceId === row.invoiceId ? { ...receipt, status } : receipt,
    ));
    setError("");
  };

  return (
    <Box>
      <ClientReceiptHeader />
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <ClientReceiptFilter
        filters={filters}
        onChange={setFilters}
        options={filterOptions}
      />
      <ClientReceiptTable
        filters={filters}
        rows={rows}
        onUpdateReceipt={updateReceipt}
        onReopenReceipt={(row) => setReceiptStatus(row, "Reopen Request")}
        onApproveReceipt={(row) => setReceiptStatus(row, "Reopened")}
      />
    </Box>
  );
}
