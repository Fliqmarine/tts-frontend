import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Dialog,
    Divider,
    FormControlLabel,
    IconButton,
    MenuItem,
    Switch,
    TextField,
    Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import {
    type Vendor,
    type VendorFormState,
    INITIAL_VENDOR_STATE,
    PAYMENT_TERM_OPTIONS,
    CURRENCY_OPTIONS,
} from "../types/vendor.types";

interface VendorDialogProps {
    open: boolean;
    onClose: () => void;
    vendor: Vendor | null; // null = create mode
    onSaved: () => void;
}

export default function VendorDialog({
    open,
    onClose,
    vendor,
    onSaved,
}: VendorDialogProps) {
    const [form, setForm] = useState<VendorFormState>(INITIAL_VENDOR_STATE);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isEdit = !!vendor;

    // ── Populate form when Dialog opens ───────────────────────────────────
    useEffect(() => {
        if (vendor) {
            setForm({
                vendorName: vendor.vendorName,
                currency: vendor.currency,
                paymentTerm: vendor.paymentTerm,
                isActive: vendor.isActive,
            });
        } else {
            setForm({ ...INITIAL_VENDOR_STATE });
        }
        setError("");
    }, [vendor, open]);

    // ── Field updater ─────────────────────────────────────────────────────
    const setField = <K extends keyof VendorFormState>(
        key: K,
        value: VendorFormState[K],
    ) => setForm((prev) => ({ ...prev, [key]: value }));

    // ── Submit (Create / Update) ──────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent, createAnother = false) => {
        e.preventDefault();

        if (!form.vendorName.trim()) {
            setError("Vendor Name is required.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // TODO: replace with real API call
            // if (isEdit) await updateVendor(vendor!.id, form);
            // else await createVendor(form);
            await new Promise((r) => setTimeout(r, 500));

            onSaved();

            if (createAnother) {
                // Reset form but keep Dialog open
                setForm({ ...INITIAL_VENDOR_STATE });
            } else {
                onClose();
            }
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message ?? "Something went wrong.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <Box>
                {/* ── Header ──────────────────────────────────────────── */}
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
                    <Box sx={{ width: 44, height: 44, borderRadius: 1, display: "grid", placeItems: "center", bgcolor: "primary.main", color: "primary.contrastText", boxShadow: (t) => `0 6px 16px ${alpha(t.palette.primary.main, 0.35)}` }}>
                        <StoreOutlinedIcon />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                            {isEdit ? "Edit Vendor" : "Create Vendor"}
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose} size="small" aria-label="close">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                {/* ── Form ────────────────────────────────────────────── */}
                <Box
                    component="form"
                    id="vendor-Dialog-form"
                    onSubmit={(e) => handleSubmit(e)}
                    sx={{
                        px: 3,
                        py: 3,
                        flex: 1,
                        overflowY: "auto",
                    }}
                >
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            columnGap: 2,
                            rowGap: 2.5,
                        }}
                    >
                        {/* Vendor Name */}
                        <TextField
                            label="Vendor Name"
                            value={form.vendorName}
                            onChange={(e) =>
                                setField("vendorName", e.target.value)
                            }
                            fullWidth
                            required
                        />

                        {/* Currency */}
                        <TextField
                            select
                            label="Currency"
                            value={form.currency}
                            onChange={(e) =>
                                setField("currency", e.target.value as any)
                            }
                            fullWidth
                        >
                            <MenuItem value="">
                                <em>Select Currency</em>
                            </MenuItem>
                            {CURRENCY_OPTIONS.map((c) => (
                                <MenuItem key={c} value={c}>
                                    {c}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* Payment Term */}
                        <TextField
                            select
                            label="Payment Term"
                            value={form.paymentTerm}
                            onChange={(e) =>
                                setField("paymentTerm", e.target.value as any)
                            }
                            fullWidth
                        >
                            <MenuItem value="">
                                <em>Select Payment Term</em>
                            </MenuItem>
                            {PAYMENT_TERM_OPTIONS.map((pt) => (
                                <MenuItem key={pt} value={pt}>
                                    {pt}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* Status Toggle */}
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={form.isActive}
                                    onChange={(e) =>
                                        setField("isActive", e.target.checked)
                                    }
                                    color="success"
                                />
                            }
                            label={
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 500 }}
                                >
                                    Status:{" "}
                                    <Box
                                        component="span"
                                        sx={{
                                            color: form.isActive
                                                ? "success.main"
                                                : "text.disabled",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {form.isActive ? "Active" : "Inactive"}
                                    </Box>
                                </Typography>
                            }
                        />
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </Box>

                {/* ── Footer ──────────────────────────────────────────── */}
                <Divider />
                <Box
                    sx={{
                        px: 3,
                        py: 2,
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1.5,
                        bgcolor: (t) => alpha(t.palette.grey[500], 0.04),
                    }}
                >
                    <Button
                        onClick={onClose}
                        color="error"
                        variant="outlined"
                        disabled={loading}
                        sx={{ textTransform: "none", borderRadius: 2, px: 2.5 }}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        form="vendor-Dialog-form"
                        variant="contained"
                        color="primary"
                        disableElevation
                        disabled={loading}
                        sx={{
                            fontWeight: 600,
                            textTransform: "none",
                            borderRadius: 2,
                            px: 3,
                        }}
                    >
                        {loading
                            ? isEdit
                                ? "Updating…"
                                : "Creating…"
                            : isEdit
                                ? "Update"
                                : "Create"}
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}
