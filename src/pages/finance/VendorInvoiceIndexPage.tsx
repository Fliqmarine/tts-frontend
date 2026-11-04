import { Box } from "@mui/material";
import { useMemo, useState } from "react";
import VendorInvoiceFilter from "./components/VendorInvoiceFilter";
import VendorInvoiceHeader from "./components/VendorInvoiceHeader";
import VendorInvoiceTable from "./components/VendorInvoiceTable";
import { getVendorInvoiceRows, type VendorInvoiceFilters } from "./types/vendorInvoice.types";
import { DEMO_BANKS } from "../master/banks/bankData";
import { DEMO_VENDORS } from "../master/vendors/vendorData";

const initialFilters: VendorInvoiceFilters = {
  vendor: "",
  vessel: "",
  modeOfArrival: "",
  fromDate: "",
  toDate: "",
  status: "",
  bank: "",
};

export default function VendorInvoiceIndexPage() {
  const [filters, setFilters] = useState<VendorInvoiceFilters>(initialFilters);
  const rows = useMemo(() => getVendorInvoiceRows(), []);
  const options = useMemo(() => ({
    vendor: [...new Set([
      ...DEMO_VENDORS.map(({ vendorName }) => vendorName),
      ...rows.map(({ vendorName }) => vendorName).filter(Boolean),
    ])].sort(),
    vessel: [...new Set(rows.map(({ vessel }) => vessel).filter(Boolean))].sort(),
    modeOfArrival: [...new Set(rows.map(({ modeOfArrival }) => modeOfArrival).filter(Boolean))].sort(),
    status: [...new Set(["Pending", "Partially Paid", "Approved", "Rejected", ...rows.map(({ status }) => status)])].sort(),
    bank: [...new Set(DEMO_BANKS.map(({ bank }) => bank))].sort(),
  }), [rows]);

  return (
    <Box>
      <VendorInvoiceHeader />
      <VendorInvoiceFilter filters={filters} onChange={setFilters} options={options} />
      <VendorInvoiceTable filters={filters} rows={rows} />
    </Box>
  );
}