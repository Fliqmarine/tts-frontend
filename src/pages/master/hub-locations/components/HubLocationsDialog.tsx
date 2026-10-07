import { Box, Button, Dialog, Divider, IconButton, TextField, Typography, FormControlLabel, Switch, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import type { HubLocations } from "../types/hubLocations.types";
import { useEffect, useState } from "react";

interface HubLocationsDialogProps {
    open: boolean;
    onClose: () => void;
    hubLocations?: HubLocations | null;
    onSubmit?: (data: HubLocations) => void;
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
    "Germany",
];

export default function HubLocationsDialog({ open, onClose, hubLocations, onSubmit }: HubLocationsDialogProps) {
    const isEdit = !!hubLocations?.id;
    const emptyForm = {
        contactCode: "",
        name: "",
        stationCode: "",
        email: "",
        telephoneNo: "",
        country: "",
        isActive: true,
    };
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        if (open) {
            setForm(
                hubLocations
                    ? {
                        contactCode: hubLocations.contactCode || "",
                        name: hubLocations.name || "",
                        stationCode: hubLocations.stationCode || "",
                        email: hubLocations.email || "",
                        telephoneNo: hubLocations.telephoneNo || "",
                        country: hubLocations.country || "",
                        isActive: hubLocations.isActive ?? true,
                    }
                    : emptyForm
            );
        }
    }, [open, hubLocations]);

    const handleChange = (field: keyof typeof form, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (!onSubmit) return;
        const payload: HubLocations = {
            id: hubLocations?.id ?? 0,
            contactCode: form.contactCode,
            name: form.name,
            stationCode: form.stationCode,
            email: form.email,
            telephoneNo: form.telephoneNo,
            country: form.country,
            isActive: form.isActive,
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
                    <Box sx={{ width: 44, height: 44, borderRadius: 1, display: "grid", placeItems: "center", bgcolor: "primary.main", color: "primary.contrastText", boxShadow: (t) => `0 6px 16px ${alpha(t.palette.primary.main, 0.35)}` }}>
                        <HubOutlinedIcon />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                        {isEdit ? "Edit Hub" : "Add Hub"}
                    </Typography>
                    </Box>
                    <IconButton onClick={onClose} size="small" aria-label="close"><CloseIcon fontSize="small" /></IconButton>
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
                            label="Contact Code"
                            fullWidth
                            value={form.contactCode}
                            onChange={(e) => handleChange("contactCode", e.target.value)}
                            placeholder="e.g. C001"
                            required
                        />

                        <TextField
                            label="Hub Name"
                            fullWidth
                            value={form.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            placeholder="e.g. Global Hub NY"
                            required
                        />

                        <TextField
                            label="Station Code"
                            fullWidth
                            value={form.stationCode}
                            onChange={(e) => handleChange("stationCode", e.target.value)}
                            placeholder="e.g. NYX1"
                            required
                        />

                        <TextField
                            label="Email"
                            fullWidth
                            type="email"
                            value={form.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            placeholder="e.g. ny@hub.com"
                            required
                        />

                        <TextField
                            label="Telephone No"
                            fullWidth
                            value={form.telephoneNo}
                            onChange={(e) => handleChange("telephoneNo", e.target.value)}
                            placeholder="e.g. +1 212 555 0199"
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

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={form.isActive}
                                    onChange={(e) => handleChange("isActive", e.target.checked)}
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
                        // disabled={!form.contactCode?.trim() || !form.name?.trim() || !form.stationCode?.trim() || !form.email?.trim() || !form.country}
                        color="primary"
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 2,
                            px: 3,
                        }}
                    >
                        {isEdit ? "Save Changes" : "Add Hub"}
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}
