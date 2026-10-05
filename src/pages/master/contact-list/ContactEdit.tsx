import { useState, forwardRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    MenuItem,
    Paper,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import type { TextFieldProps } from "@mui/material";
import PhoneInput, { getCountries } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import type { Value } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";
import { loadDemoContacts, saveDemoContacts } from "./data/demoContacts";
import { GROUP_IDS, type Contact, type GroupId } from "./types/contact.types";

const SECTION_HEADER_SX = {
    display: "flex",
    alignItems: "center",
    gap: 1.2,
    width: "100%",
    pb: 1,
    mb: 1.5,
    borderBottom: "2px solid #7d7d7d",
} as const;

const PhoneInputField = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => (
    <TextField label="Telephone" {...props} inputRef={ref} />
));
PhoneInputField.displayName = "PhoneInputField";

// ─────────────────────────────────────────────────────────────────
// Form shape (same as the create page)
// ─────────────────────────────────────────────────────────────────
interface FormState {
    groupId: string;
    companyName: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    vatNo: string;
    stationCode: string;
    eoriUiseNo: string;
    notifyParty: string;
    airportCode: string;
    multipleEmail: string;

    coordinatorInCharge: { name: string; email: string; phone: string };

    accountingDetails: {
        name: string;
        email: string;
        phone: string;
        country: string;
        paymentTerms: string;
        currency: string;
        billingAddress: string;
        specialInstructions: string;
    };
}

// Edit-specific: build the initial form state from the stored contact
// instead of empty strings.
function contactToFormState(contact: Contact): FormState {
    return {
        groupId: contact.groupId ?? "",
        companyName: contact.companyName ?? "",
        address: contact.address ?? "",
        city: contact.city ?? "",
        country: contact.country ?? "",
        postalCode: contact.postalCode ?? "",
        vatNo: contact.vatNo ?? "",
        stationCode: contact.stationCode ?? "",
        eoriUiseNo: contact.eoriUiseNo ?? "",
        notifyParty: contact.notifyParty ?? "",
        airportCode: contact.airportCode ?? "",
        multipleEmail: contact.multipleEmail ?? "",
        coordinatorInCharge: {
            name: contact.coordinatorInCharge?.name ?? "",
            email: contact.coordinatorInCharge?.email ?? "",
            phone: contact.coordinatorInCharge?.phone ?? "",
        },
        accountingDetails: {
            name: contact.accountingDetails?.name ?? "",
            email: contact.accountingDetails?.email ?? "",
            phone: contact.accountingDetails?.phone ?? "",
            country: contact.accountingDetails?.country ?? "",
            paymentTerms: contact.accountingDetails?.paymentTerms ?? "",
            currency: contact.accountingDetails?.currency ?? "",
            billingAddress: contact.accountingDetails?.billingAddress ?? "",
            specialInstructions: contact.accountingDetails?.specialInstructions ?? "",
        },
    };
}

// ─────────────────────────────────────────────────────────────────
// Field/section config (same as the create page)
// ─────────────────────────────────────────────────────────────────
type FieldType = "text" | "email" | "tel";

interface FieldConfig {
    key: string;
    label: string;
    type?: FieldType;
    required?: boolean;
    multiline?: boolean;
    rows?: number;
}

interface SectionConfig {
    title?: string;
    standalonePaper?: boolean;
    rows: FieldConfig[][];
}

interface GroupConfig {
    hasAccounting: boolean;
    contactRows: FieldConfig[][];
}

const COORDINATOR_IN_CHARGE_ROWS: FieldConfig[][] = [
    [{ key: "coordinatorInCharge.name", label: "Name", required: true }],
    [
        { key: "coordinatorInCharge.email", type: "email", label: "Email", required: true },
        { key: "coordinatorInCharge.phone", label: "Phone", type: "tel", required: true },
    ],
];

const MULTIPLE_EMAIL_ROWS: FieldConfig[][] = [[{ key: "multipleEmail", label: "Email", type: "email" }]];

const ACCOUNTING_ROWS_STANDARD: FieldConfig[][] = [
    [
        { key: "accountingDetails.name", label: "Name", required: true },
        { key: "accountingDetails.email", label: "Email", type: "email", required: true },
    ],
    [
        { key: "accountingDetails.phone", label: "Phone", type: "tel", required: true },
        { key: "accountingDetails.country", label: "Country" },
    ],
    [
        { key: "accountingDetails.paymentTerms", label: "Payment Terms", required: true },
        { key: "accountingDetails.currency", label: "Currency", required: true },
    ],
    [{ key: "accountingDetails.billingAddress", label: "Billing Address", multiline: true, rows: 3.5 }],
    [{ key: "accountingDetails.specialInstructions", label: "Special Instructions", multiline: true, rows: 3.5 }],
];

