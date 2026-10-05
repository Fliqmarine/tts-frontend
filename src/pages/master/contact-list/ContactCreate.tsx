import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    MenuItem,
    Paper,
    Snackbar,
    Alert,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { createContact } from "./services/contact.service";
import type { CreateContactRequest } from "./types/contact.types";
import { forwardRef } from "react";
import PhoneInput, { getCountries } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import type { Value } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";
import type { TextFieldProps } from "@mui/material";

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
// Form shape. Mirrors CreateContactRequest, but every field defaults
// to "" (or false) instead of undefined so inputs stay controlled.
// ─────────────────────────────────────────────────────────────────
interface FormState {
    groupId: string;
    //description: string;
    companyName: string;
    //initial: string;
    //email: string;
    //phone: string;
    //faxNo: string;
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
    keyAccountManager: string;
    bankDetails: string;
    //clientHubs: string;

    coordinatorInCharge: { name: string; email: string; phone: string; };

    accountingDetails: {
        name: string;
        email: string;
        phone: string;
        //faxNo: string;
        country: string;
        creditLimit: string;
        paymentTerms: string;
        currency: string;
        billingAddress: string;
        specialInstructions: string;
        //useBillingCurrency: boolean;
    };

}

const INITIAL_FORM_STATE: FormState = {
    groupId: "TTS Agent",
    //description: "",
    companyName: "",
    //initial: "",
    //email: "",
    //phone: "",
    //faxNo: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    vatNo: "",
    stationCode: "",
    eoriUiseNo: "",
    notifyParty: "",
    airportCode: "",
    multipleEmail: "",
    keyAccountManager: "",
    bankDetails: "",
    //clientHubs: "",
    coordinatorInCharge: { name: "", email: "", phone: "", },
    accountingDetails: {
        name: "",
        email: "",
        phone: "",
        //faxNo: "",
        country: "",
        creditLimit: "",
       // useBillingCurrency: false,
        paymentTerms: "",
        currency: "",
        billingAddress: "",
        specialInstructions: "",
    },
};

// Field/section config — this is the data that used to be 2000+
// lines of repeated JSX. "key" is a dot-path into FormState.
// ─────────────────────────────────────────────────────────────────
type FieldType = "text" | "email" | "tel" | "checkbox";

interface FieldConfig {
    key: string;
    label: string;
    type?: FieldType;
    required?: boolean;
    multiline?: boolean;
    rows?: number;
    size?: "small";
}

interface SectionConfig {
    title?: string;
    standalonePaper?: boolean;
    rows: FieldConfig[][];
}

interface GroupConfig {
    coordinatorInChargeStandalone: boolean;
    hasAccounting: boolean;
    accountingVariant?: "standard";
    hasExtraColumn: boolean; // Client-only: key account manager / bank detail / client hubs
    contactRows: FieldConfig[][];
}

