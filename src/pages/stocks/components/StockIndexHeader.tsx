import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function StockIndexHeader() {
    const navigate = useNavigate();
    return (
         <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1,
                px: 1,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
               
                <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "text.primary" }}
                >
                    Stock List
                </Typography>
            </Box>
            <Box>
                <Button variant="contained" onClick={() => navigate("/stocks/create-stock")}>
                    Create Stock
                </Button>
            </Box>

        </Box>
    );
}   

