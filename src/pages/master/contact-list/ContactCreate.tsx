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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

import { styled } from "@mui/material/styles";
import { createContact } from "./services/contact.service";
import type { CreateContactRequest } from "./types/contact.types";
import { forwardRef } from "react";
import PhoneInput, { getCountries } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import type { Value } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

const SECTION_HEADER_SX = {
    py: 0.5,
    px: 2,
    display: "flex",
    alignItems: "center",
    backgroundColor: "#373737ff",
    color: "white",
    borderRadius: 1,
} as const;

const PhoneInputField = forwardRef<HTMLInputElement, any>((props, ref) => (
    <TextField label="Telephone" {...props} inputRef={ref} />
));
PhoneInputField.displayName = "PhoneInputField";

// ─────────────────────────────────────────────────────────────────
// Form shape. Mirrors CreateContactRequest, but every field defaults
// to "" (or false) instead of undefined so inputs stay controlled.
// ─────────────────────────────────────────────────────────────────
interface FormState {
    groupId: string;
    description: string;
    companyName: string;
    initial: string;
    email: string;
    phone: string;
    faxNo: string;
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
    oppManager: string;
    bankDetails: string;
    clientHubs: string;

    personIncharge: { name: string; email: string; phone: string; faxNo: string };

    accountingDetails: {
        name: string;
        email: string;
        phone: string;
        faxNo: string;
        country: string;
        creditLimit: string;
        paymentTerms: string;
        currency: string;
        billingAddress: string;
        specialInstructions: string;
        useBillingCurrency: boolean;
    };

}

const INITIAL_FORM_STATE: FormState = {
    groupId: "Client",
    description: "",
    companyName: "",
    initial: "",
    email: "",
    phone: "",
    faxNo: "",
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
    oppManager: "",
    bankDetails: "",
    clientHubs: "",
    personIncharge: { name: "", email: "", phone: "", faxNo: "" },
    accountingDetails: {
        name: "",
        email: "",
        phone: "",
        faxNo: "",
        country: "",
        creditLimit: "",
        useBillingCurrency: false,
        paymentTerms: "",
        currency: "",
        billingAddress: "",
        specialInstructions: "",
    },
};

// ─────────────────────────────────────────────────────────────────
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
    showUpload: boolean;
    personInchargeStandalone: boolean;
    hasAccounting: boolean;
    accountingVariant?: "client" | "standard";
    hasExtraColumn: boolean; // Client-only: key account manager / bank detail / client hubs
    contactRows: FieldConfig[][];
}

const PERSON_INCHARGE_ROWS: FieldConfig[][] = [
    [
        { key: "personIncharge.name", label: "Name", required: true },
        { key: "personIncharge.email", type: "email", label: "Email", required: true },
    ],
    [
        { key: "personIncharge.phone", label: "Phone", type: "tel", required: true },
        { key: "personIncharge.faxNo", label: "Fax No" },
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
        { key: "accountingDetails.faxNo", label: "Fax No" },
    ],
    [
        { key: "accountingDetails.country", label: "Country" },
        { key: "accountingDetails.paymentTerms", label: "Payment Terms", required: true },
    ],
    [{ key: "accountingDetails.currency", label: "Currency", required: true, size: "small" }],
    [{ key: "accountingDetails.billingAddress", label: "Billing Address", multiline: true, rows: 2 }],
    [{ key: "accountingDetails.specialInstructions", label: "Special Instructions", multiline: true, rows: 2 }],
];

const ACCOUNTING_ROWS_CLIENT: FieldConfig[][] = [
    [
        { key: "accountingDetails.name", label: "Name", required: true },
        { key: "accountingDetails.email", label: "Email" },
    ],
    [
        { key: "accountingDetails.phone", label: "Phone", type: "tel", required: true },
        { key: "accountingDetails.faxNo", label: "Fax No" },
    ],
    [
        { key: "accountingDetails.country", label: "Country" },
        { key: "accountingDetails.creditLimit", label: "Credit Limit", required: true },
    ],
    [
        { key: "accountingDetails.paymentTerms", label: "Payment Terms", required: true, size: "small" },
        { key: "accountingDetails.currency", label: "Currency", required: true, size: "small" },
    ],
    [{ key: "accountingDetails.billingAddress", label: "Billing Address", multiline: true, rows: 2 }],
    [{ key: "accountingDetails.specialInstructions", label: "Special Instructions", multiline: true, rows: 2 }],
];