function buildAgentConfig(): GroupConfig {
    return {
        hasAccounting: true,
        contactRows: [
            [{ key: "companyName", label: "Company Name", required: true }],
            [{ key: "eoriUiseNo", label: "EORI / UISE No." }],
            [
                { key: "country", label: "Country", required: true },
                { key: "city", label: "City", required: true },
            ],
            [
                { key: "airportCode", label: "Airport Code", required: true },
                { key: "stationCode", label: "Station Code", required: true },
            ],
            [{ key: "address", label: "Address", required: true, multiline: true, rows: 3 }],
            [{ key: "notifyParty", label: "Notify Party", multiline: true, rows: 3 }],
            [
                { key: "postalCode", label: "Postal Code" },
                { key: "vatNo", label: "Vat No" },
            ],
        ],
    };
}

const GROUP_CONFIGS: Record<string, GroupConfig> = {
    "TTS Agent": buildAgentConfig(),
    "Sub Agent": buildAgentConfig(),
    "Sub Agent Onboard": buildAgentConfig(),
    "Sub Agent Export": buildAgentConfig(),
    "Owners Agent": {
        hasAccounting: false,
        contactRows: [
            [{ key: "companyName", label: "Company Name", required: true }],
            [{ key: "eoriUiseNo", label: "EORI / UISE No." }],
            [
                { key: "country", label: "Country", required: true },
                { key: "city", label: "City", required: true },
            ],
            [{ key: "airportCode", label: "Airport Code", required: true }],
            [{ key: "address", label: "Address", required: true, multiline: true, rows: 3 }],
            [{ key: "notifyParty", label: "Notify Party", multiline: true, rows: 3 }],
            [
                { key: "postalCode", label: "Postal Code" },
                { key: "vatNo", label: "Vat No" },
            ],
        ],
    },
    Supplier: {
        hasAccounting: false,
        contactRows: [
            [{ key: "companyName", label: "Company Name", required: true }],
            [{ key: "eoriUiseNo", label: "EORI / UISE No." }],
            [
                { key: "country", label: "Country", required: true },
                { key: "city", label: "City", required: true },
            ],
            [{ key: "address", label: "Address", required: true, multiline: true, rows: 3 }],
            [
                { key: "postalCode", label: "Postal Code" },
                { key: "vatNo", label: "Vat No" },
            ],
            [{ key: "notifyParty", label: "Notify Party", multiline: true, rows: 3 }],
        ],
    },
};

// ─────────────────────────────────────────────────────────────────
// Path-based get/set for the nested FormState
// ─────────────────────────────────────────────────────────────────
function getValue(data: FormState, path: string): string {
    let value: unknown = data;
    for (const part of path.split(".")) {
        value = (value as Record<string, unknown>)?.[part];
    }
    return (value as string) ?? "";
}

function setValue(data: FormState, path: string, value: string): FormState {
    const parts = path.split(".");
    if (parts.length === 1) {
        return { ...data, [parts[0]]: value };
    }
    const [parent, child] = parts;
    const parentValue = (data as unknown as Record<string, unknown>)[parent];
    return {
        ...data,
        [parent]: { ...(parentValue as Record<string, unknown>), [child]: value },
    };
}

