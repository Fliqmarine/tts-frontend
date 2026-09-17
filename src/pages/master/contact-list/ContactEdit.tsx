import { useEffect, useState, forwardRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import { getContact, updateContact } from "./services/contact.service";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import type { Value } from "react-phone-number-input";

const PhoneInputField = forwardRef<HTMLInputElement, any>((props, ref) => (
    <TextField label="Phone" size="small" {...props} inputRef={ref} />
));
PhoneInputField.displayName = "PhoneInputField";

// Styled hidden file input 
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

// Reusable section header
function SectionHeader({ title }: { title: string }) {
    return (
        <Box
            sx={{
                py: 0.5,
                px: 2,
                display: "flex",
                alignItems: "center",
                backgroundColor: "#c62828",
                color: "white",
                borderRadius: 1,
            }}
        >
            <Typography variant="subtitle2">{title}</Typography>
        </Box>
    );
}

// Group options
const GROUP_OPTIONS = [
    "Client",
    "Hub",
    "TTS Agent",
    "Sub Agent",
    "Sub Agent Onboard",
    "Sub Agent Export",
    "Owners Agent",
    "Supplier",
];

//  Main component
export default function ContactEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // UI state
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error";
    }>({ open: false, message: "", severity: "success" });

    // Group / description
    const [groupId, setGroupId] = useState("");
    const [description, setDescription] = useState("");

    // Common
    const [companyName, setCompanyName] = useState("");
    const [stationCode, setStationCode] = useState("");
    const [eoriUiseNo, setEoriUiseNo] = useState("");
    const [notifyParty, setNotifyParty] = useState("");
    const [airportCode, setAirportCode] = useState("");
    const [initial, setInitial] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [faxNo, setFaxNo] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [vatNo, setVatNo] = useState("");

    // Person in charge
    const [personInchargeName, setPersonInchargeName] = useState("");
    const [personInchargeEmail, setPersonInchargeEmail] = useState("");
    const [personInchargePhone, setPersonInchargePhone] = useState("");
    const [personInchargeFaxNo, setPersonInchargeFaxNo] = useState("");

    // Accounting details
    const [accountingName, setAccountingName] = useState("");
    const [accountingEmail, setAccountingEmail] = useState("");
    const [accountingPhone, setAccountingPhone] = useState("");
    const [accountingFaxNo, setAccountingFaxNo] = useState("");
    const [accountingCountry, setAccountingCountry] = useState("");
    const [accountingCreditLimit, setAccountingCreditLimit] = useState("");
    const [accountingUseBillingCurrency, setAccountingUseBillingCurrency] = useState(false);
    const [accountingPaymentTerms, setAccountingPaymentTerms] = useState("");
    const [accountingCurrency, setAccountingCurrency] = useState("");
    const [accountingBillingAddress, setAccountingBillingAddress] = useState("");
    const [accountingSpecialInstructions, setAccountingSpecialInstructions] = useState("");

    // Other
    const [multipleEmail, setMultipleEmail] = useState("");
    const [oppManager, setOppManager] = useState("");
    const [bankDetails, setBankDetails] = useState("");
    const [clientHubs, setClientHubs] = useState("");

    //  Fetch existing contact on mount
    useEffect(() => {
        if (!id) return;
        const fetchContact = async () => {
            try {
                const data = await getContact(Number(id));

                // Populate all state from the fetched record
                setGroupId(data.groupId ?? "");
                setDescription(data.description ?? "");
                setCompanyName(data.companyName ?? "");
                setStationCode(data.stationCode ?? "");
                setEoriUiseNo(data.eoriUiseNo ?? "");
                setNotifyParty(data.notifyParty ?? "");
                setAirportCode(data.airportCode ?? "");
                setInitial(data.initial ?? "");
                setEmail(data.email ?? "");
                setPhone(data.phone ?? "");
                setAddress(data.address ?? "");
                setFaxNo(data.faxNo ?? "");
                setCity(data.city ?? "");
                setCountry(data.country ?? "");
                setPostalCode(data.postalCode ?? "");
                setVatNo(data.vatNo ?? "");
                setMultipleEmail(data.multipleEmail ?? "");
                setOppManager(data.oppManager ?? "");
                setBankDetails(data.bankDetails ?? "");
                setClientHubs(data.clientHubs ?? "");

                // Nested objects
                if (data.personIncharge) {
                    setPersonInchargeName(data.personIncharge.name ?? "");
                    setPersonInchargeEmail(data.personIncharge.email ?? "");
                    setPersonInchargePhone(data.personIncharge.phone ?? "");
                    setPersonInchargeFaxNo(data.personIncharge.faxNo ?? "");
                }
                if (data.accountingDetails) {
                    setAccountingName(data.accountingDetails.name ?? "");
                    setAccountingEmail(data.accountingDetails.email ?? "");
                    setAccountingPhone(data.accountingDetails.phone ?? "");
                    setAccountingFaxNo(data.accountingDetails.faxNo ?? "");
                    setAccountingCountry(data.accountingDetails.country ?? "");
                    setAccountingCreditLimit(data.accountingDetails.creditLimit ?? "");
                    setAccountingUseBillingCurrency(data.accountingDetails.useBillingCurrency ?? false);
                    setAccountingPaymentTerms(data.accountingDetails.paymentTerms ?? "");
                    setAccountingCurrency(data.accountingDetails.currency ?? "");
                    setAccountingBillingAddress(data.accountingDetails.billingAddress ?? "");
                    setAccountingSpecialInstructions(data.accountingDetails.specialInstructions ?? "");
                }
            } catch {
                setSnackbar({ open: true, message: "Failed to load contact data.", severity: "error" });
            } finally {
                setIsLoading(false);
            }
        };
        fetchContact();
    }, [id]);

    //  Update handler
    const handleUpdate = async () => {
        if (!groupId || !companyName || !email || !phone) {
            setSnackbar({
                open: true,
                message: "Please fill in all required fields (Group, Company Name, Email, Phone).",
                severity: "error",
            });
            return;
        }

        setIsSaving(true);
        try {
            await updateContact(
                Number(id),
                {
                    groupId,
                    description,
                    companyName,
                    initial,
                    email,
                    phone,
                    faxNo,
                    address,
                    city,
                    country,
                    postalCode,
                    vatNo,
                    stationCode,
                    eoriUiseNo,
                    notifyParty,
                    airportCode,
                    multipleEmail,
                    oppManager,
                    bankDetails,
                    clientHubs,
                    personIncharge: {
                        name: personInchargeName,
                        email: personInchargeEmail,
                        phone: personInchargePhone,
                        faxNo: personInchargeFaxNo,
                    },
                    accountingDetails: {
                        name: accountingName,
                        email: accountingEmail,
                        phone: accountingPhone,
                        faxNo: accountingFaxNo,
                        country: accountingCountry,
                        creditLimit: accountingCreditLimit,
                        useBillingCurrency: accountingUseBillingCurrency,
                        paymentTerms: accountingPaymentTerms,
                        currency: accountingCurrency,
                        billingAddress: accountingBillingAddress,
                        specialInstructions: accountingSpecialInstructions,
                    },
                },
                uploadedFiles,
            );
            setSnackbar({ open: true, message: "Contact updated successfully!", severity: "success" });
            setTimeout(() => navigate(-1), 1200);
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                "Failed to update contact. Please try again.";
            setSnackbar({ open: true, message: msg, severity: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => navigate(-1);

    //  Loading state
    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                <CircularProgress color="error" />
            </Box>
        );
    }

    //  Shared field groups (rendered per form type)
    const ContactDetailsFields = (
        <>
            <TextField
                size="small"
                label="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                fullWidth
                required
            />
            <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                    size="small"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                />
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', '& .PhoneInputCountry': { mr: 1 } }}>
                    <PhoneInput
                        international
                        defaultCountry="AE"
                        value={phone as Value}
                        onChange={(val) => setPhone(val || "")}
                        inputComponent={PhoneInputField}
                        label="Phone"
                        required
                        style={{ flex: 1, width: '100%' }}
                    />
                </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                    size="small"
                    label="Fax No"
                    value={faxNo}
                    onChange={(e) => setFaxNo(e.target.value)}
                    fullWidth
                />
                <TextField
                    size="small"
                    label="Station Code"
                    value={stationCode}
                    onChange={(e) => setStationCode(e.target.value)}
                    fullWidth
                />
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                    size="small"
                    label="EORI / UISE No."
                    value={eoriUiseNo}
                    onChange={(e) => setEoriUiseNo(e.target.value)}
                    fullWidth
                />
                <TextField
                    size="small"
                    label="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    fullWidth
                />
                <TextField
                    size="small"
                    label="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    fullWidth
                />
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                    size="small"
                    label="Notify Party"
                    value={notifyParty}
                    onChange={(e) => setNotifyParty(e.target.value)}
                    fullWidth
                />
                <TextField
                    size="small"
                    label="Airport Code"
                    value={airportCode}
                    onChange={(e) => setAirportCode(e.target.value)}
                    fullWidth
                />
            </Box>
            <TextField
                size="small"
                label="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
                multiline
                rows={3}
            />
            <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                    size="small"
                    label="Postal Code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    fullWidth
                />
                <TextField
                    size="small"
                    label="VAT No"
                    value={vatNo}
                    onChange={(e) => setVatNo(e.target.value)}
                    fullWidth
                />
            </Box>

            {/* File upload */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                        component="label"
                        variant={uploadedFiles.length > 0 ? "outlined" : "outlined"}
                        size="small"
                        startIcon={uploadedFiles.length > 0 ? <CheckCircleIcon color="success" /> : <CloudUploadIcon />}
                        color={uploadedFiles.length > 0 ? "success" : "primary"}
                    >
                        {uploadedFiles.length > 0 ? "Add more files" : "Replace File"}
                        <VisuallyHiddenInput
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,application/pdf"
                            onChange={(e) => {
                                const newFiles = Array.from(e.target.files ?? []);
                                setUploadedFiles((prev) => [...prev, ...newFiles]);
                                e.target.value = "";
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
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.25, borderRadius: 1, border: '1px solid', borderColor: 'success.light', bgcolor: 'rgba(46,125,50,0.06)', maxWidth: 180 }}>
                                    <InsertDriveFileIcon sx={{ fontSize: 13, color: 'success.main', flexShrink: 0 }} />
                                    <Typography variant="caption" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'success.main', fontWeight: 500 }}>
                                        {file.name}
                                    </Typography>
                                    <IconButton size="small" onClick={() => setUploadedFiles((prev) => prev.filter((_, i) => i !== idx))} sx={{ p: 0.15, ml: 0.25, flexShrink: 0 }}>
                                        <Typography variant="caption" sx={{ lineHeight: 1, color: 'text.secondary', fontSize: 10 }}>✕</Typography>
                                    </IconButton>
                                </Box>
                            </Tooltip>
                        ))}
                    </Box>
                )}
            </Box>
        </>
    );

    const PersonInchargeFields = (
        <>
            <SectionHeader title="Person in Charge" />
            <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                    size="small"
                    label="Name"
                    value={personInchargeName}
                    onChange={(e) => setPersonInchargeName(e.target.value)}
                    fullWidth
                />
                <TextField
                    size="small"
                    label="Email"
                    value={personInchargeEmail}
                    onChange={(e) => setPersonInchargeEmail(e.target.value)}
                    fullWidth
                />
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', '& .PhoneInputCountry': { mr: 1 } }}>
                    <PhoneInput
                        international
                        defaultCountry="AE"
                        value={personInchargePhone as Value}
                        onChange={(val) => setPersonInchargePhone(val || "")}
                        inputComponent={PhoneInputField}
                        label="Phone"
                        style={{ flex: 1, width: '100%' }}
                    />
                </Box>
                <TextField
                    size="small"
                    label="Fax No"
                    value={personInchargeFaxNo}
                    onChange={(e) => setPersonInchargeFaxNo(e.target.value)}
                    fullWidth
                />
            </Box>
        </>
    );

    const AccountingFields = (
        <Box
            component={Paper}
            sx={{ py: 2, px: 2, gap: 1.5, display: "flex", flexDirection: "column" }}
        >
            <SectionHeader title="Accounting Details" />
            <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                    size="small"
                    label="Name"
                    value={accountingName}
                    onChange={(e) => setAccountingName(e.target.value)}
                    fullWidth
                />
                <TextField
                    size="small"
                    label="Email"
                    value={accountingEmail}
                    onChange={(e) => setAccountingEmail(e.target.value)}
                    fullWidth
                />
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', '& .PhoneInputCountry': { mr: 1 } }}>
                    <PhoneInput
                        international
                        defaultCountry="AE"
                        value={accountingPhone as Value}
                        onChange={(val) => setAccountingPhone(val || "")}
                        inputComponent={PhoneInputField}
                        label="Phone"
                        style={{ flex: 1, width: '100%' }}
                    />
                </Box>
                <TextField
                    size="small"
                    label="Fax No"
                    value={accountingFaxNo}
                    onChange={(e) => setAccountingFaxNo(e.target.value)}
                    fullWidth
                />
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                    size="small"
                    label="Country"
                    value={accountingCountry}
                    onChange={(e) => setAccountingCountry(e.target.value)}
                    fullWidth
                />
                <TextField
                    size="small"
                    label="Credit Limit"
                    value={accountingCreditLimit}
                    onChange={(e) => setAccountingCreditLimit(e.target.value)}
                    fullWidth
                />
            </Box>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <TextField
                    size="small"
                    label="Payment Terms"
                    value={accountingPaymentTerms}
                    onChange={(e) => setAccountingPaymentTerms(e.target.value)}
                    fullWidth
                />
                <TextField
                    size="small"
                    label="Currency"
                    value={accountingCurrency}
                    onChange={(e) => setAccountingCurrency(e.target.value)}
                    fullWidth
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            size="small"
                            checked={accountingUseBillingCurrency}
                            onChange={(e) => setAccountingUseBillingCurrency(e.target.checked)}
                        />
                    }
                    label="Use billing currency"
                    sx={{ whiteSpace: "nowrap" }}
                />
            </Box>
            <TextField
                size="small"
                label="Billing Address"
                value={accountingBillingAddress}
                onChange={(e) => setAccountingBillingAddress(e.target.value)}
                fullWidth
                multiline
                rows={2}
            />
            <TextField
                size="small"
                label="Special Instructions"
                value={accountingSpecialInstructions}
                onChange={(e) => setAccountingSpecialInstructions(e.target.value)}
                fullWidth
                multiline
                rows={2}
            />

            {/* Multiple Email */}
            <Box
                component={Paper}
                sx={{ py: 2, px: 2, gap: 1.5, display: "flex", flexDirection: "column" }}
            >
                <SectionHeader title="Multiple Email" />
                <TextField
                    size="small"
                    label="Email"
                    value={multipleEmail}
                    onChange={(e) => setMultipleEmail(e.target.value)}
                    fullWidth
                />
            </Box>
        </Box>
    );

    //  JSX
    return (
        <Stack spacing={2} sx={{ "& .MuiFormLabel-asterisk": { color: "red" } }}>
            {/* Page header */}
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Edit Contact
            </Typography>

            {/* Top bar — group selector + action buttons */}
            <Box component={Paper} sx={{ p: 2, display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                <TextField
                    select
                    size="small"
                    label="Group"
                    value={groupId}
                    onChange={(e) => setGroupId(e.target.value)}
                    sx={{ minWidth: 200 }}
                    required
                >
                    {GROUP_OPTIONS.map((g) => (
                        <MenuItem key={g} value={g}>
                            {g}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    size="small"
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{ flex: 1, minWidth: 200 }}
                />

                <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={handleCancel}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={handleUpdate}
                        disabled={isSaving}
                        startIcon={isSaving ? <CircularProgress size={14} color="inherit" /> : null}
                    >
                        {isSaving ? "Saving…" : "Update"}
                    </Button>
                </Box>
            </Box>

            {/* Dynamic form — mirrors ContactCreate layout by group */}
            {groupId && (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 3,
                        flexWrap: "wrap",
                    }}
                >
                    {/* Column 1 — Contact Details + Person In Charge */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            flex: "1 1 330px",
                        }}
                    >
                        <Box
                            component={Paper}
                            sx={{ py: 2, px: 2, gap: 1.5, display: "flex", flexDirection: "column" }}
                        >
                            {ContactDetailsFields}
                            {PersonInchargeFields}
                        </Box>
                    </Box>

                    {/* Column 2 — Accounting Details (shown for groups that have it) */}
                    {groupId !== "Owners Agent" && (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                flex: "1 1 330px",
                            }}
                        >
                            {AccountingFields}

                            {/* Client-specific extras */}
                            {groupId === "Client" && (
                                <Box
                                    component={Paper}
                                    sx={{ py: 2, px: 2, gap: 1.5, display: "flex", flexDirection: "column" }}
                                >
                                    <SectionHeader title="Additional Details" />
                                    <TextField
                                        size="small"
                                        label="Key Account / Opp Manager"
                                        value={oppManager}
                                        onChange={(e) => setOppManager(e.target.value)}
                                        fullWidth
                                    />
                                    <TextField
                                        size="small"
                                        label="Bank Details"
                                        value={bankDetails}
                                        onChange={(e) => setBankDetails(e.target.value)}
                                        fullWidth
                                        multiline
                                        rows={2}
                                    />
                                    <TextField
                                        size="small"
                                        label="Client Hubs"
                                        value={clientHubs}
                                        onChange={(e) => setClientHubs(e.target.value)}
                                        fullWidth
                                    />
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* Owners Agent — only Multiple Email in col 2 */}
                    {groupId === "Owners Agent" && (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                flex: "1 1 330px",
                            }}
                        >
                            <Box
                                component={Paper}
                                sx={{ py: 2, px: 2, gap: 1.5, display: "flex", flexDirection: "column" }}
                            >
                                <SectionHeader title="Multiple Email" />
                                <TextField
                                    size="small"
                                    label="Email"
                                    value={multipleEmail}
                                    onChange={(e) => setMultipleEmail(e.target.value)}
                                    fullWidth
                                />
                            </Box>
                        </Box>
                    )}
                </Box>
            )}

            {/* Toast feedback */}
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