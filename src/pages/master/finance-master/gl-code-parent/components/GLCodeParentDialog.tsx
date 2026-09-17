import { Box, Button, Dialog, DialogContent, DialogActions, TextField, FormControlLabel, Switch, Typography, IconButton, FormControl, InputLabel, Select, MenuItem, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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
    const emptyForm: Omit<GLCodeParent, "id"> = {
        name: "",
        code: "",
        type: "",
        active: true,
    };
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        if (open) {
            setForm(
                glCode
                    ? {
                        name: glCode.name,
                        code: glCode.code,
                        type: glCode.type,
                        active: glCode.active,
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
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="sm" fullWidth
            sx={{ "& .MuiDialog-paper": { bgcolor: "#fff" } }}
        
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
                    color: "#fff",
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {isEdit ? "Edit GL Code Parent" : "Add GL Code Parent"}
                </Typography>
                <IconButton onClick={onClose} sx={{ color: "#fff" }} size="small">
                    <CloseIcon />
                </IconButton>
            </Box>

            <DialogContent dividers sx={{ p: 3 }}>
                <Stack spacing={3}>
                    <TextField
                        label="Name"
                        fullWidth
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        size="small"
                        required
                    />
                    <TextField
                        label="GL Code"
                        fullWidth
                        value={form.code}
                        onChange={(e) => handleChange("code", e.target.value)}
                        placeholder="e.g. 1000"
                        size="small"
                        required
                    />

                    <FormControl fullWidth size="small" required>
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
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button variant="outlined" onClick={onClose} sx={{ textTransform: "none" }}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!form.code.trim() || !form.type.trim()}
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
                    {isEdit ? "Save Changes" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
