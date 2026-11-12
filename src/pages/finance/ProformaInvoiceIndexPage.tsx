import { Alert, Box, Snackbar } from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import ProformaInvoiceIndexHeader from "./components/ProformaInvoiceIndexHeader";
import ProformaInvoiceIndexFilter from "./components/ProformaInvoiceIndexFilter";
import ProformaInvoiceIndexTable from "./components/ProformaInvoiceIndexTable";
import {
  PROFORMA_INVOICE_STORAGE_KEY,
  ProformaInvoiceSchema,
  type ProformaInvoice,
} from "./types/proformaInvoice.types";

type LoadResult = {
  invoices: ProformaInvoice[];
  error: string;
};

const loadInvoices = (): LoadResult => {
  try {
    const stored: unknown = JSON.parse(
      window.localStorage.getItem(PROFORMA_INVOICE_STORAGE_KEY) ?? "[]",
    );
    if (!Array.isArray(stored)) {
      throw new Error("Saved proforma invoices have an invalid format.");
    }

    return {
      invoices: stored.map((invoice) => ProformaInvoiceSchema.parse(invoice)),
      error: "",
    };
  } catch (error) {
    console.error("Could not load proforma invoices.", error);
    return {
      invoices: [],
      error: error instanceof Error ? error.message : "Could not load proforma invoices.",
    };
  }
};

export default function ProformaInvoiceIndexPage() {
  const location = useLocation();
  const [loadResult, setLoadResult] = useState(loadInvoices);
  const [showCreatedMessage, setShowCreatedMessage] = useState(
    Boolean((location.state as { createdProformaInvoice?: boolean } | null)?.createdProformaInvoice),
  );

  const handleDeleteInvoice = (invoice: ProformaInvoice) => {
    const updatedInvoices = loadResult.invoices.filter((item) => item.id !== invoice.id);
    try {
      window.localStorage.setItem(
        PROFORMA_INVOICE_STORAGE_KEY,
        JSON.stringify(updatedInvoices),
      );
      setLoadResult({ invoices: updatedInvoices, error: "" });
    } catch (error) {
      console.error("Could not delete proforma invoice.", error);
      setLoadResult({
        ...loadResult,
        error: error instanceof Error ? error.message : "Could not delete proforma invoice.",
      });
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, minWidth: 0 }}>
      <ProformaInvoiceIndexHeader />
      {loadResult.error && <Alert severity="error">{loadResult.error}</Alert>}
      <ProformaInvoiceIndexFilter invoices={loadResult.invoices}>
        {(filteredInvoices, hasActiveFilters) => (
          <ProformaInvoiceIndexTable
            invoices={filteredInvoices}
            hasActiveFilters={hasActiveFilters}
            onDelete={handleDeleteInvoice}
          />
        )}
      </ProformaInvoiceIndexFilter>
      <Snackbar
        open={showCreatedMessage}
        autoHideDuration={4000}
        onClose={() => setShowCreatedMessage(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" onClose={() => setShowCreatedMessage(false)}>
          Proforma invoice created.
        </Alert>
      </Snackbar>
    </Box>
  );
}
