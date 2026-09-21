import { Box, Button, Dialog, IconButton, Stack, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { AirportCodes } from "../types/airportCodes.types";
import { useEffect, useState } from "react";

interface AirportCodesDialogProps {
    open: boolean;
    onClose: () => void;
    airportCode?: AirportCodes | null;
    onSubmit?: (data: AirportCodes) => void;
}

export default function AirportCodesDialog({ open, onClose, airportCode, onSubmit }: AirportCodesDialogProps) {
    const isEdit = !!airportCode?.id;
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
                    ? { city_name: airportCode.city_name, airport_code: airportCode.airport_code, airport_name: airportCode.airport_name, country: airportCode.country }
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
                        {isEdit ? "Edit Airport Code" : "Add Airport Code"}
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
                            label="Country"
                            fullWidth
                            value={form.country}
                            onChange={(e) => handleChange("country", e.target.value)}
                            placeholder="e.g. USA"
                            size="small"
                            required
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
                        disabled={!form.city_name.trim() || !form.airport_code.trim() || !form.airport_name.trim() || !form.country.trim()}
                        color="primary"
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                        }}
                    >
                        {isEdit ? "Save Changes" : "Create"}
                    </Button>
                </Box>
            </Box>

        </Dialog>
    );
}