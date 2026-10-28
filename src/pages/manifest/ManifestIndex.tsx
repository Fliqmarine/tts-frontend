import { useState } from "react";
import { Box } from "@mui/material";
import ManifestIndexHeader from "./components/ManifestIndexHeader";
import ManifestIndexFilter from "./components/ManifestIndexFilter";
import ManifestIndexTable from "./components/ManifestIndexTable";
import type { ManifestIndexFilters } from "./types/manifest.types";

const EMPTY_FILTERS: ManifestIndexFilters = {
  search: "",
  manifestNo: "", client: "", vessel: "", keyAccountManager: "", fromDate: "", toDate: "",
  arrival: "", vesselPo: "", hub: "", status: "", consignee: "", portOfDestination: "",
  mode: "", transitNo: "", invoice: "", InternalStatus: "",
};

export default function ManifestIndexPage() {
  const [filters, setFilters] = useState<ManifestIndexFilters>(EMPTY_FILTERS);

  return (
    <Box>
      <ManifestIndexHeader />
      <ManifestIndexFilter filters={filters} onChange={setFilters} />
      <ManifestIndexTable filters={filters} />
    </Box>
  );
}
