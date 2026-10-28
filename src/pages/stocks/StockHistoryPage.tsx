import { Box } from "@mui/material";
import StockHistoryPageHeader from "./components/StockHistoryHeader";
import StockHistoryPageTable from "./components/StockHistoryTable";
import StockHistoryPageFilter from "./components/StockHistoryFilter";
import {useState} from "react";
import type { StockHistoryFilters } from "./types/Stocks.types";


function StockHistoryPage() {
    const [filters, setFilters] = useState<StockHistoryFilters>({
        search: "",
        client: "",
        vessel: "",
        station: "",
        supplier: "",
        po_no: "",
        transit_no: "",
        status: "",
        fromDate: "",
        toDate: "", 
    });
    return (
       <Box>
            <StockHistoryPageHeader />
            <StockHistoryPageFilter filters={filters} onChange={setFilters} />
            <StockHistoryPageTable filters={filters} />

       </Box>
    );
}

export default StockHistoryPage;
