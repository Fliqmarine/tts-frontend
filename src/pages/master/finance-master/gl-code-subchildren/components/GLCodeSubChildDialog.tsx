import { Box, Button, Dialog, DialogContent, DialogActions, TextField, FormControlLabel, Switch, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { GLCodeSubChild } from "../types/glCodeSubChildren.types";
import { useEffect, useState } from "react";

interface GLCodeSubChildDialogProps {
    open: boolean;
    onClose: () => void;
    glCode?: GLCodeSubChild | null;
    onSubmit?: (data: GLCodeSubChild) => void;
}

export default function GLCodeSubChildDialog({ open, onClose, glCode, onSubmit }: GLCodeSubChildDialogProps) {
    const isEdit = !!glCode?.id;
    const emptyForm: Omit<GLCodeSubChild, "id"> = {
        glCodeParentName: "",
        glCodeChildrenName: "",
        name: "",
        code: "",
        active: true,
    };
    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        if (open) {
            setForm(
                glCode
                    ? {
                        glCodeParentName: glCode.glCodeParentName,
                        glCodeChildrenName: glCode.glCodeChildrenName,
                        name: glCode.name,
                        code: glCode.code,
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
        const payload: GLCodeSubChild = {
            id: glCode?.id ?? 0,
            glCodeParentName: form.glCodeParentName,
            glCodeChildrenName: form.glCodeChildrenName,
            name: form.name,
            code: form.code,
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
                    background: "linear-gradient(135deg, #C62828 0%, #1d1d1dff 100%)",
                    color: "#fff",
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {isEdit ? "Edit GL Code Sub-Child" : "Add GL Code Sub-Child"}
                </Typography>
                <IconButton onClick={onClose} sx={{ color: "#fff" }} size="small">
                    <CloseIcon />
                </IconButton>
            </Box>

            <DialogContent dividers sx={{ p: 3 }}>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 3,
                    }}
                >
                    <TextField
                        select
                        label="GL Code Parent"
                        fullWidth
                        SelectProps={{ native: true }}
                        value={form.glCodeParentName}
                        onChange={(e) => handleChange("glCodeParentName", e.target.value)}
                        size="small"
                        required
                    >
                        <option value=""></option>
                        <option value="Sales revenue">Sales revenue</option>
                    </TextField>
                    <TextField
                        select
                        label="GL Code Child"
                        fullWidth
                        SelectProps={{ native: true }}
                        value={form.glCodeChildrenName}
                        onChange={(e) => handleChange("glCodeChildrenName", e.target.value)}
                        size="small"
                        required
                    >
                        <option value=""></option>
                        <option value="Product Sales">Product Sales</option>
                        <option value="Service Sales">Service Sales</option>
                    </TextField>
                    <TextField
                        label="Name"
                        fullWidth
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        size="small"
                        required
                    />
                    <TextField
                        label="Code"
                        fullWidth
                        value={form.code}
                        onChange={(e) => handleChange("code", e.target.value)}
                        placeholder="e.g. 1001"
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
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button variant="outlined" onClick={onClose} sx={{ textTransform: "none" }}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!form.code.trim() || !form.name.trim() || !form.glCodeParentName || !form.glCodeChildrenName}
                    sx={{
                        background: "linear-gradient(135deg, #C62828 0%, #EF5350 100%)",
                        textTransform: "none",
                        color: "#fff",
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
