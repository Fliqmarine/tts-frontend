import { Box } from "@mui/material";
import { useState } from "react";
import PreAlertStage3Filter, { type PreAlertStage3Filters } from "./components/PreAlertStage3Filter";
import PreAlertStage3Header from "./components/PreAlertStage3Header";
import PreAlertStage3Table from "./components/PreAlertStage3Table";

const initialFilters: PreAlertStage3Filters = {
  search: "",
  client: "",
  vessel: "",
  hub: "",
  status: "",
  vesselPo: "",
  keyAccountManager: "",
  consignee: "",
  destinationPort: "",
  stage: "",
  manifestNo: "",
  awbNumber: "",
  fromDate: "",
  toDate: "",
};

export default function PreAlertStage3() {
  const [filters, setFilters] = useState<PreAlertStage3Filters>(initialFilters);

  return (
    <Box>
      <PreAlertStage3Header />
      <PreAlertStage3Filter filters={filters} onChange={setFilters} />
      <PreAlertStage3Table filters={filters} />
    </Box>
  );
}
