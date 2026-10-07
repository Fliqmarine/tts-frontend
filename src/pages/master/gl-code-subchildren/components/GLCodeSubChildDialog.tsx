import { Box, Button, Dialog, Divider, TextField, FormControlLabel, Switch, Typography, IconButton } from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
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
                        glCodeParentName: glCode.glCodeParentName || "",
                        glCodeChildrenName: glCode.glCodeChildrenName || "",
                        name: glCode.name || "",
                        code: glCode.code || "",
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
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} noValidate>
                <Box sx={{ px: 3, py: 2.5, display: "flex", alignItems: "center", gap: 2, bgcolor: (t) => alpha(t.palette.primary.main, 0.06), borderBottom: 1, borderColor: "divider" }}>
                    <Box sx={{ width: 44, height: 44, borderRadius: 1, display: "grid", placeItems: "center", bgcolor: "primary.main", color: "primary.contrastText", boxShadow: (t) => `0 6px 16px ${alpha(t.palette.primary.main, 0.35)}` }}><AccountTreeOutlinedIcon /></Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}><Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{isEdit ? "Edit GL Code Sub-Child" : "Add GL Code Sub-Child"}</Typography></Box>
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
                        select
                        label="GL Code Parent"
                        fullWidth
                        SelectProps={{ native: true }}
                        value={form.glCodeParentName}
                        onChange={(e) => handleChange("glCodeParentName", e.target.value)}
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
                        required
                    />
                    <TextField
                        label="Code"
                        fullWidth
                        value={form.code}
                        onChange={(e) => handleChange("code", e.target.value)}
                        placeholder="e.g. 1001"
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
            </Box>

            <Divider />
            <Box sx={{ px: 3, py: 2, display: "flex", gap: 1.5, justifyContent: "flex-end", bgcolor: (t) => alpha(t.palette.grey[500], 0.04) }}>
                <Button onClick={onClose} color="error" variant="outlined" sx={{ textTransform: "none", borderRadius: 2, px: 2.5 }}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    // disabled={!form.code?.trim() || !form.name?.trim() || !form.glCodeParentName || !form.glCodeChildrenName}
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
