import {
    Box,
    Button,
    Dialog,
    IconButton,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import type { TariffMaster } from "../types/trariffMaster.types";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";

interface TariffMasterDialogProps {
    open: boolean;
    onClose: () => void;
    tariffMaster: TariffMaster | null; // null = create mode, object = edit mode
    onSubmit: (data: TariffMaster) => void;
}

const CALCULATION_RULES = ["None", "Kg * Rate", "Order * Rate"];

const emptyForm = { name: "", calculation_rule: "None" };

export default function TariffMasterDialog({
    open,
    onClose,
    onSubmit,
    tariffMaster,
}: TariffMasterDialogProps) {
    const isEdit = !!tariffMaster?.id;

    const [form, setForm] = useState(emptyForm);

    // When dialog opens, seed form with existing data (edit) or clear it (create)
    useEffect(() => {
        if (open) {
            setForm(
                tariffMaster
                    ? { name: tariffMaster.name, calculation_rule: tariffMaster.calculation_rule }
                    : emptyForm
            );
        }
    }, [open, tariffMaster]);

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        const payload: TariffMaster = {
            id: tariffMaster?.id ?? 0, // 0 = new record (backend assigns real id)
            name: form.name,
            calculation_rule: form.calculation_rule as any,
        };
        onSubmit(payload);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{ "& .MuiDialog-paper": { bgcolor: "#fff" } }}>
            <Box
                sx={{

                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* ── STEP 1: Dialog Header ── */}
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
                    }}
                >
                    <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600 }}>
                        {isEdit ? "Edit Tariff" : "Add Tariff"}
                    </Typography>
                    <IconButton onClick={onClose} sx={{ color: "#fff" }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* ── STEP 2: Dialog Form Body (scrollable) ── */}
                <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 3 }}>
                    <Stack spacing={3}>
                        <TextField
                            label="Tariff Name"
                            fullWidth
                            value={form.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            placeholder="e.g. Air Freight Charges"
                            size="small"
                            required
                        />
                        <TextField
                            label="Calculation Rule"
                            fullWidth
                            select
                            value={form.calculation_rule}
                            onChange={(e) => handleChange("calculation_rule", e.target.value)}
                            size="small"
                            required
                        >
                            {CALCULATION_RULES.map((rule) => (
                                <MenuItem key={rule} value={rule}>
                                    {rule}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                </Box>

                {/* ── STEP 3: Dialog Footer with Save / Cancel ── */}
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
                        disabled={!form.name.trim()}
                        sx={{
                            background: "linear-gradient(135deg, #C62828 0%, #EF5350 100%)",
                            textTransform: "none",
                            fontWeight: 600,
                            "&:hover": {
                                background: "linear-gradient(135deg, #8E0000 0%, #C62828 100%)",
                            },
                        }}
                    >
                        {isEdit ? "Save Changes" : "Add Tariff"}
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}