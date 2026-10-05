import { Box, Typography } from "@mui/material";

export default function StockFollowupHeader() {
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
                    Stock Followup
                </Typography>
            </Box>

            
        </Box>
    );
}

