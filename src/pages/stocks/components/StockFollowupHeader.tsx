import { Box, Typography } from "@mui/material";

export default function StockFollowupHeader() {
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
               
                <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.2 }}
                >
                    Stock Followup
                </Typography>
            </Box>

            
        </Box>
    );
}

