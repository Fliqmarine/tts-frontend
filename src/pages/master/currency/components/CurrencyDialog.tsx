import { Box, Button, Dialog, IconButton, Stack, TextField, Typography, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { Currency } from "../types/currency.types";
import { useEffect, useState } from "react";

interface CurrencyDialogProps {
    open: boolean;
    onClose: () => void;
    currency?: Currency | null;
    onSubmit?: (data: Currency) => void;
}

const COUNTRIES = [
    "United States",
    "India",
    "Eurozone",
    "United Kingdom",
    "United Arab Emirates",
    "Japan",
    "Singapore",
    "Australia",
    "Canada",
];

export default function CurrencyDialog({ open, onClose, currency, onSubmit }: CurrencyDialogProps) {
    const isEdit = !!currency?.id;
    const emptyForm = {
        code: "",
        country: "",
        currency: "",
        symbol: "",
        active: true,
        conversion_rate: 1.00,
    };
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        if (open) {
            setForm(
                currency
                    ? {
                        code: currency.code,
                        country: currency.country,
                        currency: currency.currency,
                        symbol: currency.symbol,
                        active: currency.active,
                        conversion_rate: currency.conversion_rate,
                    }
                    : emptyForm
            );
        }
    }, [open, currency]);

    const handleChange = (field: keyof typeof form, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (!onSubmit) return;
        const payload: Currency = {
            id: currency?.id ?? 0,
            code: form.code,
            country: form.country,
            currency: form.currency,
            symbol: form.symbol,
            active: form.active,
            conversion_rate: Number(form.conversion_rate),
        };
        onSubmit(payload);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <Box
                sx={{

                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box
                    sx={{
                        px: 3,
                        py: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {isEdit ? "Edit Currency" : "Add Currency"}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <IconButton onClick={onClose} color="inherit">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>
                <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 3 }}>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            gap: 3,
                        }}
                    >
                        <TextField
                            label="Currency Code"
                            fullWidth
                            value={form.code}
                            onChange={(e) => handleChange("code", e.target.value)}
                            placeholder="e.g. USD"
                            size="small"
                            required
                        />

                        <FormControl fullWidth size="small" required>
                            <InputLabel>Country</InputLabel>
                            <Select
                                value={form.country}
                                label="Country"
                                onChange={(e) => handleChange("country", e.target.value)}
                            >
                                {COUNTRIES.map((ctry) => (
                                    <MenuItem key={ctry} value={ctry}>
                                        {ctry}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Currency Name"
                            fullWidth
                            value={form.currency}
                            onChange={(e) => handleChange("currency", e.target.value)}
                            placeholder="e.g. US Dollar"
                            size="small"
                            required
                        />
                        <TextField
                            label="Symbol"
                            fullWidth
                            value={form.symbol}
                            onChange={(e) => handleChange("symbol", e.target.value)}
                            placeholder="e.g. $"
                            size="small"
                            required
                        />
                        <TextField
                            label="Conversion Rate"
                            fullWidth
                            type="number"
                            value={form.conversion_rate}
                            onChange={(e) => handleChange("conversion_rate", e.target.value)}
                            placeholder="e.g. 1.00"
                            size="small"
                            required
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={form.active}
                                    onChange={(e) => handleChange("active", e.target.checked)}
                                    color="success"
                                />
                            }
                            label="Active"
                        />
                    </Box>
                </Box>
                <Box
                    sx={{
                        px: 3,
                        py: 2,
                        borderTop: 1,
                        borderColor: "divider",
                        display: "flex",
                        gap: 2,
                        justifyContent: "flex-end",
                    }}
                >
                    <Button variant="outlined" onClick={onClose} sx={{ textTransform: "none" }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!form.code.trim() || !form.country || !form.currency.trim() || !form.symbol.trim()}
                        color="primary"
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                        }}
                    >
                        {isEdit ? "Save Changes" : "Add Currency"}
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}
