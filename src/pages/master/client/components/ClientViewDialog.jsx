import {
	Box,
	Chip,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Link,
	Paper,
	Snackbar,
	Stack,
	Tooltip,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import BusinessIcon from "@mui/icons-material/Business";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const isEmpty = (value) => value === null || value === undefined || String(value).trim() === "";

const formatMoney = (amount, currency) => {
	if (isEmpty(amount)) return null;
	const number = Number(amount);
	if (Number.isNaN(number)) return String(amount);
	try {
		return new Intl.NumberFormat(undefined, {
			style: currency ? "currency" : "decimal",
			currency: currency || undefined,
			minimumFractionDigits: 2,
		}).format(number);
	} catch {
		return `${number.toLocaleString()} ${currency ?? ""}`.trim();
	}
};

const copyLine = (label, value) => `${label}: ${isEmpty(value) ? "-" : value}`;

function buildClientDetailsText(client) {
	const coordinator = client.coordinatorInCharge ?? {};
	const accounting = client.accountingDetails ?? {};
	const creditLimit = formatMoney(accounting.creditLimit, accounting.currency) ?? accounting.creditLimit;

	return [
		"Client Details",
		copyLine("Company Name", client.companyName),
		copyLine("Contact Code", String(client.id).padStart(5, "0")),
		copyLine("Station Code", client.stationCode),
		copyLine("VAT Number", client.vatNo),
		copyLine("Country", client.country),
		copyLine("City", client.city),
		copyLine("Postal Code", client.postalCode),
		copyLine("Address", client.address),
		copyLine("Notify Party", client.notifyParty),
		"",
		"Coordinator In Charge",
		copyLine("Name", coordinator.name),
		copyLine("Email", coordinator.email),
		copyLine("Phone", coordinator.phone),
		"",
		"Accounting Details",
		copyLine("Name", accounting.name),
		copyLine("Country", accounting.country),
		copyLine("Email", accounting.email),
		copyLine("Phone", accounting.phone),
		copyLine("Credit Limit", creditLimit),
		copyLine("Currency", accounting.currency),
		copyLine("Payment Terms", accounting.paymentTerms),
		copyLine("Billing Address", accounting.billingAddress),
		copyLine("Special Instructions", accounting.specialInstructions),
		"",
		"Additional Details",
		copyLine("Multiple Email", client.multipleEmail),
		copyLine("Key Account Manager", client.keyAccountManager),
		copyLine("TTS Bank Details", client.bankDetails),
	].join("\n");
}

function Detail({ label, value, href, multiline = false, fullWidth = false }) {
	const empty = isEmpty(value);

	return (
		<Box sx={{ minWidth: 0, gridColumn: fullWidth ? "1 / -1" : "auto" }}>
			<Typography variant="caption" color="text.secondary" display="block" sx={{ lineHeight: 2, mb: 2 }}>
				{label}
			</Typography>
			{empty ? (
				<Typography variant="body2" color="text.disabled">
					—
				</Typography>
			) : href ? (
				<Link href={href} variant="body2" underline="hover" sx={{ overflowWrap: "anywhere" }}>
					{value}
				</Link>
			) : (
				<Typography
					variant="body2"
					sx={{
						overflowWrap: "anywhere",
						whiteSpace: multiline ? "pre-wrap" : "normal",
						lineHeight: 1.4,
					}}
				>
					{value}
				</Typography>
			)}
		</Box>
	);
}

function DetailSection({ icon, title, children }) {
	return (
		<Paper variant="outlined" component="section" sx={{ p: 1.5, borderRadius: 2 }}>
			<Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.25 }}>
				<Box sx={{ display: "flex", color: "primary.main" }}>{icon}</Box>
				<Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 700 }}>
					{title}
				</Typography>
			</Stack>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
					columnGap: 2,
					rowGap: 1.25,
				}}
			>
				{children}
			</Box>
		</Paper>
	);
}

