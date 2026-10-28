import { Box } from "@mui/material";
import { useState } from "react";
import PreAlertStage2Filter, { type PreAlertStage2Filters } from "./components/PreAlertStage2Filter";
import PreAlertStage2Header from "./components/PreAlertStage2Header";
import PreAlertStage2Table from "./components/PreAlertStage2Table";

const initialFilters: PreAlertStage2Filters = {
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

export default function PreAlertStage2() {
  const [filters, setFilters] = useState<PreAlertStage2Filters>(initialFilters);

  return (
    <Box>
      <PreAlertStage2Header />
      <PreAlertStage2Filter filters={filters} onChange={setFilters} />
      <PreAlertStage2Table filters={filters} />
    </Box>
  );
}