const COORDINATOR_IN_CHARGE_ROWS: FieldConfig[][] = [
    [
        { key: "coordinatorInCharge.name", label: "Name", required: true },
    ],
    [
        { key: "coordinatorInCharge.email", type: "email", label: "Email", required: true },
        { key: "coordinatorInCharge.phone", label: "Phone", type: "tel", required: true },
       // { key: "coordinatorInCharge.faxNo", label: "Fax No" },
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

const GROUP_CONFIGS: Record<string, GroupConfig> = {
    // TTS Agent, Sub Agent, Sub Agent Onboard, and Sub Agent Export share a field layout.
    "TTS Agent": buildAgentConfig(),
    "Sub Agent": buildAgentConfig(),
    "Sub Agent Onboard": buildAgentConfig(),
    "Sub Agent Export": buildAgentConfig(),
    "Owners Agent": {
        coordinatorInChargeStandalone: true,
        hasAccounting: false,
        hasExtraColumn: false,
        contactRows: [
            [{ key: "companyName", label: "Company Name", required: true }],
            // [
            //     { key: "email", label: "Email", type: "email", required: true },
            //     { key: "phone", label: "Phone", type: "tel", required: true },
            // ],
            [
                //{ key: "faxNo", label: "Fax No" },
                { key: "eoriUiseNo", label: "EORI / UISE No." },
            ],
            [
                { key: "country", label: "Country", required: true },
                { key: "city", label: "City", required: true },
            ],
            [
                { key: "airportCode", label: "Airport Code", required: true },
            ],
            [   { key: "address", label: "Address", required: true, multiline: true, rows: 3 }],
           
            [   { key: "notifyParty", label: "Notify Party", multiline: true, rows: 3 },],
            
            [
                { key: "postalCode", label: "Postal Code" },
                { key: "vatNo", label: "Vat No" },
            ],
        ],
    },
    Supplier: {
        coordinatorInChargeStandalone: true,
        hasAccounting: false,
        hasExtraColumn: false,
        contactRows: [
            [{ key: "companyName", label: "Company Name", required: true }],
            // [
            //     { key: "email", label: "Email", type: "email", required: true },
            //     { key: "phone", label: "Phone", type: "tel", required: true },
            // ],
            [
               // { key: "faxNo", label: "Fax No" },
                { key: "eoriUiseNo", label: "EORI / UISE No." },
            ],
            [
                { key: "country", label: "Country", required: true },
                { key: "city", label: "City", required: true },
            ],
            [{ key: "address", label: "Address", required: true, multiline: true, rows: 3 }],
            [
                { key: "postalCode", label: "Postal Code" },
                { key: "vatNo", label: "Vat No" },
            ],
              [{ key: "notifyParty", label: "Notify Party",  multiline: true, rows: 3 }],
        ],
    },
};

function buildAgentConfig(): GroupConfig {
    return {
        coordinatorInChargeStandalone: false,
        hasAccounting: true,
        accountingVariant: "standard",
        hasExtraColumn: false,
        contactRows: [
            [{ key: "companyName", label: "Company Name", required: true }],
            [
                { key: "eoriUiseNo", label: "EORI / UISE No." },
            ],
            // [
            //     { key: "phone", label: "Phone", type: "tel", required: true },
            //     { key: "faxNo", label: "Fax No" },
            // ],
            [
                
                { key: "country", label: "Country", required: true },
                { key: "city", label: "City", required: true },
            ],
            [
                { key: "airportCode", label: "Airport Code", required: true },
                { key: "stationCode", label: "Station Code", required: true },
            ],
            [   { key: "address", label: "Address", required: true, multiline: true, rows: 3 }],
            [   { key: "notifyParty", label: "Notify Party", multiline: true, rows: 3 },],

            [
                { key: "postalCode", label: "Postal Code" },
                { key: "vatNo", label: "Vat No" },
            ],
        ],
    };
}

// ─────────────────────────────────────────────────────────────────
// Path-based get/set for the nested FormState (coordinatorIncharge.*,
// accountingDetails.*). Plain loops, no lodash/fluent chains.
// ─────────────────────────────────────────────────────────────────
function getValue(data: FormState, path: string): string | boolean {
    const parts = path.split(".");
    let value: unknown = data;
    for (const part of parts) {
        value = (value as Record<string, unknown>)?.[part];
    }
    return (value as string | boolean) ?? "";
}

function setValue(data: FormState, path: string, value: string | boolean): FormState {
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

export default function CreateContactPage() {
    const navigate = useNavigate();

    const [isSaving, setIsSaving] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });
    const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE);

    const updateField = (path: string, value: string | boolean) => {
        setFormData((prev) => setValue(prev, path, value));
    };

    const groupConfig = formData.groupId ? GROUP_CONFIGS[formData.groupId] : undefined;

    const handleSubmit = async () => {
        if (!formData.groupId || !formData.companyName || !formData.email || !formData.phone) {
            setSnackbar({
                open: true,
                message: "Please fill in all required fields (Group, Company Name, Email, Phone).",
                severity: "error",
            });
            return;
        }

        setIsSaving(true);
        try {
            const payload: CreateContactRequest = {
                groupId: formData.groupId as CreateContactRequest["groupId"],
               // description: formData.description,
                companyName: formData.companyName,
               // initial: formData.initial,
               // email: formData.email,
               // phone: formData.phone,
              //  faxNo: formData.faxNo,
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
                keyAccountManager: formData.keyAccountManager,
                bankDetails: formData.bankDetails,
               // clientHubs: formData.clientHubs,
                coordinatorInCharge: formData.coordinatorInCharge,
                accountingDetails: formData.accountingDetails,
            };
            await createContact(payload);
            setSnackbar({ open: true, message: "Contact saved successfully!", severity: "success" });
            setTimeout(() => navigate(-1), 1200);
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                "Failed to save contact. Please try again.";
            setSnackbar({ open: true, message: msg, severity: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData(INITIAL_FORM_STATE);
    };

    // ── Field / section renderers ──────────────────────────────
    const renderField = (field: FieldConfig) => {
        if (field.type === "checkbox") {
            return (
                <FormControlLabel
                    key={field.key}
                    control={
                        <Checkbox
                            size="small"
                            checked={Boolean(getValue(formData, field.key))}
                            onChange={(event) => updateField(field.key, event.target.checked)}
                        />
                    }
                    label={field.label}
                    sx={{ whiteSpace: "nowrap" }}
                />
            );
        }
        if (field.type === "tel") {
            return (
                <Box key={field.key} sx={{ flex: 1, display: 'flex', alignItems: 'center', '& .PhoneInputCountry': { mr: 1 } }}>
                    <PhoneInput
                        international
                        value={getValue(formData, field.key) as Value}
                        onChange={(val) => updateField(field.key, val || "")}
                        inputComponent={PhoneInputField}
                        required={field.required}
                        style={{ flex: 1, width: '100%' }}
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
                size={field.size}
                sx={field.size ? undefined : { flex: 1 }}
            />
        );
    };

    const renderRows = (rows: FieldConfig[][]) => {
        const boxes = [];
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const centerAlign = row.some((f) => f.size === "small");
            boxes.push(
                <Box key={i} sx={{ display: "flex", gap: 1, alignItems: centerAlign ? "center" : undefined }}>
                    {row.map((field) => renderField(field))}
                </Box>,
            );
        }
        return boxes;
    };

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

    const renderColumn2 = (config: GroupConfig) => {
        if (!config.hasAccounting) {
            return (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: "1 1 330px", }}>
                    {renderSection(
                        { title: "Multiple Email", rows: MULTIPLE_EMAIL_ROWS, standalonePaper: true },
                        "multi-email",
                    )}
                </Box>
            );
        }
        const accountingRows = ACCOUNTING_ROWS_STANDARD;
        return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: "1 1 330px" }}>
                <Box component={Paper} elevation={3} sx={{ flex: 1, py: 2, px: 2, gap: 1.5, display: "flex", flexDirection: "column", }}>
                    <Box sx={SECTION_HEADER_SX}>
                        <Box
                            sx={{
                                width: 4,
                                height: 18,
                                borderRadius: 1,
                                background: "linear-gradient(180deg, #5A73FF 0%, #3D5AFE 100%)",
                                flexShrink: 0,
                                
                            }}
                        />
                        <Typography variant="subtitle2" sx={{ color: "#3D5AFE", fontWeight: 700 }}>
                            Accounting details
                        </Typography>
                    </Box>
                    {renderRows(accountingRows)}
                </Box>
                <Box component={Paper} elevation={3} sx={{ flex: 1, py: 2, px: 2, gap: 1.5, display: "flex", flexDirection: "column", }}>
                    <Box sx={SECTION_HEADER_SX}>
                        <Box
                            sx={{
                                width: 4,
                                height: 18,
                                borderRadius: 1,
                                background: "linear-gradient(180deg, #5A73FF 0%, #3D5AFE 100%)",
                                flexShrink: 0,
                                
                            }}
                        />
                        <Typography variant="subtitle2" sx={{ color: "#3D5AFE", fontWeight: 700 }}>
                           Multiple Email
                        </Typography>
                    </Box>
                    {renderRows( MULTIPLE_EMAIL_ROWS )}
                        
                    
                </Box>
            </Box>
        );

    };

    const renderColumn3 = (config: GroupConfig) => {
        if (!config.hasExtraColumn) {
            return <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: "1 1 330px" }} />;
        }
        const sections: { key: string; section: SectionConfig }[] = [
            {
                key: "key-account-manager",
                section: {
                    title: "Key account manager",
                    standalonePaper: true,
                    rows: [[{ key: "oppManager", label: "Opp Manager", required: true }]],
                },
            },
            {
                key: "bank-detail",
                section: {
                    title: "Bank detail",
                    standalonePaper: true,
                    rows: [[{ key: "bankDetails", label: "Bank Details", required: true }]],
                },
            },
            {
                key: "client-hubs",
                section: {
                    title: "Client hubs",
                    standalonePaper: true,
                    rows: [[{ key: "clientHubs", label: "Client Hubs", required: true }]],
                },
            },
        ];
        return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: "1 1 330px" }}>
                {sections.map(({ key, section }) => renderSection(section, key))}
            </Box>
        );
    };

    return (
        <Stack spacing={2} sx={{ "& .MuiFormLabel-asterisk": { color: "red" } }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Create Contact
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "row", gap: 2, justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "center" }}>
                    <TextField
                        select
                        label="Group ID"
                        value={formData.groupId}
                        onChange={(event) => updateField("groupId", event.target.value)}
                        sx={{ width: 200 }}
                    >
                        {/* <MenuItem value="">Select a group</MenuItem> */}
                        {Object.keys(GROUP_CONFIGS).map((group) => (
                            <MenuItem key={group} value={group}>
                                {group}
                            </MenuItem>
                        ))}
                    </TextField>
                    {/* <TextField
                        label="Description"
                        value={formData.description}
                        onChange={(event) => updateField("description", event.target.value)}
                    /> */}
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "center" }}>
                    <Button variant="outlined" color="error" onClick={handleCancel} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
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
                    {renderColumn3(groupConfig)}
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