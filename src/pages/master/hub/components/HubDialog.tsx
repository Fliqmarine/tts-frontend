import { Box, Button, Dialog, IconButton, Stack, TextField, Typography, FormControlLabel, Switch, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { Hub } from "../types/hub.types";
import { useEffect, useState } from "react";

interface HubDialogProps {
    open: boolean;
    onClose: () => void;
    hub?: Hub | null;
    onSubmit?: (data: Hub) => void;
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

export default function HubDialog({ open, onClose, hub, onSubmit }: HubDialogProps) {
    const isEdit = !!hub?.id;
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
                hub
                    ? {
                        contactCode: hub.contactCode,
                        name: hub.name,
                        stationCode: hub.stationCode,
                        email: hub.email,
                        telephoneNo: hub.telephoneNo,
                        country: hub.country,
                        isActive: hub.isActive,
                    }
                    : emptyForm
            );
        }
    }, [open, hub]);

    const handleChange = (field: keyof typeof form, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (!onSubmit) return;
        const payload: Hub = {
            id: hub?.id ?? 0,
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
                        {isEdit ? "Edit Hub" : "Add Hub"}
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
                            label="Contact Code"
                            fullWidth
                            value={form.contactCode}
                            onChange={(e) => handleChange("contactCode", e.target.value)}
                            placeholder="e.g. C001"
                            size="small"
                            required
                        />

                        <TextField
                            label="Hub Name"
                            fullWidth
                            value={form.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            placeholder="e.g. Global Hub NY"
                            size="small"
                            required
                        />

                        <TextField
                            label="Station Code"
                            fullWidth
                            value={form.stationCode}
                            onChange={(e) => handleChange("stationCode", e.target.value)}
                            placeholder="e.g. NYX1"
                            size="small"
                            required
                        />

                        <TextField
                            label="Email"
                            fullWidth
                            type="email"
                            value={form.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            placeholder="e.g. ny@hub.com"
                            size="small"
                            required
                        />

                        <TextField
                            label="Telephone No"
                            fullWidth
                            value={form.telephoneNo}
                            onChange={(e) => handleChange("telephoneNo", e.target.value)}
                            placeholder="e.g. +1 212 555 0199"
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
                        disabled={!form.contactCode.trim() || !form.name.trim() || !form.stationCode.trim() || !form.email.trim() || !form.country}
                        color="primary"
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                        }}
                    >
                        {isEdit ? "Save Changes" : "Add Hub"}
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}
