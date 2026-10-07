import { Box, Button, Dialog, Divider, IconButton, Stack, TextField, Typography, FormControlLabel, Switch } from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
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
                        cargo_name: cargo.cargo_name || "",
                        description: cargo.description || "",
                        hsv_code: cargo.hsv_code || "",
                        active: cargo.active ?? true,
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
                        <Inventory2OutlinedIcon />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                            {isEdit ? "Edit Cargo" : "Add Cargo"}
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
                            label="Cargo Name"
                            fullWidth
                            value={form.cargo_name}
                            onChange={(e) => handleChange("cargo_name", e.target.value)}
                            placeholder="e.g. Electronics"
                            required
                        />

                        <TextField
                            label="HSV Code"
                            fullWidth
                            value={form.hsv_code}
                            onChange={(e) => handleChange("hsv_code", e.target.value)}
                            placeholder="e.g. 8543"
                            required
                        />
                    </Box>
                </Box>
                <Box sx={{ px: 3, pb: 3 }}>
                    <Stack spacing={2.5}>

                        <TextField
                            label="Description"
                            fullWidth
                            value={form.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            placeholder="Enter cargo description"
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
                        // disabled={!form.cargo_name?.trim() || !form.hsv_code?.trim()}
                        color="primary"
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 2,
                            px: 3,
                        }}
                    >
                        {isEdit ? "Save Changes" : "Add Cargo"}
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}
