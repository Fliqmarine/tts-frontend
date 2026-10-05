import { useNavigate, useParams } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Chip,
    Divider,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { loadDemoContacts } from "./data/demoContacts";

// ── Helpers ───────────────────────────────────────────────────────────────────
function SectionHeader({ title }: { title: string }) {
    return (
        <Box
            sx={{
                py: 0.6,
                px: 2,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                borderRadius: 1,
                mb: 1.5,
            }}
        >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {title}
            </Typography>
        </Box>
    );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
    return (
        <Box
            sx={{
                display: "flex",
                gap: 1,
                py: 0.6,
                borderBottom: "1px solid rgba(0,0,0,0.05)",
                "&:last-child": { borderBottom: 0 },
            }}
        >
            <Typography
                variant="body2"
                sx={{ minWidth: 160, color: "#64748b", fontWeight: 500, flexShrink: 0 }}
            >
                {label}
            </Typography>
            <Typography variant="body2" sx={{ color: "#1e293b", wordBreak: "break-word" }}>
                {value || <span style={{ color: "#94a3b8" }}>—</span>}
            </Typography>
        </Box>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ContactView() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const contact = loadDemoContacts().find((item) => item.id === Number(id));

    // ── States ────────────────────────────────────────────────────────────────
    if (!contact) {
        return <Alert severity="error">Contact not found.</Alert>;
    }

    // ── View ──────────────────────────────────────────────────────────────────
    return (
        <Stack spacing={2}>
            {/* Header bar */}
            <Box
                component={Paper}
                elevation={0}
                sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                }}
            >
                {/* Back */}
                <Button
                    size="small"
                    variant="outlined"
                    color="inherit"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ color: "#64748b", borderColor: "#e2e8f0" }}
                >
                    Back
                </Button>

                <Divider orientation="vertical" flexItem />

                {/* Title + badge */}
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                        {contact.companyName}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 0.4 }}>
                        <Chip
                            label={contact.groupId}
                            size="small"
                            sx={{
                                fontSize: "0.68rem",
                                bgcolor: (theme) => `rgba(${theme.palette.primary.main}, 0.09)`,
                                color: "primary.main",
                                fontWeight: 700,
                            }}
                        />
                        <Chip
                            label={`#${String(contact.id).padStart(5, "0")}`}
                            size="small"
                            sx={{
                                fontSize: "0.68rem",
                                bgcolor: "rgba(100,116,139,0.08)",
                                color: "#64748b",
                                fontFamily: "monospace",
                                fontWeight: 600,
                            }}
                        />
                    </Box>
                </Box>

            </Box>

            {/* Body — 2-column layout */}
            <Box sx={{ display: "flex", gap: 2.5, flexWrap: "wrap" }}>
                {/* ── Column 1 ── */}
                <Box sx={{ flex: "1 1 340px", display: "flex", flexDirection: "column", gap: 2 }}>

                    {/* Contact Details */}
                    <Box
                        component={Paper}
                        elevation={0}
                        sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}
                    >
                        <SectionHeader title="Contact Details" />
                        <InfoRow label="Company Name" value={contact.companyName} />
                        <InfoRow label="Station Code" value={contact.stationCode} />
                        <InfoRow label="EORI / UISE No." value={contact.eoriUiseNo} />
                        <InfoRow label="Notify Party" value={contact.notifyParty} />
                        <InfoRow label="Airport Code" value={contact.airportCode} />
                        <InfoRow label="Address" value={contact.address} />
                        <InfoRow label="City" value={contact.city} />
                        <InfoRow label="Country" value={contact.country} />
                        <InfoRow label="Postal Code" value={contact.postalCode} />
                        <InfoRow label="VAT No." value={contact.vatNo} />
                    </Box>

                    {/* Coordinator In Charge */}
                    {contact.coordinatorInCharge && (
                        <Box
                            component={Paper}
                            elevation={0}
                            sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}
                        >
                            <SectionHeader title="Coordinator In Charge" />
                            <InfoRow label="Name" value={contact.coordinatorInCharge.name} />
                            <InfoRow label="Email" value={contact.coordinatorInCharge.email} />
                            <InfoRow label="Phone" value={contact.coordinatorInCharge.phone} />
                        </Box>
                    )}
                </Box>

                {/* ── Column 2 ── */}
                <Box sx={{ flex: "1 1 340px", display: "flex", flexDirection: "column", gap: 2 }}>

                    {/* Accounting Details */}
                    {contact.accountingDetails && (
                        <Box
                            component={Paper}
                            elevation={0}
                            sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}
                        >
                            <SectionHeader title="Accounting Details" />
                            <InfoRow label="Name" value={contact.accountingDetails.name} />
                            <InfoRow label="Email" value={contact.accountingDetails.email} />
                            <InfoRow label="Phone" value={contact.accountingDetails.phone} />
                            <InfoRow label="Country" value={contact.accountingDetails.country} />
                            <InfoRow label="Credit Limit" value={contact.accountingDetails.creditLimit} />
                            <InfoRow
                                label="Use Billing Currency"
                                value={contact.accountingDetails.useBillingCurrency ? "Yes" : "No"}
                            />
                            <InfoRow label="Payment Terms" value={contact.accountingDetails.paymentTerms} />
                            <InfoRow label="Currency" value={contact.accountingDetails.currency} />
                            <InfoRow label="Billing Address" value={contact.accountingDetails.billingAddress} />
                            <InfoRow
                                label="Special Instructions"
                                value={contact.accountingDetails.specialInstructions}
                            />
                        </Box>
                    )}

                    {/* Additional Details */}
                    {(contact.keyAccountManager || contact.bankDetails) && (
                        <Box
                            component={Paper}
                            elevation={0}
                            sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}
                        >
                            <SectionHeader title="Additional Details" />
                            <InfoRow label="Key Account Manager" value={contact.keyAccountManager} />
                            <InfoRow label="Bank Details" value={contact.bankDetails} />
                        </Box>
                    )}

                    {/* Multiple Email */}
                    {contact.multipleEmail && (
                        <Box
                            component={Paper}
                            elevation={0}
                            sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}
                        >
                            <SectionHeader title="Multiple Email" />
                            <InfoRow label="Email" value={contact.multipleEmail} />
                        </Box>
                    )}
                </Box>
            </Box>
        </Stack>
    );
}