export default function ClientViewDialog({ client, onClose, onEdit }) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const [copyMessage, setCopyMessage] = useState("");

	const coordinator = client?.coordinatorInCharge ?? {};
	const accounting = client?.accountingDetails ?? {};

	const copyToClipboard = async () => {
		if (!client) return;

		try {
			await navigator.clipboard.writeText(buildClientDetailsText(client));
			setCopyMessage("Client details copied");
		} catch {
			setCopyMessage("Could not copy client details");
		}
	};

	return (
		<Dialog
			open={Boolean(client)}
			onClose={onClose}
			fullWidth
			maxWidth="lg"
			fullScreen={isMobile}
			aria-labelledby="client-view-title"
			PaperProps={{ sx: { maxHeight: isMobile ? "100%" : "none" } }}
		>
			<DialogTitle id="client-view-title" sx={{ py: 2, pr: 12, pl: 5, position: "relative", mt: 2}}>
				<Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
					<Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
						{client?.companyName || "Client Details"}
					</Typography>
					{client && (
						<Chip  variant="outlined" label={`#${String(client.id).padStart(5, "0")}`} />
					)}
					{client?.stationCode && <Chip  color="primary" label={client.stationCode} />}
                    {client && (
                        <Tooltip title="Copy client details">
                            <IconButton
                                aria-label="Copy client details"
								size="small"
								color="primary"
                                onClick={copyToClipboard}
                                sx={{
									bgcolor: "action.hover",
									"&:hover": { bgcolor: "action.selected" },
                                }}
                            >
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
				    )}  
				</Stack>
				
				<IconButton
					aria-label="Close"
					onClick={onClose}
					sx={{ position: "absolute", right: 12, top: 10, color: "text.secondary" }}
				>
					<CloseIcon />
				</IconButton>
                
			</DialogTitle>

			<DialogContent
				dividers
				sx={{
					bgcolor: "action.hover",
					p: 2,
					// No scrollbar on desktop; only scroll on mobile where it can't fit
					overflowY: isMobile ? "auto" : "visible",
				}}
			>
				{client && (
					<Box
						sx={{
							display: "grid",
							gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
							gap: 2,
							alignItems: "start",
						}}
					>
						{/* Left column */}
						<Stack spacing={2}>
							<DetailSection icon={<BusinessIcon fontSize="small" />} title="Client">
								<Detail label="Company Name" value={client.companyName} />
								<Detail label="VAT Number" value={client.vatNo} />
								<Detail label="Country" value={client.country} />
								<Detail label="City" value={client.city} />
								<Detail label="Postal Code" value={client.postalCode} />
								<Detail label="Station Code" value={client.stationCode} />
								<Detail label="Address" value={client.address} multiline  />
								<Detail label="Notify Party" value={client.notifyParty} multiline  />
							</DetailSection>

							<DetailSection icon={<SupportAgentIcon fontSize="small" />} title="Coordinator In Charge">
								<Detail label="Name" value={coordinator.name} fullWidth />
								<Detail
									label="Email"
									value={coordinator.email}
									href={coordinator.email ? `mailto:${coordinator.email}` : undefined}
								/>
								<Detail
									label="Phone"
									value={coordinator.phone}
									href={coordinator.phone ? `tel:${coordinator.phone}` : undefined}
								/>
							</DetailSection>
						</Stack>

						{/* Right column */}
						<Stack spacing={2}>
							<DetailSection icon={<AccountBalanceIcon fontSize="small" />} title="Accounting Details">
								<Detail label="Name" value={accounting.name} />
								<Detail label="Country" value={accounting.country} />
								<Detail
									label="Email"
									value={accounting.email}
									href={accounting.email ? `mailto:${accounting.email}` : undefined}
								/>
								<Detail
									label="Phone"
									value={accounting.phone}
									href={accounting.phone ? `tel:${accounting.phone}` : undefined}
								/>
								<Detail
									label="Credit Limit"
									value={formatMoney(accounting.creditLimit, accounting.currency)}
								/>
								<Detail label="Currency" value={accounting.currency} />
								<Detail label="Payment Terms" value={accounting.paymentTerms} fullWidth />
								<Detail label="Billing Address" value={accounting.billingAddress} multiline  />
								<Detail
									label="Special Instructions"
									value={accounting.specialInstructions}
									multiline
									
								/>
							</DetailSection>

							<DetailSection icon={<InfoOutlinedIcon fontSize="small" />} title="Additional Details">
								{/* <Detail label="Key Account Manager" value={client.keyAccountManager} /> */}
								<Detail label="Multiple Email" value={client.multipleEmail} multiline />
								<Detail label="TTS Bank Details" value={client.bankDetails} multiline  />
							</DetailSection>
						</Stack>
					</Box>
				)}
			</DialogContent>
			<Snackbar
				open={Boolean(copyMessage)}
				message={copyMessage}
				autoHideDuration={2000}
				onClose={() => setCopyMessage("")}
			/>
		</Dialog>
	);
}