const GROUP_CONFIGS: Record<string, GroupConfig> = {
    Client: {
        showUpload: true,
        personInchargeStandalone: true,
        hasAccounting: true,
        accountingVariant: "client",
        hasExtraColumn: true,
        contactRows: [
            [{ key: "companyName", label: "Company Name", required: true }],
            [
                { key: "initial", label: "Initial", required: true },
                { key: "email", label: "Email", type: "email", required: true },
            ],
            [
                { key: "phone", label: "Phone", type: "tel", required: true },
                { key: "faxNo", label: "Fax No" },
            ],
            [
                { key: "city", label: "City", required: true },
                { key: "country", label: "Country", required: true },
            ],
            [{ key: "address", label: "Address", required: true, multiline: true, rows: 3 }],
            [
                { key: "postalCode", label: "Postal Code" },
                { key: "vatNo", label: "Vat No" },
            ],
        ],
    },
    Hub: {
        showUpload: true,
        personInchargeStandalone: false,
        hasAccounting: true,
        accountingVariant: "standard",
        hasExtraColumn: false,
        contactRows: [
            [{ key: "companyName", label: "Company Name", required: true }],
            [
                { key: "stationCode", label: "Station Code", required: true },
                { key: "email", label: "Email", type: "email", required: true },
            ],
            [
                { key: "phone", label: "Phone", type: "tel", required: true },
                { key: "faxNo", label: "Fax No" },
            ],
            [
                { key: "eoriUiseNo", label: "EORI / UISE No." },
                { key: "country", label: "Country", required: true },
                { key: "city", label: "City", required: true },
            ],
            [{ key: "notifyParty", label: "Notify Party", required: true, multiline: true, rows: 1 }],
            [{ key: "address", label: "Address", required: true, multiline: true, rows: 3 }],
            [
                { key: "postalCode", label: "Postal Code" },
                { key: "vatNo", label: "Vat No" },
            ],
        ],
    },
    // TTS Agent, Sub Agent, Sub Agent Onboard, Sub Agent Export share the same
    // field layout in the original file (Notify Party + Airport Code together),
    // differing only in whether the upload button is shown.
    "TTS Agent": buildAgentConfig(true),
    "Sub Agent": buildAgentConfig(false),
    "Sub Agent Onboard": buildAgentConfig(false),
    "Sub Agent Export": buildAgentConfig(false),
    "Owners Agent": {
        showUpload: false,
        personInchargeStandalone: false,
        hasAccounting: false,
        hasExtraColumn: false,
        contactRows: [
            [{ key: "companyName", label: "Company Name", required: true }],
            [
                { key: "email", label: "Email", type: "email", required: true },
                { key: "phone", label: "Phone", type: "tel", required: true },
            ],
            [
                { key: "faxNo", label: "Fax No" },
                { key: "eoriUiseNo", label: "EORI / UISE No." },
            ],
            [
                { key: "country", label: "Country", required: true },
                { key: "city", label: "City", required: true },
            ],
            [
                { key: "notifyParty", label: "Notify Party", required: true, multiline: true, rows: 1 },
                { key: "airportCode", label: "Airport Code", required: true },
            ],
            [{ key: "address", label: "Address", required: true, multiline: true, rows: 3 }],
            [
                { key: "postalCode", label: "Postal Code" },
                { key: "vatNo", label: "Vat No" },
            ],
        ],
    },
    Supplier: {
        showUpload: true,
        personInchargeStandalone: false,
        hasAccounting: false,
        hasExtraColumn: false,
        contactRows: [
            [{ key: "companyName", label: "Company Name", required: true }],
            [
                { key: "email", label: "Email", type: "email", required: true },
                { key: "phone", label: "Phone", type: "tel", required: true },
            ],
            [
                { key: "faxNo", label: "Fax No" },
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
            [{ key: "notifyParty", label: "Notify Party", required: true, multiline: true, rows: 1 }],
        ],
    },
};

function buildAgentConfig(showUpload: boolean): GroupConfig {
    return {
        showUpload,
        personInchargeStandalone: false,
        hasAccounting: true,
        accountingVariant: "standard",
        hasExtraColumn: false,
        contactRows: [
            [{ key: "companyName", label: "Company Name", required: true }],
            [
                { key: "stationCode", label: "Station Code", required: true },
                { key: "email", label: "Email", type: "email", required: true },
            ],
            [
                { key: "phone", label: "Phone", type: "tel", required: true },
                { key: "faxNo", label: "Fax No" },
            ],
            [
                { key: "eoriUiseNo", label: "EORI / UISE No." },
                { key: "country", label: "Country", required: true },
                { key: "city", label: "City", required: true },
            ],
            [
                { key: "notifyParty", label: "Notify Party", required: true, multiline: true, rows: 1 },
                { key: "airportCode", label: "Airport Code", required: true },
            ],
            [{ key: "address", label: "Address", required: true, multiline: true, rows: 3 }],
            [
                { key: "postalCode", label: "Postal Code" },
                { key: "vatNo", label: "Vat No" },
            ],
        ],
    };
}

// ─────────────────────────────────────────────────────────────────
// Path-based get/set for the nested FormState (personIncharge.*,
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
    return {
        ...data,
        [parent]: { ...(data as Record<string, unknown>)[parent] as object, [child]: value },
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
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

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
                description: formData.description,
                companyName: formData.companyName,
                initial: formData.initial,
                email: formData.email,
                phone: formData.phone,
                faxNo: formData.faxNo,
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
                oppManager: formData.oppManager,
                bankDetails: formData.bankDetails,
                clientHubs: formData.clientHubs,
                personIncharge: formData.personIncharge,
                accountingDetails: formData.accountingDetails,
            };
            await createContact(payload, uploadedFiles);
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
        setUploadedFiles([]);
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
                        defaultCountry=""
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
                        <Typography variant="subtitle2">{section.title}</Typography>
                    </Box>
                )}
                {renderRows(section.rows)}
            </>
        );
        if (section.standalonePaper) {
            return (
                <Box key={key} component={Paper} sx={{ py: 2, px: 2, gap: 1.5, display: "flex", flexDirection: "column" }}>
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

    const renderUploadButton = () => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                    component="label"
                    role={undefined}
                    variant={uploadedFiles.length > 0 ? "outlined" : "contained"}
                    tabIndex={-1}
                    startIcon={uploadedFiles.length > 0 ? <CheckCircleIcon color="success" /> : <CloudUploadIcon />}
                    color={uploadedFiles.length > 0 ? "success" : "primary"}
                    sx={{ flexShrink: 0 }}
                >
                    {uploadedFiles.length > 0 ? "Add more files" : "Upload files"}
                    <VisuallyHiddenInput
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,application/pdf"
                        onChange={(event) => {
                            const newFiles = Array.from(event.target.files ?? []);
                            setUploadedFiles((prev) => [...prev, ...newFiles]);
                            event.target.value = "";
                        }}
                    />
                </Button>
                {uploadedFiles.length > 0 && (
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {uploadedFiles.length} file{uploadedFiles.length > 1 ? "s" : ""} selected
                    </Typography>
                )}
            </Box>
            {uploadedFiles.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {uploadedFiles.map((file, idx) => (
                        <Tooltip key={idx} title={file.name}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    px: 1,
                                    py: 0.25,
                                    borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: 'success.light',
                                    bgcolor: 'rgba(46,125,50,0.06)',
                                    maxWidth: 180,
                                }}
                            >
                                <InsertDriveFileIcon sx={{ fontSize: 13, color: 'success.main', flexShrink: 0 }} />
                                <Typography
                                    variant="caption"
                                    sx={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        color: 'success.main',
                                        fontWeight: 500,
                                    }}
                                >
                                    {file.name}
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={() => setUploadedFiles((prev) => prev.filter((_, i) => i !== idx))}
                                    sx={{ p: 0.15, ml: 0.25, flexShrink: 0 }}
                                >
                                    <Typography variant="caption" sx={{ lineHeight: 1, color: 'text.secondary', fontSize: 10 }}>✕</Typography>
                                </IconButton>
                            </Box>
                        </Tooltip>
                    ))}
                </Box>
            )}
        </Box>
    );

    const renderColumn1 = (config: GroupConfig) => (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: "1 1 330px" }}>
            <Box component={Paper} sx={{ flex: 1, py: 2, px: 2, gap: 1, display: "flex", flexDirection: "column" }}>
                {renderRows(config.contactRows)}
                {config.showUpload && renderUploadButton()}
                {!config.personInchargeStandalone &&
                    renderSection({ title: "Person in charge", rows: PERSON_INCHARGE_ROWS }, "person-incharge")}
            </Box>
            {config.personInchargeStandalone &&
                renderSection(
                    { title: "Person in charge", rows: PERSON_INCHARGE_ROWS, standalonePaper: true },
                    "person-incharge",
                )}
        </Box>
    );

    const renderColumn2 = (config: GroupConfig) => {
        if (!config.hasAccounting) {
            return (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: "1 1 330px" }}>
                    {renderSection(
                        { title: "Multiple Email", rows: MULTIPLE_EMAIL_ROWS, standalonePaper: true },
                        "multi-email",
                    )}
                </Box>
            );
        }
        const accountingRows = config.accountingVariant === "client" ? ACCOUNTING_ROWS_CLIENT : ACCOUNTING_ROWS_STANDARD;
        return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: "1 1 330px" }}>
                <Box component={Paper} sx={{ flex: 1, py: 2, px: 2, gap: 1.5, display: "flex", flexDirection: "column" }}>
                    <Box sx={SECTION_HEADER_SX}>
                        <Typography variant="subtitle2">Accounting details</Typography>
                    </Box>
                    {renderRows(accountingRows)}
                    {config.accountingVariant === "client" &&
                        renderField({
                            key: "accountingDetails.useBillingCurrency",
                            label: "Use billing currency",
                            type: "checkbox",
                        })}
                    {renderSection(
                        { title: "Multiple Email", rows: MULTIPLE_EMAIL_ROWS, standalonePaper: true },
                        "multi-email",
                    )}
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
                        {Object.keys(GROUP_CONFIGS).map((group) => (
                            <MenuItem key={group} value={group}>
                                {group}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Description"
                        value={formData.description}
                        onChange={(event) => updateField("description", event.target.value)}
                    />
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