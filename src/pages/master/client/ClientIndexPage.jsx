import { useState } from "react";
import { Stack } from "@mui/material";
import ClientIndexHeader from "./components/Header";
import ClientIndexFilter from "./components/Fliter";
import ClientIndexTable from "./components/Table";
import ClientDialog from "./components/ClientDialog";
import ClientViewDialog from "./components/ClientViewDialog";

const demoClients = [
	{
		id: 1001,
		groupId: "Client",
		status: true,
		companyName: "Northstar Freight",
		stationCode: "NSF",
		city: "London",
		country: "GB",
		address: "18 Harbour Road",
		notifyParty: "Northstar Receiving Team",
		postalCode: "E14 9QH",
		vatNo: "GB123456789",
		coordinatorInCharge: { name: "Amelia Clarke", email: "amelia.clarke@northstar.example", phone: "+442079460123" },
		accountingDetails: { name: "Oliver Reed", email: "accounts@northstar.example", phone: "+442079460124", country: "GB", creditLimit: "25000", useBillingCurrency: false, paymentTerms: "Net 30", currency: "GBP", billingAddress: "18 Harbour Road, London", specialInstructions: "Email invoices monthly" },
		multipleEmail: "ops@northstar.example",
		keyAccountManager: "Jordan Lee",
		bankDetails: "Northstar Business Bank",
	},
	{
		id: 1002,
		groupId: "Client",
		status: false,
		companyName: "Cedar & Coast Trading",
		stationCode: "CCT",
		city: "Dubai",
		country: "AE",
		address: "Business Bay, Tower 4",
		notifyParty: "Cedar Coast Import Desk",
		postalCode: "00000",
		vatNo: "AE987654321",
		coordinatorInCharge: { name: "Maya Hassan", email: "maya.hassan@cedarcoast.example", phone: "+971501234567" },
		accountingDetails: { name: "Samir Nasser", email: "finance@cedarcoast.example", phone: "+971501234568", country: "AE", creditLimit: "40000", useBillingCurrency: false, paymentTerms: "Net 45", currency: "AED", billingAddress: "Business Bay, Dubai", specialInstructions: "Include purchase order number" },
		multipleEmail: "logistics@cedarcoast.example",
		keyAccountManager: "Taylor Morgan",
		bankDetails: "Emirates Commercial Bank",
	},
	{
		id: 1003,
		groupId: "Client",
		status: true,
		companyName: "Pacific Bridge Logistics",
		stationCode: "PBL",
		city: "Singapore",
		country: "SG",
		address: "72 Anson Road",
		notifyParty: "Pacific Bridge Warehouse Team",
		postalCode: "079911",
		vatNo: "SGM12345678",
		coordinatorInCharge: { name: "Ethan Lim", email: "ethan.lim@pacificbridge.example", phone: "+6591234567" },
		accountingDetails: { name: "Chloe Tan", email: "accounts@pacificbridge.example", phone: "+6591234568", country: "SG", creditLimit: "18000", useBillingCurrency: false, paymentTerms: "Net 15", currency: "SGD", billingAddress: "72 Anson Road, Singapore", specialInstructions: "Send statements to accounts" },
		multipleEmail: "support@pacificbridge.example",
		keyAccountManager: "Casey Wong",
		bankDetails: "Pacific Trust Bank",
	},
];

export default function ClientIndexPage() {
	const [filters, setFilters] = useState({ search: "", country: "", keyAccountManager: "", status: "" });
	const [clients, setClients] = useState(demoClients);
	const [clientDialogOpen, setClientDialogOpen] = useState(false);
	const [clientToEdit, setClientToEdit] = useState(null);
	const [clientToView, setClientToView] = useState(null);
	const keyAccountManagers = [...new Set(clients.map((client) => client.keyAccountManager).filter(Boolean))].sort();

	const openCreateDialog = () => {
		setClientToEdit(null);
		setClientDialogOpen(true);
	};

	const openEditDialog = (client) => {
		setClientToEdit(client);
		setClientDialogOpen(true);
	};

	const openViewDialog = (client) => setClientToView(client);
	const closeViewDialog = () => setClientToView(null);

	const closeClientDialog = () => {
		setClientDialogOpen(false);
		setClientToEdit(null);
	};

	const handleDelete = (client) => {
		if (!window.confirm(`Delete ${client.companyName}?`)) {
			return;
		}

		setClients((current) => current.filter((item) => item.id !== client.id));
	};

	const handleStatusChange = (client, status) => {
		setClients((current) => current.map((item) => (
			item.id === client.id ? { ...item, status } : item
		)));
	};

	const handleClientSaved = (savedClient) => {
		if (clientToEdit) {
			setClients((current) => current.map((item) => (
				item.id === clientToEdit.id ? { ...item, ...savedClient, id: item.id } : item
			)));
			return;
		}

		setClients((current) => {
			const id = Math.max(0, ...current.map((item) => Number(item.id) || 0)) + 1;
			return [...current, { ...savedClient, id, stationCode: `DEMO-${id}`, status: true }];
		});
	};

	return (
		<Stack spacing={1}>
			<ClientIndexHeader onCreate={openCreateDialog} />
			<ClientIndexFilter filters={filters} onFilterChange={setFilters} keyAccountManagers={keyAccountManagers} />
			<ClientIndexTable
				clients={clients}
				filters={filters}
				onDelete={handleDelete}
				onEdit={openEditDialog}
				onView={openViewDialog}
				onStatusChange={handleStatusChange}
			/>
			<ClientDialog
				open={clientDialogOpen}
				client={clientToEdit}
				onClose={closeClientDialog}
				onSaved={handleClientSaved}
			/>
			<ClientViewDialog client={clientToView} onClose={closeViewDialog} />
		</Stack>
	);
}
