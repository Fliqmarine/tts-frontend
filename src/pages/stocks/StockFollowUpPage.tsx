import { useState } from "react";
import { Box } from "@mui/material";
import StockFollowupHeader from "./components/StockFollowupHeader";
import StockFollowupFilter from "./components/StockFollowupFilter";
import StockFollowupTable from "./components/StockFollowupTable";
import type { StockFollowupFilters } from "./types/Stocks.types";

function StockFollowUpPage() {
    const [filters, setFilters] = useState<StockFollowupFilters>({
        search: "",
        client: "",
        vessel: "",
        station: "",
        supplier: "",
        po_no: "",
        transit_no: "",
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
