import { Box, Typography } from "@mui/material";

export default function StockHistoryHeader() {
    return (
         <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 0,
                px: 0,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
               
                <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.2 }}>
                    Pre Alert -
                    <Typography variant="h5" component="span" sx={{ fontWeight: 700, color: "primary.main", lineHeight: 1.2 }}>
                      {""} Stage 3
                    </Typography>
                </Typography>
            </Box>

            
        </Box>
    );
}

