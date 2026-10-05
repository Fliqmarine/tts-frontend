import { forwardRef, useEffect, useState } from "react";
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    MenuItem,
    Paper,
    TextField,
    Typography,
    type TextFieldProps,
} from "@mui/material";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import type { Value } from "react-phone-number-input";
import {
    INITIAL_VESSEL_STATE,
    type PersonInfo,
    type VesselFormState,
} from "../types/vessel.types";
import { getUsers } from "../../users/services/user.service";
import type { User } from "../../users/types/user.types";

interface VesselDialogProps {
    open: boolean;
    onClose: () => void;
    onSaved: (vessel: VesselFormState) => void;
    initialValues: VesselFormState | null;
}

const PhoneInputField = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => (
    <TextField size="small" label="Telephone" fullWidth {...props} inputRef={ref} />
));
PhoneInputField.displayName = "PhoneInputField";

const GAP = 1.5;
const twoColumns = {
    display: "grid",
    gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" },
    gap: GAP,
};

function createInitialFormState(initialValues: VesselFormState | null): VesselFormState {
    return initialValues
        ? {
              ...INITIAL_VESSEL_STATE,
              ...initialValues,
              clientPic: { ...INITIAL_VESSEL_STATE.clientPic, ...initialValues.clientPic },
              supt: { ...INITIAL_VESSEL_STATE.supt, ...initialValues.supt },
          }
        : {
              ...INITIAL_VESSEL_STATE,
              clientPic: { ...INITIAL_VESSEL_STATE.clientPic },
              supt: { ...INITIAL_VESSEL_STATE.supt },
          };
}

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <Paper
            variant="outlined"
            sx={{ p: 2, display: "flex", flexDirection: "column", gap: GAP, minWidth: 0 }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    pb: 1,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Box
                    sx={{
                        width: 3,
                        height: 16,
                        borderRadius: 1,
                        bgcolor: "primary.main",
                        flexShrink: 0,
                    }}
                />
                <Typography variant="subtitle2" color="primary.main" fontWeight={700}>
                    {title}
                </Typography>
            </Box>
            {children}
        </Paper>
    );
}

function PersonSection({
    title,
    labelPrefix,
    person,
    onChange,
}: {
    title: string;
    labelPrefix: string;
    person: PersonInfo;
    onChange: (person: PersonInfo) => void;
}) {
    return (
        <Section title={title}>
            <TextField
                size="small"
                label={`${labelPrefix} Name`}
                value={person.name}
                onChange={(event) => onChange({ ...person, name: event.target.value })}
                fullWidth
                required
            />
            <TextField
                size="small"
                label={`${labelPrefix} Email`}
                type="email"
                value={person.email}
                onChange={(event) => onChange({ ...person, email: event.target.value })}
                fullWidth
                required
            />
            <Box sx={{ minWidth: 0, "& .PhoneInputCountry": { mr: 1 } }}>
                <PhoneInput
                    international
                    value={person.telephone as Value}
                    onChange={(telephone) => onChange({ ...person, telephone: telephone || "" })}
                    inputComponent={PhoneInputField}
                    required
                    style={{ display: "flex", width: "100%" }}
                />
            </Box>
        </Section>
    );
}

