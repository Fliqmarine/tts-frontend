import { useState } from "react";
import { Box } from "@mui/material";
import StockFollowupHeader from "./components/StockFollowupHeader";
import StockFollowupFilter, { type Filters } from "./components/StockFollowupFilter";
import StockFollowupTable from "./components/StockFollowupTable";

function StockFollowUpPage() {
    const [filters, setFilters] = useState<Filters>({
        search: "",
        client: "",
        vessel: "",
        station: "",
        supplier: "",
        po_number: "",
        transit_number: "",
        status: "",
        key_account_manager: "",
    });

    return (
        <Box>
            <StockFollowupHeader />
            <StockFollowupFilter filters={filters} onChange={setFilters} />
            <StockFollowupTable filters={filters} />
        </Box>
    );
}

export default StockFollowUpPage;
