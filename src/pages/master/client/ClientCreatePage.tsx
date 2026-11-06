import { forwardRef, type ChangeEvent, type FormEvent, type ReactNode, useState } from "react";
import { Box, Button, IconButton, MenuItem, Paper, TextField, Tooltip, Typography, type TextFieldProps } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import PhoneInput, { getCountries, type Value } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";
import { useNavigate } from "react-router-dom";
import "react-phone-number-input/style.css";
import type { ClientForm, ClientSavedData } from "./types/client.types";

type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type NestedSection = "coordinatorInCharge" | "accountingDetails";
type Transform = (value: string) => string;

const GAP = 1.5;
const COUNTRIES = getCountries();
const FOB_OPTIONS = ["New Client", "Standard Client", "Client 2", "Client 3"];
const twoCols = { display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: GAP };
const fullRow = { gridColumn: { sm: "1 / -1" } };
const toTitleCase: Transform = (value = "") => value.toLowerCase().replace(/(^|[\s,])(\p{L})/gu, (_, sep, char) => sep + char.toUpperCase());

const createEmptyForm = (): ClientForm => ({
	companyName: "",
	city: "",
	country: "",
	address: "",
	postalCode: "",
	// vatNo: "",
	multipleEmail: "",
	coordinatorInCharge: { name: "", email: "", phone: "" },
	additionalCoordinators: [],
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
	fob: "",
	sellingRate: "",
	rebate: "",
});

const Field = (props: TextFieldProps) => <TextField size="small" fullWidth {...props} />;

const PhoneInputField = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => (
	<TextField size="small" fullWidth label="Phone" {...props} inputRef={ref} />
));
PhoneInputField.displayName = "PhoneInputField";

const PhoneField = ({ value, country, onChange }: { value: string; country: string; onChange: (phone: string) => void }) => (
	<Box sx={{ minWidth: 0, "& .PhoneInputCountry": { mr: 1 } }}>
		<PhoneInput
			international
			country={country || undefined}
			value={value ? (value as Value) : undefined}
			onChange={(phone) => onChange(phone || "")}
			inputComponent={PhoneInputField}
			required
			style={{ display: "flex", width: "100%" }}
		/>
	</Box>
);

const CountrySelect = ({ label, value, onChange, required }: {
	label: string;
	value: string;
	onChange: (event: InputChange) => void;
	required?: boolean;
}) => (
	<Field select label={label} value={value} onChange={onChange} required={required}>
		{COUNTRIES.map((code) => <MenuItem key={code} value={code} dense>{en[code] || code}</MenuItem>)}
	</Field>
);

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
	<Paper elevation={3} sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: GAP, minWidth: 0 }}>
		<Box sx={{ display: "flex", alignItems: "center", gap: 1, pb: 0.5, borderBottom: "1px solid", borderColor: "divider" }}>
			<Box sx={{ width: 3, height: 14, borderRadius: 1, flexShrink: 0, background: "linear-gradient(180deg, #5A73FF 0%, #3D5AFE 100%)" }} />
			<Typography variant="subtitle2" sx={{ color: "#3D5AFE", fontWeight: 700, lineHeight: 1.2 }}>{title}</Typography>
		</Box>
		{children}
	</Paper>
);

const Column = ({ children }: { children: ReactNode }) => (
	<Box sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0, flex: "1 1 330px" }}>{children}</Box>
);

