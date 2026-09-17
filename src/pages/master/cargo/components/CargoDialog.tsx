import { Box, Button, Dialog, IconButton, Stack, TextField, Typography, FormControlLabel, Switch } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { Cargo } from "../types/cargo.types";
import { useEffect, useState } from "react";

interface CargoDialogProps {
    open: boolean;
    onClose: () => void;
    cargo?: Cargo | null;
    onSubmit?: (data: Cargo) => void;
}

export default function CargoDialog({ open, onClose, cargo, onSubmit }: CargoDialogProps) {
    const isEdit = !!cargo?.id;
    const emptyForm = {
        cargo_name: "",
        description: "",
        hsv_code: "",
        active: true,
    };
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        if (open) {
            setForm(
                cargo
                    ? {
                        cargo_name: cargo.cargo_name,
                        description: cargo.description,
                        hsv_code: cargo.hsv_code,
                        active: cargo.active,
                    }
                    : emptyForm
            );
        }
    }, [open, cargo]);

    const handleChange = (field: keyof typeof form, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (!onSubmit) return;
        const payload: Cargo = {
            id: cargo?.id ?? 0,
            cargo_name: form.cargo_name,
            description: form.description,
            hsv_code: form.hsv_code,
            active: form.active,
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
            sx={{ "& .MuiDialog-paper": { bgcolor: "#fff" } }}
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
                        borderBottom: 1,
                        borderColor: "divider",
                        background: "linear-gradient(135deg, #C62828 0%, #EF5350 100%)",
                    }}
                >
                    <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600 }}>
                        {isEdit ? "Edit Cargo" : "Add Cargo"}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
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
                            label="Cargo Name"
                            fullWidth
                            value={form.cargo_name}
                            onChange={(e) => handleChange("cargo_name", e.target.value)}
                            placeholder="e.g. Electronics"
                            size="small"
                            required
                        />

                        <TextField
                            label="HSV Code"
                            fullWidth
                            value={form.hsv_code}
                            onChange={(e) => handleChange("hsv_code", e.target.value)}
                            placeholder="e.g. 8543"
                            size="small"
                            required
                        />
                    </Box>
                </Box>
                <Box sx={{ flex: 1, overflowY: "auto", px: 3, }}>
                    <Stack spacing={2.5}>
                       
                        <TextField
                            label="Description"
                            fullWidth
                            value={form.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            placeholder="Enter cargo description"
                            size="small"
                            multiline
                            rows={3}
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
                    </Stack>
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
                        disabled={!form.cargo_name.trim() || !form.hsv_code.trim()}
                        sx={{
                            background: "linear-gradient(135deg, #C62828 0%, #EF5350 100%)",
                            textTransform: "none",
                            color: "#ffffff",
                            fontWeight: 600,
                            "&:hover": {
                                background: "linear-gradient(135deg, #8E0000 0%, #C62828 100%)",
                            },
                        }}
                    >
                        {isEdit ? "Save Changes" : "Add Cargo"}
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}
