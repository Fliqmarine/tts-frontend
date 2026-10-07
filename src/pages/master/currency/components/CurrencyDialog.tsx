import { Box, Button, Dialog, Divider, IconButton, TextField, Typography, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch } from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";
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
                        code: currency.code || "",
                        country: currency.country || "",
                        currency: currency.currency || "",
                        symbol: currency.symbol || "",
                        active: currency.active ?? true,
                        conversion_rate: currency.conversion_rate ?? 1.00,
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
            <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} noValidate>
                <Box
                    sx={{
                        px: 3,
                        py: 2.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        bgcolor: (t) => alpha(t.palette.primary.main, 0.06),
                        borderBottom: 1,
                        borderColor: "divider",
                    }}
                >
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 1,
                            display: "grid",
                            placeItems: "center",
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            boxShadow: (t) => `0 6px 16px ${alpha(t.palette.primary.main, 0.35)}`,
                        }}
                    >
                        <CurrencyExchangeOutlinedIcon />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                            {isEdit ? "Edit Currency" : "Add Currency"}
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose} size="small" aria-label="close">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                <Box sx={{ px: 3, py: 3 }}>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            columnGap: 2,
                            rowGap: 2.5,
                        }}
                    >
                        <TextField
                            label="Currency Code"
                            fullWidth
                            value={form.code}
                            onChange={(e) => handleChange("code", e.target.value)}
                            placeholder="e.g. USD"
                            required
                        />

                        <FormControl fullWidth required>
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
                            required
                        />
                        <TextField
                            label="Symbol"
                            fullWidth
                            value={form.symbol}
                            onChange={(e) => handleChange("symbol", e.target.value)}
                            placeholder="e.g. $"
                            required
                        />
                        <TextField
                            label="Conversion Rate"
                            fullWidth
                            type="number"
                            value={form.conversion_rate}
                            onChange={(e) => handleChange("conversion_rate", e.target.value)}
                            placeholder="e.g. 1.00"
                            required
                            helperText="* Enter the amount to be converted to USD."
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
                <Divider />

                <Box
                    sx={{
                        px: 3,
                        py: 2,
                        display: "flex",
                        gap: 1.5,
                        justifyContent: "flex-end",
                        bgcolor: (t) => alpha(t.palette.grey[500], 0.04),
                    }}
                >
                    <Button onClick={onClose} color="error" variant="outlined" sx={{ textTransform: "none", borderRadius: 2, px: 2.5 }}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disableElevation
                        // disabled={!form.code?.trim() || !form.country || !form.currency?.trim() || !form.symbol?.trim()}
                        color="primary"
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 2,
                            px: 3,
                        }}
                    >
                        {isEdit ? "Save Changes" : "Add Currency"}
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}
