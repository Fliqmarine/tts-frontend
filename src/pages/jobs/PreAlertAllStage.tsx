import { Box } from "@mui/material";
import { useState } from "react";
import PreAlertAllStageFilter, { type PreAlertAllStageFilters } from "./components/PreAlertAllStageFilter";
import PreAlertAllStageHeader from "./components/PreAlertAllStageHeader";
import PreAlertAllStageTable from "./components/PreAlertAllStageTable";

const initialFilters: PreAlertAllStageFilters = {
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

export default function PreAlertAllStage() {
  const [filters, setFilters] = useState<PreAlertAllStageFilters>(initialFilters);

  return (
    <Box>
      <PreAlertAllStageHeader />
      <PreAlertAllStageFilter filters={filters} onChange={setFilters} />
      <PreAlertAllStageTable filters={filters} />
    </Box>
  );
}