export default function ClientCreatePage() {
	const navigate = useNavigate();
	const [form, setForm] = useState<ClientForm>(createEmptyForm);
	const { coordinatorInCharge: coord, accountingDetails: acc } = form;

	const onField = (field: keyof ClientForm, transform?: Transform) => (event: InputChange) => {
		const value = transform ? transform(event.target.value) : event.target.value;
		setForm((current) => ({ ...current, [field]: value }));
	};
	const setNested = <S extends NestedSection>(section: S, field: keyof ClientForm[S], value: string) =>
		setForm((current) => ({ ...current, [section]: { ...current[section], [field]: value } }));
	const onNested = <S extends NestedSection>(section: S, field: keyof ClientForm[S], transform?: Transform) =>
		(event: InputChange) => setNested(section, field, transform ? transform(event.target.value) : event.target.value);
	const updateAdditionalCoordinator = (index: number, field: "name" | "email" | "phone", value: string) =>
		setForm((current) => ({
			...current,
			additionalCoordinators: (current.additionalCoordinators ?? []).map((coordinator, coordinatorIndex) =>
				coordinatorIndex === index ? { ...coordinator, [field]: value } : coordinator,
			),
		}));

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const createdClient: ClientSavedData = {
			groupId: "Client",
			companyName: form.companyName.trim(),
			city: form.city.trim(),
			country: form.country,
			address: form.address.trim(),
			postalCode: form.postalCode.trim(),
			// vatNo: form.vatNo.trim(),
			multipleEmail: form.multipleEmail.trim(),
			coordinatorInCharge: form.coordinatorInCharge,
			additionalCoordinators: form.additionalCoordinators ?? [],
			accountingDetails: form.accountingDetails,
			keyAccountManager: form.keyAccountManager.trim(),
			bankDetails: form.bankDetails.trim(),
		};
		navigate("/master/client", { state: { createdClient } });
	};

	return (
		<Box sx={{ width: "100%", p: { xs: 1, md: 2 } }}>
			<Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, "& .MuiFormLabel-asterisk": { color: "red" } }}>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						flexWrap: "wrap",
						gap: 2,
					}}
				>
					<Typography variant="h5" sx={{ fontWeight: 600 }}>Create Client</Typography>
					<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
						<Button onClick={() => navigate("/master/client")} color="error" variant="outlined">Cancel</Button>
						<Button type="submit" variant="contained">Save</Button>
					</Box>
				</Box>
				<Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, alignItems: "start", width: "100%" }}>
					<Column>
						<Section title="Client Details">
							<Box sx={twoCols}>
								<Field label="Company Name" value={form.companyName} onChange={onField("companyName", toTitleCase)} required sx={fullRow} />
								<CountrySelect label="Country" value={form.country} onChange={onField("country")} required />
								<Field label="City" value={form.city} onChange={onField("city")} required />
								<Field label="Postal Code" value={form.postalCode} onChange={onField("postalCode")} />
								{/* <Field label="VAT No" value={form.vatNo} onChange={onField("vatNo")} /> */}
								<Field label="Address" value={form.address} onChange={onField("address", toTitleCase)} required multiline minRows={2} sx={fullRow} />
							</Box>
						</Section>
						<Section title="Coordinator In Charge">
							<Box sx={twoCols}>
								<Box sx={{ ...fullRow, display: "flex", alignItems: "center", gap: 1 }}>
									<Field label="Name" value={coord.name} onChange={onNested("coordinatorInCharge", "name", toTitleCase)} required />
									<Tooltip title="Add another coordinator">
										<IconButton
											type="button"
											color="primary"
											aria-label="Add another coordinator"
											onClick={() => setForm((current) => ({
												...current,
												additionalCoordinators: [
													...(current.additionalCoordinators ?? []),
													{ name: "", email: "", phone: "" },
												],
											}))}
										>
											<AddIcon />
										</IconButton>
									</Tooltip>
								</Box>
								<Field label="Email" type="email" value={coord.email} onChange={onNested("coordinatorInCharge", "email")} required />
								<PhoneField value={coord.phone} country={form.country} onChange={(phone) => setNested("coordinatorInCharge", "phone", phone)} />
								{(form.additionalCoordinators ?? []).map((coordinator, index) => (
									<Box key={index} sx={{ ...fullRow, display: "grid", gridTemplateColumns: "1fr auto", gap: 1.5, alignItems: "center" }}>
										<Box sx={twoCols}>
											<Field
												label="Name"
												value={coordinator.name}
												onChange={(event) => updateAdditionalCoordinator(index, "name", toTitleCase(event.target.value))}
												required
												sx={fullRow}
											/>
											<Field
												label="Email"
												type="email"
												value={coordinator.email}
												onChange={(event) => updateAdditionalCoordinator(index, "email", event.target.value)}
												required
											/>
											<PhoneField
												value={coordinator.phone}
												country={form.country}
												onChange={(phone) => updateAdditionalCoordinator(index, "phone", phone)}
											/>
										</Box>
										<Tooltip title="Remove coordinator">
											<IconButton
												type="button"
												color="error"
												aria-label={`Remove coordinator ${index + 2}`}
												onClick={() => setForm((current) => ({
													...current,
													additionalCoordinators: (current.additionalCoordinators ?? []).filter((_, coordinatorIndex) => coordinatorIndex !== index),
												}))}
											>
												<CloseIcon />
											</IconButton>
										</Tooltip>
									</Box>
								))}
							</Box>
						</Section>
					</Column>
					<Column>
						<Section title="Accounting Details">
							<Box sx={twoCols}>
								<Field label="Name" value={acc.name} onChange={onNested("accountingDetails", "name", toTitleCase)} required sx={fullRow} />
								<Field label="Email" type="email" value={acc.email} onChange={onNested("accountingDetails", "email")} required />
								<PhoneField value={acc.phone} country={acc.country} onChange={(phone) => setNested("accountingDetails", "phone", phone)} />
								<CountrySelect label="Country" value={acc.country} onChange={onNested("accountingDetails", "country")} />
								<Field label="Credit Limit" value={acc.creditLimit} onChange={onNested("accountingDetails", "creditLimit")} required />
								<Field label="Currency" value={acc.currency} onChange={onNested("accountingDetails", "currency")} required />
								<Field label="Payment Terms" value={acc.paymentTerms} onChange={onNested("accountingDetails", "paymentTerms")} required />
								<Field label="Billing Address" value={acc.billingAddress} onChange={onNested("accountingDetails", "billingAddress", toTitleCase)} multiline minRows={3} required sx={fullRow} />
								<Field label="Special Instructions" value={acc.specialInstructions} onChange={onNested("accountingDetails", "specialInstructions", toTitleCase)} multiline minRows={3} sx={fullRow} />
							</Box>
						</Section>
					</Column>
					<Column>
						<Section title="Selling Details">
							<Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: GAP }}>
								<Field select label="FOB" value={form.fob} onChange={onField("fob")} required>
									{FOB_OPTIONS.map((option) => (
										<MenuItem key={option} value={option}>{option}</MenuItem>
									))}
								</Field>
								<Field label="Selling Rate ( % )" value={form.sellingRate} onChange={onField("sellingRate", toTitleCase)} required />
								<Field label="Rebate" value={form.rebate} onChange={onField("rebate", toTitleCase)} required />
							</Box>
						</Section>
						<Section title="TTS - Bank Details">
							<Field label="Bank Details" value={form.bankDetails} onChange={onField("bankDetails", toTitleCase)} required />
						</Section>
						<Section title="Key Account Manager">
							<Field label="Opp Manager" value={form.keyAccountManager} onChange={onField("keyAccountManager")} required />
						</Section>
						<Section title="Multiple Email">
							<Field label="Email" type="email" value={form.multipleEmail} onChange={onField("multipleEmail")} />
						</Section>
					</Column>
				</Box>
			</Box>
		</Box>
	);
}
