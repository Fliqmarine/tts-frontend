import { Box, Button, Dialog, DialogContent, DialogActions, TextField, FormControlLabel, Switch, Typography, IconButton, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { GLCodeChildren } from "../types/glCodeChildren.types";
import { useEffect, useState } from "react";

interface GLCodeChildrenDialogProps {
    open: boolean;
    onClose: () => void;
    glCode?: GLCodeChildren | null;
    onSubmit?: (data: GLCodeChildren) => void;
}


export default function GLCodeChildrenDialog({ open, onClose, glCode, onSubmit }: GLCodeChildrenDialogProps) {
    const isEdit = !!glCode?.id;
    const emptyForm: Omit<GLCodeChildren, "id"> = {
        glCodeParentId: "",
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
                        glCodeParentId: glCode.glCodeParentId,
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
        const payload: GLCodeChildren = {
            id: glCode?.id ?? 0,
            glCodeParentId: form.glCodeParentId,
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
                <Box 
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 3,
                    }}
                >
                    <TextField
                        select
                        label="GLCode Parent"
                        fullWidth
                        value={form.glCodeParentId}
                        onChange={(e) => handleChange("glCodeParentId", e.target.value)}
                        size="small"
                        required

                    />
                    <TextField
                        label="Name"
                        fullWidth
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        size="small"
                        required
                    />
                    <TextField
                        label="GL Code Children"
                        fullWidth
                        value={form.code}
                        onChange={(e) => handleChange("code", e.target.value)}
                        placeholder="e.g. 1000"
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
                    disabled={!form.code.trim() || !form.name.trim() || !form.glCodeParentId}
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
