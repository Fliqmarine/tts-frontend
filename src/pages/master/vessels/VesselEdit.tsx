import { DirectionsBoatFilledOutlined } from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    MenuItem,
    Paper,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { forwardRef, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import type { Value } from "react-phone-number-input";
import {
    type PersonInfo,
    type VesselFormState,
    INITIAL_VESSEL_STATE,
} from "./types/vessel.types";
import { getUsers } from "../users/services/user.service";
import type { User } from "../users/types/user.types";
import type { Vessel } from "./components/Table";

const PhoneInputField = forwardRef<HTMLInputElement, any>((props, ref) => (
    <TextField label="Telephone" {...props} inputRef={ref} />
));
PhoneInputField.displayName = "PhoneInputField";

// TODO: replace with real client list from API
const clients: { id: string; name: string }[] = [];

const SECTION_HEADER_SX = {
    py: 0.5,
    px: 2,
    display: "flex",
    alignItems: "center",
    bgcolor: "primary.main",
    color: "primary.contrastText",
    borderRadius: 1,
} as const;

function SectionHeader({ title }: { title: string }) {
    return (
        <Box sx={SECTION_HEADER_SX}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {title}
            </Typography>
        </Box>
    );
}

function PersonInfoSection({
    title,
    labelPrefix,
    value,
    onChange,
}: {
    title: string;
    labelPrefix: string;
    value: PersonInfo;
    onChange: (next: PersonInfo) => void;
}) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <SectionHeader title={title} />
            <Box
                sx={{
                    px: 2,
                    pb: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                }}
            >
                <TextField
                    label={`${labelPrefix} Name`}
                    value={value.name}
                    onChange={(event) =>
                        onChange({ ...value, name: event.target.value })
                    }
                    fullWidth
                    required
                />
                <TextField
                    label={`${labelPrefix} Email`}
                    type="email"
                    value={value.email}
                    onChange={(event) =>
                        onChange({ ...value, email: event.target.value })
                    }
                    fullWidth
                    required
                />
                <Box sx={{ display: 'flex', alignItems: 'center', '& .PhoneInputCountry': { mr: 1 } }}>
                    <PhoneInput
                        international
                        defaultCountry="AE"
                        value={value.telephone as Value}
                        onChange={(val) =>
                            onChange({ ...value, telephone: val || "" })
                        }
                        inputComponent={PhoneInputField}
                        style={{ flex: 1, width: '100%' }}
                    />
                </Box>
            </Box>
        </Box>
    );
}