export default function ContactEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [initialContact] = useState(() => loadDemoContacts().find((contact) => contact.id === Number(id)));

    const [isSaving, setIsSaving] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });
    const [formData, setFormData] = useState<FormState>(() =>
        initialContact ? contactToFormState(initialContact) : ({} as FormState),
    );

    const updateField = (path: string, value: string) => {
        setFormData((prev) => setValue(prev, path, value));
    };

    const groupConfig = formData.groupId ? GROUP_CONFIGS[formData.groupId] : undefined;

    const handleUpdate = async () => {
        if (!formData.groupId || !formData.companyName) {
            setSnackbar({
                open: true,
                message: "Please fill in the group and company name.",
                severity: "error",
            });
            return;
        }

        setIsSaving(true);
        try {
            const contacts = loadDemoContacts();
            const existingContact = contacts.find((contact) => contact.id === Number(id));
            if (!existingContact) {
                throw new Error("Contact not found.");
            }

            const updatedContact: Contact = {
                ...existingContact,
                groupId: formData.groupId as GroupId,
                companyName: formData.companyName,
                address: formData.address,
                city: formData.city,
                country: formData.country,
                postalCode: formData.postalCode,
                vatNo: formData.vatNo,
                stationCode: formData.stationCode,
                eoriUiseNo: formData.eoriUiseNo,
                notifyParty: formData.notifyParty,
                airportCode: formData.airportCode,
                multipleEmail: formData.multipleEmail,
                coordinatorInCharge: formData.coordinatorInCharge,
                // Spread existing first so fields not shown on the form
                // (creditLimit, useBillingCurrency) are not wiped on save.
                accountingDetails: {
                    ...existingContact.accountingDetails,
                    ...formData.accountingDetails,
                },
                updatedAt: new Date().toISOString(),
            };

            saveDemoContacts(
                contacts.map((contact) => (contact.id === updatedContact.id ? updatedContact : contact)),
            );
            setSnackbar({ open: true, message: "Contact updated successfully!", severity: "success" });
            setTimeout(() => navigate(`/master/contact-list`), 1200);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to update contact.";
            setSnackbar({ open: true, message: msg, severity: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    // Cancel = discard changes and go back (create page resets, edit leaves)
    const handleCancel = () => navigate(-1);

    if (!initialContact) {
        return <Alert severity="error">Contact not found.</Alert>;
    }

    // ── Field / section renderers (same as the create page) ────
    const renderField = (field: FieldConfig) => {
        if (field.type === "tel") {
            return (
                <Box key={field.key} sx={{ flex: 1, display: "flex", alignItems: "center", "& .PhoneInputCountry": { mr: 1 } }}>
                    <PhoneInput
                        international
                        value={getValue(formData, field.key) as Value}
                        onChange={(val) => updateField(field.key, val || "")}
                        inputComponent={PhoneInputField}
                        required={field.required}
                        style={{ flex: 1, width: "100%" }}
                    />
                </Box>
            );
        }
        if (field.key === "country" || field.key.endsWith(".country")) {
            return (
                <TextField
                    select
                    key={field.key}
                    label={field.label}
                    value={getValue(formData, field.key)}
                    onChange={(event) => updateField(field.key, event.target.value)}
                    required={field.required}
                    fullWidth
                    sx={{ flex: 1 }}
                >
                    {getCountries().map((c) => (
                        <MenuItem key={c} value={c}>
                            {(en as Record<string, string>)[c] || c}
                        </MenuItem>
                    ))}
                </TextField>
            );
        }
        return (
            <TextField
                key={field.key}
                label={field.label}
                type={field.type}
                value={getValue(formData, field.key)}
                onChange={(event) => updateField(field.key, event.target.value)}
                required={field.required}
                fullWidth
                multiline={field.multiline}
                rows={field.rows}
                sx={{ flex: 1 }}
            />
        );
    };

    const renderRows = (rows: FieldConfig[][]) =>
        rows.map((row, i) => (
            <Box key={i} sx={{ display: "flex", gap: 1 }}>
                {row.map((field) => renderField(field))}
            </Box>
        ));

    const renderSection = (section: SectionConfig, key: string) => {
        const body = (
            <>
                {section.title && (
                    <Box sx={SECTION_HEADER_SX}>
                        <Box
                            sx={{
                                width: 4,
                                height: 18,
                                borderRadius: 1,
                                background: "linear-gradient(180deg, #5A73FF 0%, #3D5AFE 100%)",
                                mr: 1,
                                flexShrink: 0,
                            }}
                        />
                        <Typography variant="subtitle2" sx={{ color: "#3D5AFE", fontWeight: 700 }}>
                            {section.title}
                        </Typography>
                    </Box>
                )}
                {renderRows(section.rows)}
            </>
        );
        if (section.standalonePaper) {
            return (
                <Box key={key} component={Paper} elevation={3} sx={{ py: 2, px: 2, gap: 1.5, display: "flex", flexDirection: "column" }}>
                    {body}
                </Box>
            );
        }
        return (
            <Box key={key} sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 2 }}>
                {body}
            </Box>
        );
    };

    const renderColumn1 = (config: GroupConfig) => (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: "1 1 330px" }}>
            <Box component={Paper} elevation={3} sx={{ flex: 1, py: 2, px: 2, gap: 1, display: "flex", flexDirection: "column" }}>
                {renderRows(config.contactRows)}
            </Box>
            {renderSection(
                { title: "Coordinator In Charge", rows: COORDINATOR_IN_CHARGE_ROWS, standalonePaper: true },
                "coordinator-in-charge",
            )}
        </Box>
    );

    const renderColumn2 = (config: GroupConfig) => (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: "1 1 330px" }}>
            {config.hasAccounting &&
                renderSection(
                    { title: "Accounting details", rows: ACCOUNTING_ROWS_STANDARD, standalonePaper: true },
                    "accounting",
                )}
            {renderSection(
                { title: "Multiple Email", rows: MULTIPLE_EMAIL_ROWS, standalonePaper: true },
                "multi-email",
            )}
        </Box>
    );

    return (
        <Stack spacing={2} sx={{ "& .MuiFormLabel-asterisk": { color: "red" } }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Edit Contact
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "row", gap: 2, justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "center" }}>
                    <TextField
                        select
                        label="Group ID"
                        value={formData.groupId}
                        onChange={(event) => updateField("groupId", event.target.value)}
                        required
                        sx={{ width: 200 }}
                    >
                        {GROUP_IDS.map((group) => (
                            <MenuItem key={group} value={group}>
                                {group}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "center" }}>
                    <Button variant="outlined" color="error" onClick={handleCancel} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpdate}
                        disabled={isSaving}
                        startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                        {isSaving ? "Saving…" : "Save"}
                    </Button>
                </Box>
            </Box>

            {groupConfig && (
                <Box sx={{ display: "flex", flexDirection: "row", gap: 3, flexWrap: "wrap" }}>
                    {renderColumn1(groupConfig)}
                    {renderColumn2(groupConfig)}
                    <Box sx={{ flex: "1 1 330px" }} />
                </Box>
            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
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