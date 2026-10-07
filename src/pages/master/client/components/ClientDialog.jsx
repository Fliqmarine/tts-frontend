import { forwardRef, useEffect, useState } from "react";
import {
	Alert,
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	IconButton,
	MenuItem,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import { getCountries } from "react-phone-number-input";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import en from "react-phone-number-input/locale/en.json";

const countries = getCountries();

const createEmptyForm = () => ({
	companyName: "",
	city: "",
	country: "",
	address: "",
	// notifyParty: "",
	postalCode: "",
	vatNo: "",
	multipleEmail: "",
	coordinatorInCharge: { name: "", email: "", phone: "" },
	accountingDetails: {
		name: "",
		email: "",
		phone: "",
		country: "",
		creditLimit: "",
		useBillingCurrency: false,
		paymentTerms: "",
		currency: "",
		billingAddress: "",
		specialInstructions: "",
	},
	keyAccountManager: "",
	bankDetails: "",
});

const createFormFromClient = (client) => {
	const emptyForm = createEmptyForm();
	if (!client) return emptyForm;

	return {
		...emptyForm,
		companyName: client.companyName ?? "",
		city: client.city ?? "",
		country: client.country ?? "",
		address: client.address ?? "",
		// notifyParty: client.notifyParty ?? "",
		postalCode: client.postalCode ?? "",
		vatNo: client.vatNo ?? "",
		multipleEmail: client.multipleEmail ?? "",
		coordinatorInCharge: { ...emptyForm.coordinatorInCharge, ...client.coordinatorInCharge },
		accountingDetails: { ...emptyForm.accountingDetails, ...client.accountingDetails },
		keyAccountManager: client.keyAccountManager ?? "",
		bankDetails: client.bankDetails ?? "",
	};
};

/* ---------- compact layout tokens ---------- */
const GAP =1.5;
const twoCols = { 
	display: "grid", 
	gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, 
	gap: GAP };
const fullRow = { gridColumn: { sm: "1 / -1" } };

// every input is small + full width by default
const Field = (props) => <TextField size="small" fullWidth {...props} />;
const PhoneInputField = forwardRef((props, ref) => <TextField label="Phone" {...props} inputRef={ref} />);

function CountrySelect({ label, value, onChange, required = false }) {
	return (
		<Field select label={label} value={value} onChange={onChange} required={required}>
			{countries.map((code) => (
				<MenuItem key={code} value={code} dense>
					{en[code] || code}
				</MenuItem>
			))}
		</Field>
	);
}

function Section({ title, children }) {
	return (
		<Paper variant="outlined" sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: GAP, minWidth: 0 }}>
			<Box sx={{ display: "flex", alignItems: "center", gap: 1, pb: 0.5, borderBottom: "1px solid", borderColor: "divider" }}>
				<Box sx={{ width: 3, height: 14, borderRadius: 1, background: "linear-gradient(180deg, #5A73FF 0%, #3D5AFE 100%)", flexShrink: 0 }} />
				<Typography variant="subtitle2" sx={{ color: "#3D5AFE", fontWeight: 700, lineHeight: 1.2 }}>
					{title}
				</Typography>
			</Box>
			{children}
		</Paper>
	);
}

const PhoneField = ({ value, country, onChange, required = false }) => (
	<Box sx={{ minWidth: 0, "& .PhoneInputCountry": { mr: 1 } }}>
		<PhoneInput
			international
			country={country || undefined}
			value={value || undefined}
			onChange={(phone) => onChange(phone || "")}
			inputComponent={PhoneInputField}
			required={required}
			style={{ display: "flex", width: "100%" }}
		/>
	</Box>
);

const Column = ({ children }) => (
	<Box sx={{ display: "flex", flexDirection: "column", gap: GAP, minWidth: 0 }}>{children}</Box>
);

