import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Dialog,
    IconButton,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
    type Bank,
    type BankFormState,
    INITIAL_BANK_STATE,
    ENTITY_OPTIONS,
    CURRENCY_OPTIONS,
} from "../types/bank.types";

interface BankDialogProps {
    open: boolean;
    onClose: () => void;
    bank: Bank | null; // null = create mode
    onSaved: () => void;
}

export default function BankDialog({
    open,
    onClose,
    bank,
    onSaved,
}: BankDialogProps) {

    const [form, setForm] = useState<BankFormState>(INITIAL_BANK_STATE);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isEdit = !!bank;

    // ── Populate form when dialog opens ───────────────────────────────────
    useEffect(() => {
        if (bank) {
            setForm({
                entity: bank.entity,
                bank: bank.bank,
                bankCode: bank.bankCode,
                accountName: bank.accountName,
                accountNumber: bank.accountNumber,
                currency: bank.currency,
                bankBalance: bank.bankBalance,
            });
        } else {
            setForm({ ...INITIAL_BANK_STATE });
        }
        setError("");
    }, [bank, open]);

    // ── Field updater ─────────────────────────────────────────────────────
    const setField = <K extends keyof BankFormState>(
        key: K,
        value: BankFormState[K],
    ) => setForm((prev) => ({ ...prev, [key]: value }));

    // ── Submit (Create / Update) ──────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent, createAnother = false) => {
        e.preventDefault();

        if (!form.entity.trim()) {
            setError("Entity is required.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // TODO: replace with real API call
            await new Promise((r) => setTimeout(r, 500));

            onSaved();

            if (createAnother) {
                setForm({ ...INITIAL_BANK_STATE });
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
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <Box
                sx={{

                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* ── Header ──────────────────────────────────────────── */}
                <Box
                    sx={{
                        px: 3,
                        py: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 600 }}
                    >
                        {isEdit ? "Edit Bank" : "Create Bank"}
                    </Typography>
                    <IconButton onClick={onClose} color="inherit">
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* ── Form ────────────────────────────────────────────── */}
                <Box
                    component="form"
                    id="bank-dialog-form"
                    onSubmit={(e) => handleSubmit(e)}
                    sx={{
                        p: 3,
                        flex: 1,
                        overflowY: "auto",
                    }}
                >
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            gap: 3,
                        }}
                    >
                        {/* Entity */}
                        <TextField
                            select
                            label="Entity"
                            value={form.entity}
                            onChange={(e) =>
                                setField("entity", e.target.value as any)
                            }
                            fullWidth
                            required
                        >
                            <MenuItem value="">
                                <em>Select Entity</em>
                            </MenuItem>
                            {ENTITY_OPTIONS.map((ent) => (
                                <MenuItem key={ent} value={ent}>
                                    {ent}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* Bank */}
                        <TextField
                            label="Bank"
                            value={form.bank}
                            onChange={(e) =>
                                setField("bank", e.target.value)
                            }
                            fullWidth
                        />

                        {/* Bank Code */}
                        <TextField
                            label="Bank Code"
                            value={form.bankCode}
                            onChange={(e) =>
                                setField("bankCode", e.target.value)
                            }
                            fullWidth
                        />

                        {/* Account Name */}
                        <TextField
                            label="Account Name"
                            value={form.accountName}
                            onChange={(e) =>
                                setField("accountName", e.target.value)
                            }
                            fullWidth
                        />

                        {/* Account Number */}
                        <TextField
                            label="Account Number"
                            value={form.accountNumber}
                            onChange={(e) =>
                                setField("accountNumber", e.target.value)
                            }
                            fullWidth
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

                        {/* Bank Balance */}
                        <TextField
                            label="Bank Balance"
                            type="number"
                            value={form.bankBalance}
                            onChange={(e) =>
                                setField("bankBalance", e.target.value)
                            }
                            fullWidth
                        />
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </Box>

                {/* ── Footer ──────────────────────────────────────────── */}
                <Box
                    sx={{
                        px: 3,
                        py: 2,
                        borderTop: 1,
                        borderColor: "divider",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1.5,
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>

                    {!isEdit && (
                        <Button
                            variant="outlined"
                            color="primary"
                            disabled={loading}
                            onClick={(e) => handleSubmit(e as any, true)}
                        >
                            {loading ? "Creating…" : "Create & Create Other"}
                        </Button>
                    )}

                    <Button
                        type="submit"
                        form="bank-dialog-form"
                        variant="contained"
                        disabled={loading}
                        color="primary"
                        sx={{
                            fontWeight: 600,
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
