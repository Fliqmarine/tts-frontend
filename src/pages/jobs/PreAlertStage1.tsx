import { Box } from "@mui/material";
import { useState } from "react";
import PreAlertStage1Filter, { type PreAlertStage1Filters } from "./components/PreAlertStage1Filter";
import PreAlertStage1Header from "./components/PreAlertStage1Header";
import PreAlertStage1Table from "./components/PreAlertStage1Table";

const initialFilters: PreAlertStage1Filters = {
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

export default function PreAlertStage1() {
  const [filters, setFilters] = useState<PreAlertStage1Filters>(initialFilters);

  return (
    <Box>
      <PreAlertStage1Header />
      <PreAlertStage1Filter filters={filters} onChange={setFilters} />
      <PreAlertStage1Table filters={filters} />
    </Box>
  );
}