export default function ClientDialog({ open, onClose, onSaved, client = null }) {
	const [form, setForm] = useState(createEmptyForm);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const isEditing = Boolean(client);

	useEffect(() => {
		if (open) {
			setForm(createFormFromClient(client));
			setError("");
		}
	}, [open, client]);

	const updateField = (field) => (event) => setForm((c) => ({ ...c, [field]: event.target.value }));

	const updateNested = (section, field) => (event) =>
		setForm((c) => ({ ...c, [section]: { ...c[section], [field]: event.target.value } }));

	const resetForm = () => {
		setForm(createEmptyForm());
		setError("");
	};

	const handleClose = () => {
		if (saving) return;
		resetForm();
		onClose();
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setSaving(true);
		setError("");

		const contactData = {
			groupId: "Client",
			companyName: form.companyName.trim(),
			city: form.city.trim(),
			country: form.country,
			address: form.address.trim(),
			// notifyParty: form.notifyParty.trim(),
			postalCode: form.postalCode.trim(),
			vatNo: form.vatNo.trim(),
			multipleEmail: form.multipleEmail.trim(),
			coordinatorInCharge: form.coordinatorInCharge,
			accountingDetails: form.accountingDetails,
			keyAccountManager: form.keyAccountManager.trim(),
			bankDetails: form.bankDetails.trim(),
		};

		onSaved?.(contactData);
		resetForm();
		setSaving(false);
		onClose();
	};

	const { coordinatorInCharge: coord, accountingDetails: acc } = form;

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			fullWidth
			maxWidth="xl"
			scroll="paper"
			sx={{
				"& .MuiDialog-paper": {
					height: { xs: "calc(100dvh - 16px)", sm: "62vh" },
					maxHeight: "calc(100% - 32px)",
					width: { xs: "calc(100% - 16px)", sm: "calc(100% - 64px)" },
					m: { xs: 1, sm: 4 },
				},
			}}
		>
			<Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
				<DialogTitle sx={{ display: "flex", alignItems: "center", gap: 2, py: 2, px: 3, bgcolor: (t) => alpha(t.palette.primary.main, 0.06), borderBottom: 1, borderColor: "divider" }}>
					<Box sx={{ width: 44, height: 44, borderRadius: 1, display: "grid", placeItems: "center", bgcolor: "primary.main", color: "primary.contrastText", boxShadow: (t) => `0 6px 16px ${alpha(t.palette.primary.main, 0.35)}` }}>
						<BusinessOutlinedIcon />
					</Box>
					<Typography variant="h6" component="span" sx={{ fontWeight: 700, lineHeight: 1.2, flexGrow: 1 }}>
						{isEditing ? "Edit Client" : "Create Client"}
					</Typography>
					<Box sx={{ px: 3, py: 2, display: "flex", justifyContent: "flex-end", gap: 1.5, bgcolor: (t) => alpha(t.palette.grey[500], 0.04) }}>
						<Button onClick={handleClose} color="error" variant="outlined" disabled={saving} sx={{ textTransform: "none", borderRadius: 2, px: 2.5 }}>
							Cancel
						</Button>
						<Button type="submit" variant="contained" disableElevation disabled={saving} sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 3 }}>
							{saving ? "Saving..." : isEditing ? "Save Changes" : "Save"}
						</Button>
					</Box>
				</DialogTitle>

				<DialogContent sx={{ p: 3, flexGrow: 1, overflowY: "auto", overflowX: "hidden",mt:3,
					display: "flex",
					justifyContent: "center",  
					alignItems: "flex-start" }}>
					<Box
						sx={{
							display: "grid",
							width: "100%",
							gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(3, minmax(0, 1fr))", xl: "repeat(3, minmax(0, 1fr))" },
							gap: GAP,
							alignItems: "start",
						}}
					>
						{/* Column 1 */}
						<Column>
							<Section title="Client Details">
								<Box sx={twoCols}>
									<Field label="Company Name" value={form.companyName} onChange={updateField("companyName")} required sx={fullRow} />
									<CountrySelect label="Country" value={form.country} onChange={updateField("country")} required />
									<Field label="City" value={form.city} onChange={updateField("city")} required />
									<Field label="Postal Code" value={form.postalCode} onChange={updateField("postalCode")} />
									<Field label="VAT No" value={form.vatNo} onChange={updateField("vatNo")} />
									<Field label="Address" value={form.address} onChange={updateField("address")} required multiline minRows={2} sx={fullRow} />
									{/* <Field label="Notify Party" value={form.notifyParty} onChange={updateField("notifyParty")} multiline minRows={1} sx={fullRow} /> */}
								</Box>
							</Section>

							<Section title="Coordinator In Charge">
								<Box sx={twoCols}>
									<Field label="Name" value={coord.name} onChange={updateNested("coordinatorInCharge", "name")} required sx={fullRow} />
									<Field label="Email" type="email" value={coord.email} onChange={updateNested("coordinatorInCharge", "email")} required />
									<PhoneField value={coord.phone} country={form.country} onChange={(phone) => setForm((current) => ({ ...current, coordinatorInCharge: { ...current.coordinatorInCharge, phone } }))} required />
								</Box>
							</Section>
						</Column>

						{/* Column 2 */}
						<Column>
							<Section title="Accounting Details">
								<Box sx={twoCols}>
									<Field label="Name" value={acc.name} onChange={updateNested("accountingDetails", "name")} required sx={fullRow} />
									<Field label="Email" type="email" value={acc.email} onChange={updateNested("accountingDetails", "email")} required />
									<PhoneField value={acc.phone} country={acc.country} onChange={(phone) => setForm((current) => ({ ...current, accountingDetails: { ...current.accountingDetails, phone } }))} required />
									<CountrySelect label="Country" value={acc.country} onChange={updateNested("accountingDetails", "country")} />
									<Field label="Credit Limit" value={acc.creditLimit} onChange={updateNested("accountingDetails", "creditLimit")} required />
									<Field label="Currency" value={acc.currency} onChange={updateNested("accountingDetails", "currency")} required />
									<Field label="Payment Terms" value={acc.paymentTerms} onChange={updateNested("accountingDetails", "paymentTerms")} required />
									<Field label="Billing Address" value={acc.billingAddress} onChange={updateNested("accountingDetails", "billingAddress")} multiline minRows={3} sx={fullRow} required />
									<Field label="Special Instructions" value={acc.specialInstructions} onChange={updateNested("accountingDetails", "specialInstructions")} multiline minRows={3} sx={fullRow} />
								</Box>
							</Section>
						</Column>

						{/* Column 3 */}
						<Column>
							<Section title="TTS - Bank Details">
								<Field label="Bank Details" value={form.bankDetails} onChange={updateField("bankDetails")} required multiline minRows={3} />
							</Section>
							<Section title="Key Account Manager">
								<Field label="Opp Manager" value={form.keyAccountManager} onChange={updateField("keyAccountManager")} required />
							</Section>
							<Section title="Multiple Email">
								<Field label="Email" type="email" value={form.multipleEmail} onChange={updateField("multipleEmail")} />
							</Section>
						</Column>
					</Box>

					{error && (
						<Alert severity="error" sx={{ mt: GAP, py: 0 }}>
							{error}
						</Alert>
					)}
				</DialogContent>
				
			</Box>
		</Dialog>
	);
}
