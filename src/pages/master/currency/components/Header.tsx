import { Box, Button, Typography } from "@mui/material";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import { Add } from "@mui/icons-material";

interface CurrencyIndexHeaderProps {
    onCreate: () => void;
}

export default function CurrencyIndexHeader({ onCreate }: CurrencyIndexHeaderProps) {
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
                <Box
                    sx={(theme) => ({
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: theme.palette.primary.contrastText,
                    })}
                >
                    <CurrencyExchangeIcon
                        sx={{ fontSize: 26 }}
                    />
                </Box>
                <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "text.primary" }}
                >
                    Currencies
                </Typography>
            </Box>

            <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={onCreate}
                sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                }}
            >
                Add Currency
            </Button>
        </Box>
    );
}
