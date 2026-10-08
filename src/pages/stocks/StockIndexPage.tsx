import { Box } from "@mui/material";
import { useState } from "react";
import StockIndexFilter, { DEFAULT_STOCK_INDEX_FILTERS, type StockIndexFilters } from "./components/StockIndexFilter";
import StockIndexHeader from "./components/StockIndexHeader";
import StockIndexTable from "./components/StockIndexTable";

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
