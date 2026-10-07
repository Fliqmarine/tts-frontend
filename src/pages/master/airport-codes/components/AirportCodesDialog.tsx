import { Box, Button, Dialog, Divider, IconButton, MenuItem, TextField, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import FlightOutlinedIcon from "@mui/icons-material/FlightOutlined";
import type { AirportCodes } from "../types/airportCodes.types";
import { useEffect, useState } from "react";
import { getCountries } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";

interface AirportCodesDialogProps {
    open: boolean;
    onClose: () => void;
    airportCode?: AirportCodes | null;
    onSubmit?: (data: AirportCodes) => void;
}

export default function AirportCodesDialog({ open, onClose, airportCode, onSubmit }: AirportCodesDialogProps) {
    const isEdit = !!airportCode?.id;
    const countries = getCountries().map((code) => ({
        code,
        name: (en as Record<string, string>)[code] || code,
    }));
    const emptyForm = {
        city_name: "",
        airport_code: "",
        airport_name: "",
        country: "",
    };
    const [form, setForm] = useState(emptyForm);
    useEffect(() => {
        if (open) {
            setForm(
                airportCode
                    ? { city_name: airportCode.city_name || "", airport_code: airportCode.airport_code || "", airport_name: airportCode.airport_name || "", country: airportCode.country || "" }
                    : emptyForm
            );
        }
    }, [open, airportCode]);

    const handleChange = (field: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        const payload: AirportCodes = {
            id: airportCode?.id ?? 0,
            city_name: form.city_name,
            airport_code: form.airport_code,
            airport_name: form.airport_name,
            country: form.country,
        };
        onSubmit(payload);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
                        <FlightOutlinedIcon />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                            {isEdit ? "Edit Airport Code" : "Add Airport Code"}
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
                            label="City Name"
                            fullWidth
                            value={form.city_name}
                            onChange={(e) => handleChange("city_name", e.target.value)}
                            placeholder="e.g. New York"
                            size="small"
                            required
                        />
                        <TextField
                            label="Airport Code"
                            fullWidth
                            value={form.airport_code}
                            onChange={(e) => handleChange("airport_code", e.target.value)}
                            placeholder="e.g. JFK"
                            size="small"
                            required
                        />
                        <TextField
                            label="Airport Name"
                            fullWidth
                            value={form.airport_name}
                            onChange={(e) => handleChange("airport_name", e.target.value)}
                            placeholder="e.g. John F. Kennedy International Airport"
                            size="small"
                            required
                        />
                        <TextField
                            select
                            label="Country"
                            fullWidth
                            value={form.country}
                            onChange={(e) => handleChange("country", e.target.value)}
                            size="small"
                            required
                        >
                            {form.country && !countries.some(({ code }) => code === form.country) && (
                                <MenuItem value={form.country}>{form.country}</MenuItem>
                            )}
                            {countries.map(({ code, name }) => (
                                <MenuItem key={code} value={code}>
                                    {name}
                                </MenuItem>
                            ))}
                        </TextField>
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
                        // disabled={!form.city_name?.trim() || !form.airport_code?.trim() || !form.airport_name?.trim() || !form.country?.trim()}
                        color="primary"
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 2,
                            px: 3,
                        }}
                    >
                        {isEdit ? "Save Changes" : "Add Airport"}
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}