export default function VesselDialog({ open, onClose, onSaved, initialValues }: VesselDialogProps) {
    const [form, setForm] = useState<VesselFormState>(() => createInitialFormState(initialValues));
    const [keyAccountManagers, setKeyAccountManagers] = useState<User[]>([]);
    // const [managerError, setManagerError] = useState("");

    useEffect(() => {
        if (!open) return;

        getUsers()
            .then((users) => {
                setKeyAccountManagers(users.filter((user) => user.role === "Key Account Manager"));
            })
            .catch(() => {
                // setManagerError("Could not load Key Account Managers. Please close and reopen the form to retry.");
            });
    }, [open]);

    const setField = <K extends keyof VesselFormState>(
        key: K,
        value: VesselFormState[K],
    ) => {
        setForm((current) => ({ ...current, [key]: value }));
    };

    const handleClose = () => {
        onClose();
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSaved(form);
        handleClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            
            maxWidth="xl"
            scroll="paper"
            sx={{
                "& .MuiDialog-paper": {
                    height: { xs: "calc(100dvh - 16px)", sm: "min(58.5vh, 900px)" },
                    width: { xs: "calc(100% - 16px)", sm: "calc(70% - 64px)" },
                },
            }}
        >
            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <DialogTitle
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        py: 2,
                        px: { xs: 2, sm: 3 },
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                    }}
                >
                    <Typography variant="h6" component="span" sx={{ fontWeight: 600, flexGrow: 1 }}>
                        {initialValues ? "Edit Vessel" : "Create Vessel"}
                    </Typography>
                    <Button variant="outlined" color="inherit" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ bgcolor: "background.paper", color: "primary.main" }}
                    >
                        Save
                    </Button>
                </DialogTitle>

                <DialogContent>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "minmax(0, 1fr)",
                                md: "repeat(2, minmax(0, 1fr))",
                            },
                            gap: GAP,
                            alignItems: "start",
                            justifyContent: "center",
                            mt: "10px",
                        }}
                    >
                        <Box sx={{ display: "flex", flexDirection: "column", gap: GAP, minWidth: 0 }}>
                            <Section title="Vessel Details">
                                <Box sx={twoColumns}>
                                    <TextField
                                        size="small"
                                        label="Client Name"
                                        value={form.clientName}
                                        onChange={(event) => setField("clientName", event.target.value)}
                                        fullWidth
                                    />
                                    <TextField
                                        size="small"
                                        label="Vessel name"
                                        value={form.vesselName}
                                        onChange={(event) => setField("vesselName", event.target.value)}
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        size="small"
                                        label="IMO No"
                                        value={form.imoNo}
                                        onChange={(event) => setField("imoNo", event.target.value)}
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        size="small"
                                        label="Vessel flag"
                                        value={form.vesselFlag}
                                        onChange={(event) => setField("vesselFlag", event.target.value)}
                                        fullWidth
                                    />
                                    <TextField
                                        size="small"
                                        label="Build Year"
                                        type="number"
                                        value={form.buildYear}
                                        onChange={(event) => setField("buildYear", event.target.value)}
                                        fullWidth
                                        required
                                    />
                                    <TextField
                                        size="small"
                                        label="Budget"
                                        type="number"
                                        value={form.budget}
                                        onChange={(event) => setField("budget", event.target.value)}
                                        fullWidth
                                    />
                                    <TextField
                                        size="small"
                                        select
                                        label="Vessel type"
                                        value={form.vesselType}
                                        onChange={(event) => setField("vesselType", event.target.value)}
                                        fullWidth
                                    >
                                        <MenuItem value="M/V">M/V</MenuItem>
                                        <MenuItem value="M/T">M/T</MenuItem>
                                    </TextField>
                                    <TextField
                                        size="small"
                                        select
                                        label="Key Account Manager"
                                        value={form.keyAccountManager}
                                        onChange={(event) => setField("keyAccountManager", event.target.value)}
                                        fullWidth
                                        required
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
                            </Section>

                            <Section title="Invoice Info">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={form.billingAddressSameAsAddress}
                                            onChange={(event) =>
                                                setField("billingAddressSameAsAddress", event.target.checked)
                                            }
                                        />
                                    }
                                    label="Billing address same as vessel address"
                                />
                                <TextField
                                    size="small"
                                    label="Billing address"
                                    value={form.billingAddress}
                                    onChange={(event) => setField("billingAddress", event.target.value)}
                                    disabled={form.billingAddressSameAsAddress}
                                    fullWidth
                                    required={!form.billingAddressSameAsAddress}
                                    multiline
                                    minRows={2}
                                />
                            </Section>
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: GAP, minWidth: 0 }}>
                            <PersonSection
                                title="Vessel Coordinator Incharge"
                                labelPrefix="Client PIC"
                                person={form.clientPic}
                                onChange={(person) => setField("clientPic", person)}
                            />
                            <PersonSection
                                title="Vessel Manager Info"
                                labelPrefix="Supt"
                                person={form.supt}
                                onChange={(person) => setField("supt", person)}
                            />
                        </Box>
                    </Box>
                </DialogContent>
            </Box>
        </Dialog>
    );
}