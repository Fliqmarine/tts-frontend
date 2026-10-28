import { Box } from "@mui/material";
import { useState } from "react";
import StockIndexFilter, { DEFAULT_STOCK_INDEX_FILTERS } from "./components/StockIndexFilter";
import StockIndexHeader from "./components/StockIndexHeader";
import StockIndexTable from "./components/StockIndexTable";
import type { StockIndexFilters } from "./types/Stocks.types";

function StockIndexPage() {
    const [filters, setFilters] = useState<StockIndexFilters>(DEFAULT_STOCK_INDEX_FILTERS);

    return (
        <Box>
            <StockIndexHeader />
            <StockIndexFilter filters={filters} onChange={setFilters} />
            <StockIndexTable filters={filters} />
        </Box>    
    );
}

export default StockIndexPage;
