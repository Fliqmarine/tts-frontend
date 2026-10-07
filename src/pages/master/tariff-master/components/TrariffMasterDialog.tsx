import {
    Box,
    Button,
    Dialog,
    Divider,
    IconButton,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import { useEffect, useState } from "react";
import { CALCULATION_RULES, type CalculationRule, type TariffMaster } from "../types/trariffMaster.types";

interface TariffMasterDialogProps {
    open: boolean;
    onClose: () => void;
    tariffMaster: TariffMaster | null; // null = create mode, object = edit mode
    onSubmit: (data: TariffMaster) => void;
}

const emptyForm: { name: string; calculation_rule: CalculationRule } = {
    name: "",
    calculation_rule: "None",
};

export default function TariffMasterDialog({
    open,
    onClose,
    onSubmit,
    tariffMaster,
}: TariffMasterDialogProps) {
    const isEdit = !!tariffMaster?.id;
    const [form, setForm] = useState(emptyForm);
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        if (open) {
            setTouched(false);
            setForm(
                tariffMaster
                    ? {
                          name: tariffMaster.name || "",
                          calculation_rule: tariffMaster.calculation_rule || "None",
                      }
                    : emptyForm
            );
        }
    }, [open, tariffMaster]);

    const nameError = touched && !form.name.trim();

    const handleChange = (field: "name" | "calculation_rule", value: string) => {
        setForm((prev) =>
            field === "name"
                ? { ...prev, name: value }
                : { ...prev, calculation_rule: value as CalculationRule }
        );
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        setTouched(true);
        if (!form.name.trim()) return;

        onSubmit({
            id: tariffMaster?.id ?? 0, // 0 = new record (backend assigns real id)
            name: form.name.trim(),
            calculation_rule: form.calculation_rule,
        });
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
        >
            <Box component="form" onSubmit={handleSubmit} noValidate>
                {/* Header */}
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
                        <SellOutlinedIcon />
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                            {isEdit ? "Edit Tariff" : "Add Tariff"}
                        </Typography>
                    </Box>

                    <IconButton onClick={onClose} size="small" aria-label="close">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                {/* Body */}
                <Box sx={{ px: 3, py: 3 }}>
                    <Stack spacing={3}>
                        <TextField
                            label="Tariff Name"
                            fullWidth
                            autoFocus
                            required
                            value={form.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            onBlur={() => setTouched(true)}
                            placeholder="e.g. Air Freight Charges"
                            error={nameError}
                            helperText={nameError ? "Tariff name is required" : " "}
                        />

                        <TextField
                            label="Calculation Rule"
                            fullWidth
                            select
                            value={form.calculation_rule}
                            onChange={(e) => handleChange("calculation_rule", e.target.value)}
                            helperText="Determines how this charge is calculated on invoices"
                        >
                            {CALCULATION_RULES.map((rule) => (
                                <MenuItem key={rule} value={rule}>
                                    {rule}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                </Box>

                <Divider />

                {/* Footer */}
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
                    <Button
                        onClick={onClose}
                        color="error"
                        variant="outlined"
                        sx={{ textTransform: "none", borderRadius: 2, px: 2.5 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disableElevation
                        disabled={!form.name.trim()}
                        sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 3 }}
                    >
                        {isEdit ? "Save Changes" : "Add Tariff"}
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}