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

function buildHubDetailsText(hub) {
	const coordinator = hub.coordinatorInCharge ?? {};
	const accounting = hub.accountingDetails ?? {};
	const creditLimit = formatMoney(accounting.creditLimit, accounting.currency) ?? accounting.creditLimit;

	return [
		"Hub Details",
		copyLine("Company Name", hub.companyName),
		copyLine("Contact Code", String(hub.id).padStart(5, "0")),
		copyLine("Station Code", hub.stationCode),
		copyLine("VAT Number", hub.vatNo),
		copyLine("Country", hub.country),
		copyLine("City", hub.city),
		copyLine("Postal Code", hub.postalCode),
		copyLine("Address", hub.address),
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
		copyLine("Multiple Email", hub.multipleEmail),
		copyLine("Key Account Manager", hub.keyAccountManager),
		copyLine("TTS Bank Details", hub.bankDetails),
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

export default function HubViewDialog({ hub, onClose, onEdit }) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const [copyMessage, setCopyMessage] = useState("");

	const coordinator = hub?.coordinatorInCharge ?? {};
	const accounting = hub?.accountingDetails ?? {};

	const copyToClipboard = async () => {
		if (!hub) return;

		try {
			await navigator.clipboard.writeText(buildHubDetailsText(hub));
			setCopyMessage("Hub details copied");
		} catch {
			setCopyMessage("Could not copy hub details");
		}
	};

	return (
		<Dialog
			open={Boolean(hub)}
			onClose={onClose}
			fullWidth
			maxWidth="lg"
			fullScreen={isMobile}
			aria-labelledby="hub-view-title"
			PaperProps={{ sx: { maxHeight: isMobile ? "100%" : "none" } }}
		>
			<DialogTitle id="hub-view-title" sx={{ py: 2, pr: 12, pl: 5, position: "relative", mt: 2}}>
				<Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
					<Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
						{hub?.companyName || "Hub Details"}
					</Typography>
					{hub && (
						<Chip  variant="outlined" label={`#${String(hub.id).padStart(5, "0")}`} />
					)}
					{hub?.stationCode && <Chip  color="primary" label={hub.stationCode} />}
                    {hub && (
                        <Tooltip title="Copy hub details">
                            <IconButton
                                aria-label="Copy hub details"
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
				{hub && (
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
							<DetailSection icon={<BusinessIcon fontSize="small" />} title="Hub">
								<Detail label="Company Name" value={hub.companyName} />
								<Detail label="VAT Number" value={hub.vatNo} />
								<Detail label="Country" value={hub.country} />
								<Detail label="City" value={hub.city} />
								<Detail label="Postal Code" value={hub.postalCode} />
								<Detail label="Station Code" value={hub.stationCode} />
								<Detail label="Address" value={hub.address} multiline fullWidth />
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
								{/* <Detail label="Key Account Manager" value={hub.keyAccountManager} /> */}
								<Detail label="Multiple Email" value={hub.multipleEmail} multiline />
								<Detail label="TTS Bank Details" value={hub.bankDetails} multiline  />
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