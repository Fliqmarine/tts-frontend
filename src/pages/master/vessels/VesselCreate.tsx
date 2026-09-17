import { DirectionsBoatFilledOutlined } from "@mui/icons-material";
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { forwardRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    backgroundColor: "#373737ff",
    color: "white",
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
                        defaultCountry=""
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

export default function VesselCreate() {
    const navigate = useNavigate();
    const [form, setForm] = useState<VesselFormState>(INITIAL_VESSEL_STATE);
    const [keyAccountManagers, setKeyAccountManagers] = useState<User[]>([]);

    useEffect(() => {
        getUsers()
            .then(users => {
                setKeyAccountManagers(users.filter(u => u.role === "Key Account Manager"));
            })
            .catch(console.error);
    }, []);

    const handleSubmit = () => {
        navigate(-1);
    };
    const handleCancel = () => setForm({ ...INITIAL_VESSEL_STATE });

    /** Update a top-level field */
    const setField = <K extends keyof VesselFormState>(
        key: K,
        value: VesselFormState[K],
    ) => setForm((prev) => ({ ...prev, [key]: value }));

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
                            background:
                                "linear-gradient(135deg, #C62828 0%, #EF5350 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <DirectionsBoatFilledOutlined
                            sx={{ color: "#fff", fontSize: 26 }}
                        />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Create Vessel
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                    <Button variant="outlined" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        Save
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
                                defaultCountry=""
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
        </Stack>
    );
}