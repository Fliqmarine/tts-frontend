import { Box } from "@mui/material";
import StockIndexFilter from "./components/StockIndexFilter";
import StockIndexHeader from "./components/StockIndexHeader";
// import StockIndexTable from "./components/StockIndexTable";

function StockIndexPage() {
    return (
        <Box>
            <StockIndexHeader />
            <StockIndexFilter />
            {/* <StockIndexTable/> */}
        </Box>    
    );
}

export default StockIndexPage;
