import { forwardRef, type ChangeEvent, type FormEvent, type ReactNode, useEffect, useState } from "react";
import { Box, Button, MenuItem, Paper, TextField, Typography, type TextFieldProps } from "@mui/material";
import PhoneInput, { getCountries, type Value } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";
import { useLocation, useNavigate } from "react-router-dom";
import "react-phone-number-input/style.css";
import type { ClientForm, ClientRecord, ClientSavedData } from "./types/client.types";

type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type NestedSection = "coordinatorInCharge" | "accountingDetails";
type Transform = (value: string) => string;

interface ClientEditingRecord extends ClientRecord {
	id: number;
}

interface ClientEditNavigationState {
	editingClient?: ClientEditingRecord;
}

const GAP = 1.5;
const COUNTRIES = getCountries();
const twoCols = { display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: GAP };
const fullRow = { gridColumn: { sm: "1 / -1" } };
const toTitleCase: Transform = (value = "") => value.toLowerCase().replace(/(^|[\s,])(\p{L})/gu, (_, sep, char) => sep + char.toUpperCase());

const createFormFromClient = (client: ClientRecord): ClientForm => ({
	companyName: client.companyName ?? "",
	city: client.city ?? "",
	country: client.country ?? "",
	address: client.address ?? "",
	postalCode: client.postalCode ?? "",
	vatNo: client.vatNo ?? "",
	multipleEmail: client.multipleEmail ?? "",
	coordinatorInCharge: {
		name: client.coordinatorInCharge?.name ?? "",
		email: client.coordinatorInCharge?.email ?? "",
		phone: client.coordinatorInCharge?.phone ?? "",
	},
	accountingDetails: {
		name: client.accountingDetails?.name ?? "",
		email: client.accountingDetails?.email ?? "",
		phone: client.accountingDetails?.phone ?? "",
		country: client.accountingDetails?.country ?? "",
		creditLimit: client.accountingDetails?.creditLimit ?? "",
		useBillingCurrency: client.accountingDetails?.useBillingCurrency ?? false,
		paymentTerms: client.accountingDetails?.paymentTerms ?? "",
		currency: client.accountingDetails?.currency ?? "",
		billingAddress: client.accountingDetails?.billingAddress ?? "",
		specialInstructions: client.accountingDetails?.specialInstructions ?? "",
	},
	keyAccountManager: client.keyAccountManager ?? "",
	bankDetails: client.bankDetails ?? "",
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

export default function ClientEditPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const client = (location.state as ClientEditNavigationState | null)?.editingClient;
	const [form, setForm] = useState<ClientForm>(() => client ? createFormFromClient(client) : {
		companyName: "",
		city: "",
		country: "",
		address: "",
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

	useEffect(() => {
		if (!client) navigate("/master/client", { replace: true });
	}, [client, navigate]);

	if (!client) return null;

	const { coordinatorInCharge: coord, accountingDetails: acc } = form;
	const onField = (field: keyof ClientForm, transform?: Transform) => (event: InputChange) => {
		const value = transform ? transform(event.target.value) : event.target.value;
		setForm((current) => ({ ...current, [field]: value }));
	};
	const setNested = <S extends NestedSection>(section: S, field: keyof ClientForm[S], value: string) =>
		setForm((current) => ({ ...current, [section]: { ...current[section], [field]: value } }));
	const onNested = <S extends NestedSection>(section: S, field: keyof ClientForm[S], transform?: Transform) =>
		(event: InputChange) => setNested(section, field, transform ? transform(event.target.value) : event.target.value);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const updatedClient: ClientSavedData = {
			groupId: "Client",
			companyName: form.companyName.trim(),
			city: form.city.trim(),
			country: form.country,
			address: form.address.trim(),
			postalCode: form.postalCode.trim(),
			vatNo: form.vatNo.trim(),
			multipleEmail: form.multipleEmail.trim(),
			coordinatorInCharge: form.coordinatorInCharge,
			accountingDetails: form.accountingDetails,
			keyAccountManager: form.keyAccountManager.trim(),
			bankDetails: form.bankDetails.trim(),
		};
		navigate("/master/client", { state: { updatedClient: { id: client.id, client: updatedClient } } });
	};

	return (
		<Box sx={{ width: "100%", p: { xs: 1, md: 2 } }}>
			<Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2, "& .MuiFormLabel-asterisk": { color: "red" } }}>
				<Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                }}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>Edit Client</Typography>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 2 }}>
                        <Button onClick={() => navigate("/master/client")} color="error" variant="outlined">Cancel</Button>
                        <Button type="submit" variant="contained">Save Changes</Button>
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
								<Field label="VAT No" value={form.vatNo} onChange={onField("vatNo")} />
								<Field label="Address" value={form.address} onChange={onField("address", toTitleCase)} required multiline minRows={2} sx={fullRow} />
							</Box>
						</Section>
						<Section title="Coordinator In Charge">
							<Box sx={twoCols}>
								<Field label="Name" value={coord.name} onChange={onNested("coordinatorInCharge", "name", toTitleCase)} required sx={fullRow} />
								<Field label="Email" type="email" value={coord.email} onChange={onNested("coordinatorInCharge", "email")} required />
								<PhoneField value={coord.phone} country={form.country} onChange={(phone) => setNested("coordinatorInCharge", "phone", phone)} />
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
						<Section title="TTS - Bank Details">
							<Field label="Bank Details" value={form.bankDetails} onChange={onField("bankDetails", toTitleCase)} required multiline minRows={3} />
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
