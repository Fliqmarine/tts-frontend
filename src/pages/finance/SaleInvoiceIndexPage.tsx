import { Box } from "@mui/material";
import { useMemo, useState } from "react";
import SaleInvoiceFilter from "./components/SaleInvoiceFilter";
import type { SaleInvoiceFilters } from "./types/saleInvoice.types";
import SaleInvoiceIndexHeader from "./components/SaleInvoiceIndexHeader";
import SaleInvoiceIndexTable, { type ArApprovePayload } from "./components/SaleInvoiceIndexTable";
import { getSaleInvoiceRows, type SaleInvoiceRow } from "./types/saleInvoice.types";
import { saveExtraInvoice, saveMainInvoice, type SavedMainInvoice } from "../invoices/mainInvoiceStorage";
import type { InvoiceStatus } from "../invoices/types/invoices.types";

const initialFilters: SaleInvoiceFilters = {
  search: "",
  client: "",
  vessel: "",
  hub: "",
  vendorInvoiceNo: "",
  status: "",
  approvalStatus: "",
  mode: "",
  keyAccountManager: "",
  invoiceNumber: "",
  jobNumber: "",
  fromDate: "",
  toDate: "",
};

export default function SaleInvoiceIndexPage() {
  const [filters, setFilters] = useState<SaleInvoiceFilters>(initialFilters);
  const [rows, setRows] = useState(getSaleInvoiceRows);
  const saveAndUpdateInvoice = (row: SaleInvoiceRow, invoice: SavedMainInvoice) => {
    if (row.source === "saved") {
      const saveInvoice = row.type === "main" ? saveMainInvoice : saveExtraInvoice;
      saveInvoice(row.preAlert.id, invoice);
    }

    setRows((current) => current.map((currentRow) =>
      currentRow.invoice.invoiceId === row.invoice.invoiceId
        ? { ...currentRow, invoice }
        : currentRow,
    ));
  };
  const clientOptions = useMemo(
    () => [...new Set(rows.map(({ preAlert, invoice }) => invoice.form.recipient || preAlert.client || "").filter(Boolean))].sort(),
    [rows],
  );
  const filterOptions = useMemo(() => ({
    client: clientOptions,
    vessel: [...new Set(rows.flatMap(({ preAlert, invoice }) => [
      ...invoice.subInvoices.flatMap(({ vessels }) => vessels),
      preAlert.vessel ?? "",
    ]).filter(Boolean))].sort(),
    hub: [...new Set(rows.map(({ preAlert }) => preAlert.hub ?? "").filter(Boolean))].sort(),
    vendorInvoiceNo: [...new Set(rows.flatMap(({ preAlert, invoice }) => [
      ...(preAlert.vendorInvoices?.map(({ invoiceNo }) => invoiceNo ?? "") ?? []),
      ...invoice.subInvoices.flatMap(({ vendorCosts }) => vendorCosts.map(({ vendorInvoice }) => vendorInvoice)),
    ]).filter(Boolean))].sort(),
    status: [...new Set(rows.map(({ invoice }) => invoice.status))].sort(),
    approvalStatus: ["Pending", "AR Approval Pending", "AP Approval Pending", "Approved"],
    mode: [...new Set(rows.map(({ preAlert }) => preAlert.mode ?? "").filter(Boolean))].sort(),
    keyAccountManager: [...new Set(rows.map(({ preAlert }) => preAlert.keyAccountManager ?? "").filter(Boolean))].sort(),
  }), [clientOptions, rows]);

  const updateApproval = (
    row: SaleInvoiceRow,
    department: "ar" | "ap",
    payload?: ArApprovePayload,
  ) => {
    const updatedInvoice = department === "ar"
      ? {
          ...row.invoice,
          arApproved: payload?.decision === "approve",
          arApprovalDecision: payload?.decision,
          arHoldReasons: payload?.decision === "hold" ? payload.reasons : [],
          arOtherReason: payload?.decision === "hold" ? payload.otherReason : undefined,
        }
      : { ...row.invoice, apApproved: true };

    saveAndUpdateInvoice(row, updatedInvoice);
  };

  const updateStatus = (row: SaleInvoiceRow, status: InvoiceStatus) =>
    saveAndUpdateInvoice(row, { ...row.invoice, status });

  const updateSpecialCommission = (row: SaleInvoiceRow, amount: number) =>
    saveAndUpdateInvoice(row, { ...row.invoice, specialCommission: amount });

  return (
    <Box>
      <SaleInvoiceIndexHeader />
      <SaleInvoiceFilter
        filters={filters}
        onChange={setFilters}
        options={filterOptions}
      />
      <SaleInvoiceIndexTable
        filters={filters}
        rows={rows}
        onApprove={updateApproval}
        onStatusChange={updateStatus}
        onSpecialCommission={updateSpecialCommission}
      />
    </Box>
  );
}