export default function VesselEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState<VesselFormState>(INITIAL_VESSEL_STATE);
    const [keyAccountManagers, setKeyAccountManagers] = useState<User[]>([]);

    useEffect(() => {
        getUsers()
            .then(users => {
                setKeyAccountManagers(users.filter(u => u.role === "Key Account Manager"));
            })
            .catch(console.error);
    }, []);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error";
    }>({ open: false, message: "", severity: "success" });

    // ── Fetch existing vessel on mount ────────────────────────────────────
    useEffect(() => {
        if (!id) return;
        const fetchVessel = async () => {
            try {
                const vessel = (location.state as { vessel?: Vessel } | null)?.vessel;

                if (vessel) {
                    setForm((previous) => ({
                        ...previous,
                        clientId: vessel.clientName,
                        vesselName: vessel.vesselName,
                        imoNo: vessel.imoNo,
                        shipId: vessel.vesselCode,
                        email: vessel.picEmail,
                        clientPic: {
                            ...previous.clientPic,
                            name: vessel.picName,
                            email: vessel.picEmail,
                        },
                    }));
                }
            } catch {
                setSnackbar({
                    open: true,
                    message: "Failed to load vessel data.",
                    severity: "error",
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchVessel();
    }, [id, location.state]);

    // ── Update handler ────────────────────────────────────────────────────
    const handleUpdate = async () => {
        if (!form.vesselName || !form.imoNo) {
            setSnackbar({
                open: true,
                message:
                    "Please fill in all required fields (Vessel Name, IMO No).",
                severity: "error",
            });
            return;
        }

        setIsSaving(true);
        try {
            // TODO: replace with real API call, e.g. await updateVessel(Number(id), form);
            await new Promise((r) => setTimeout(r, 600));

            setSnackbar({
                open: true,
                message: "Vessel updated successfully!",
                severity: "success",
            });
            setTimeout(() => navigate(-1), 1200);
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message ??
                "Failed to update vessel. Please try again.";
            setSnackbar({ open: true, message: msg, severity: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => navigate(-1);

    /** Update a top-level field */
    const setField = <K extends keyof VesselFormState>(
        key: K,
        value: VesselFormState[K],
    ) => setForm((prev) => ({ ...prev, [key]: value }));

    // ── Loading state ─────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "60vh",
                }}
            >
                <CircularProgress color="error" />
            </Box>
        );
    }

    return (
        <Stack sx={{ pb: 4 }}>
            {/* Page Header */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 2,
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 2,
                    mb: 3,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            flexShrink: 0,
                            borderRadius: 2,
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <DirectionsBoatFilledOutlined
                            sx={{ fontSize: 26 }}
                        />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Edit Vessel
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={handleCancel}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleUpdate}
                        disabled={isSaving}
                        startIcon={
                            isSaving ? (
                                <CircularProgress size={16} color="inherit" />
                            ) : null
                        }
                    >
                        {isSaving ? "Saving…" : "Update"}
                    </Button>
                </Box>
            </Box>

            {/* Client selector */}
            <TextField
                select
                label="Client"
                value={form.clientId}
                onChange={(event) =>
                    setField("clientId", event.target.value)
                }
                fullWidth
                required
                sx={{ mb: 1, maxWidth: 300 }}
            >
                <MenuItem value="">
                    <em>Select Client</em>
                </MenuItem>
                {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                        {client.name}
                    </MenuItem>
                ))}
            </TextField>

            {/* Main grid: vessel details | contacts | invoice info */}
            <Box
                sx={{
                    display: "grid",
                    gap: 3,
                    gridTemplateColumns: {
                        xs: "2fr",
                        md: "2fr 0.5fr",
                        lg: "1fr 0.7fr 1fr auto",
                    },
                    alignItems: "start",
                }}
            >
                {/* Vessel details */}
                <Box
                    component={Paper}
                    variant="outlined"
                    sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                    <SectionHeader title="Vessel Details" />
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            gap: 1.5,
                        }}
                    >
                        <TextField
                            label="Vessel name"
                            value={form.vesselName}
                            onChange={(event) =>
                                setField("vesselName", event.target.value)
                            }
                            fullWidth
                            required
                        />
                        <TextField
                            label="IMO No"
                            value={form.imoNo}
                            onChange={(event) =>
                                setField("imoNo", event.target.value)
                            }
                            fullWidth
                            required
                        />
                        <TextField
                            label="Ship Id"
                            value={form.shipId}
                            onChange={(event) =>
                                setField("shipId", event.target.value)
                            }
                            fullWidth
                            required
                        />
                        <TextField
                            label="Vessel flag"
                            value={form.vesselFlag}
                            onChange={(event) =>
                                setField("vesselFlag", event.target.value)
                            }
                            fullWidth
                            required
                        />
                        <TextField
                            label="Build Year"
                            type="number"
                            value={form.buildYear}
                            onChange={(event) =>
                                setField("buildYear", event.target.value)
                            }
                            fullWidth
                            required
                        />
                        <TextField
                            label="Budget"
                            type="number"
                            value={form.budget}
                            onChange={(event) =>
                                setField("budget", event.target.value)
                            }
                            fullWidth
                            required
                        />
                        <TextField
                            label="Currency"
                            value={form.currency}
                            onChange={(event) =>
                                setField("currency", event.target.value)
                            }
                            fullWidth
                            required
                        />
                        <TextField
                            label="Email"
                            type="email"
                            value={form.email}
                            onChange={(event) =>
                                setField("email", event.target.value)
                            }
                            fullWidth
                            required
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', '& .PhoneInputCountry': { mr: 1 } }}>
                            <PhoneInput
                                international
                                defaultCountry="AE"
                                value={form.telephone as Value}
                                onChange={(val) =>
                                    setField("telephone", val || "")
                                }
                                inputComponent={PhoneInputField}
                                style={{ flex: 1, width: '100%' }}
                            />
                        </Box>
                        <TextField
                            select
                            label="Vessel type"
                            value={form.vesselType}
                            onChange={(event) =>
                                setField("vesselType", event.target.value)
                            }
                            fullWidth
                            required
                        >
                            <MenuItem value="M/V">M/V</MenuItem>
                            <MenuItem value="M/T">M/T</MenuItem>
                        </TextField>
                        <TextField
                            select
                            label="Key Account Manager"
                            value={form.keyAccountManager}
                            onChange={(event) =>
                                setField("keyAccountManager", event.target.value)
                            }
                            fullWidth
                            required
                            sx={{ gridColumn: { xs: "auto", sm: "1 / -1" } }}
                        >
                            <MenuItem value="">
                                <em>Select Key Account Manager</em>
                            </MenuItem>
                            {keyAccountManagers.map((manager) => (
                                <MenuItem key={manager.id} value={manager.id.toString()}>
                                    {manager.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </Box>

                {/* Contacts */}
                <Box
                    component={Paper}
                    variant="outlined"
                    sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2.5 }}
                >
                    <PersonInfoSection
                        title="Vessel Person Incharge"
                        labelPrefix="Client Pic"
                        value={form.clientPic}
                        onChange={(next) => setField("clientPic", next)}
                    />
                    <PersonInfoSection
                        title="Vessel Manager Info"
                        labelPrefix="Supt"
                        value={form.supt}
                        onChange={(next) => setField("supt", next)}
                    />
                </Box>

                {/* Invoice info */}
                <Box
                    component={Paper}
                    variant="outlined"
                    sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                        gridColumn: { xs: "auto", md: "1 / -1", lg: "auto" },
                    }}
                >
                    <SectionHeader title="Invoice Info" />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={form.billingAddressSameAsAddress}
                                onChange={(event) =>
                                    setField(
                                        "billingAddressSameAsAddress",
                                        event.target.checked,
                                    )
                                }
                            />
                        }
                        label="Billing address same as vessel address"
                    />
                    <TextField
                        label="Billing address"
                        value={form.billingAddress}
                        onChange={(event) =>
                            setField("billingAddress", event.target.value)
                        }
                        disabled={form.billingAddressSameAsAddress}
                        fullWidth
                        required
                        multiline
                        minRows={2}
                    />
                </Box>
                <Box></Box>
            </Box>

            {/* Toast feedback */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() =>
                    setSnackbar((s) => ({ ...s, open: false }))
                }
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() =>
                        setSnackbar((s) => ({ ...s, open: false }))
                    }
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Stack>
    );
}