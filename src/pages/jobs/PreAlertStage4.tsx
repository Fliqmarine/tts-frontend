import { Box } from "@mui/material";
import { useState } from "react";
import PreAlertStage4Filter, { type PreAlertStage4Filters } from "./components/PreAlertStage4Filter";
import PreAlertStage4Header from "./components/PreAlertStage4Header";
import PreAlertStage4Table from "./components/PreAlertStage4Table";

const initialFilters: PreAlertStage4Filters = {
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

export default function PreAlertStage4() {
  const [filters, setFilters] = useState<PreAlertStage4Filters>(initialFilters);

  return (
    <Box>
      <PreAlertStage4Header />
      <PreAlertStage4Filter filters={filters} onChange={setFilters} />
      <PreAlertStage4Table filters={filters} />
    </Box>
  );
}
