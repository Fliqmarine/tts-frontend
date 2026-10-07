import { Box, Button, Dialog, Divider, TextField, FormControlLabel, Switch, Typography, IconButton, FormControl, InputLabel, Select, MenuItem, Stack } from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import type { GLCodeParent } from "../types/glCodeParent.types";
import { useEffect, useState } from "react";

interface GLCodeParentDialogProps {
    open: boolean;
    onClose: () => void;
    glCode?: GLCodeParent | null;
    onSubmit?: (data: GLCodeParent) => void;
}

const TYPES = ["Income", "Expense"];

export default function GLCodeParentDialog({ open, onClose, glCode, onSubmit }: GLCodeParentDialogProps) {
    const isEdit = !!glCode?.id;
    const emptyForm = {
        name: "",
        code: "",
        type: "" as any,
        active: true,
    } as Omit<GLCodeParent, "id">;
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        if (open) {
            setForm(
                glCode
                    ? {
                        name: glCode.name || "",
                        code: glCode.code || "",
                        type: (glCode.type || "") as any,
                        active: glCode.active ?? true,
                    }
                    : emptyForm
            );
        }
    }, [open, glCode]);

    const handleChange = (field: keyof typeof form, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (!onSubmit) return;
        const payload: GLCodeParent = {
            id: glCode?.id ?? 0,
            name: form.name,
            code: form.code,
            type: form.type,
            active: form.active,
        };
        onSubmit(payload);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} noValidate>
                <Box sx={{ px: 3, py: 2.5, display: "flex", alignItems: "center", gap: 2, bgcolor: (t) => alpha(t.palette.primary.main, 0.06), borderBottom: 1, borderColor: "divider" }}>
                    <Box sx={{ width: 44, height: 44, borderRadius: 1, display: "grid", placeItems: "center", bgcolor: "primary.main", color: "primary.contrastText", boxShadow: (t) => `0 6px 16px ${alpha(t.palette.primary.main, 0.35)}` }}><AccountTreeOutlinedIcon /></Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}><Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{isEdit ? "Edit GL Code Parent" : "Add GL Code Parent"}</Typography></Box>
                    <IconButton onClick={onClose} size="small" aria-label="close"><CloseIcon fontSize="small" /></IconButton>
                </Box>

            <Box sx={{ px: 3, py: 3 }}>
                <Stack spacing={2.5}>
                    <TextField
                        label="Name"
                        fullWidth
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required
                    />
                    <TextField
                        label="GL Code"
                        fullWidth
                        value={form.code}
                        onChange={(e) => handleChange("code", e.target.value)}
                        placeholder="e.g. 1000"
                        required
                    />

                    <FormControl fullWidth required>
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={form.type}
                            label="Type"
                            onChange={(e) => handleChange("type", e.target.value)}
                        >
                            {TYPES.map((t) => (
                                <MenuItem key={t} value={t}>
                                    {t}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

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
            <Box sx={{ px: 3, py: 2, display: "flex", gap: 1.5, justifyContent: "flex-end", bgcolor: (t) => alpha(t.palette.grey[500], 0.04) }}>
                <Button onClick={onClose} color="error" variant="outlined" sx={{ textTransform: "none", borderRadius: 2, px: 2.5 }}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    // disabled={!form.name?.trim() || !form.code?.trim() || !form.type?.trim()}
                    color="primary"
                    disableElevation
                    sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 3,
                    }}
                >
                    {isEdit ? "Save Changes" : "Create"}
                </Button>
            </Box>
            </Box>
        </Dialog>
    );
}
