import { Box, Button, Typography } from "@mui/material";
import ConnectingAirportsOutlinedIcon from '@mui/icons-material/ConnectingAirportsOutlined';
import { Add } from "@mui/icons-material";

interface AirportCodesIndexHeaderProps {
    onCreate: () => void;
}

export default function AirportCodesIndexHeader({ onCreate }: AirportCodesIndexHeaderProps) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: { xs: "wrap", sm: "nowrap" },
                gap: { xs: 1, sm: 2 },
                py: { xs: 0.5, sm: 1 },
                px: { xs: 0, sm: 1 },
            }}
        >
                <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 }, minWidth: 0 }}>
                <Box
                    sx={(theme) => ({
                        width: { xs: 36, sm: 48 },
                        height: { xs: 36, sm: 48 },
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: theme.palette.primary.contrastText,
                    })}
                >
                    <ConnectingAirportsOutlinedIcon
                        sx={{ fontSize: { xs: 20, sm: 26 } }}
                    />
                </Box>
                <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "text.primary", fontSize: { xs: "1.1rem", sm: "1.5rem" }, whiteSpace: "nowrap" }}
                >
                    Airport Codes
                </Typography>
            </Box>

            <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={onCreate}
                size="small"
                sx={{
                    borderRadius: 2,
                    px: { xs: 1, sm: 2.5 },
                    py: { xs: 0.5, sm: 1 },
                    minWidth: 0,
                    whiteSpace: "nowrap",
                    fontSize: { xs: "0.7rem", sm: "0.875rem" },
                    "& .MuiButton-startIcon": { mr: { xs: 0.5, sm: 1 } },
                }}
            >
                Add Airport Code
            </Button>
        </Box>
    );
}
