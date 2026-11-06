import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import ClientViewDialog from "./components/ClientViewDialog";
import ClientIndexHeader from "./components/ClientIndexHeader";
import ClientIndexFilter from "./components/ClientIndexFliter";
import ClientIndexTable from "./components/ClientIndexTable";

interface Client {
	id: number;
	groupId?: string;
	status: boolean;
	companyName: string;
	stationCode: string;
	city: string;
	country: string;
	address: string;
	notifyParty?: string;
	postalCode: string;
	vatNo: string;
	coordinatorInCharge: { name: string; email: string; phone: string };
	additionalCoordinators?: { name: string; email: string; phone: string }[];
	accountingDetails: {
		name: string;
		email: string;
		phone: string;
		country: string;
		creditLimit: string;
		useBillingCurrency: boolean;
		paymentTerms: string;
		currency: string;
		billingAddress: string;
		specialInstructions: string;
	};
	multipleEmail: string;
	keyAccountManager: string;
	bankDetails: string;
}

interface ClientFilters {
	search: string;
	country: string;
	keyAccountManager: string;
	status: string;
}

type NewClient = Omit<Client, "id" | "status" | "stationCode"> & Partial<Pick<Client, "stationCode">>;

interface ClientCreateNavigationState {
	createdClient?: NewClient;
	updatedClient?: { id: number; client: NewClient };
}

const demoClients: Client[] = [
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
	const location = useLocation();
	const navigate = useNavigate();
	const navigationState = location.state as ClientCreateNavigationState | null;
	const createdClient = navigationState?.createdClient;
	const updatedClient = navigationState?.updatedClient;
	const [filters, setFilters] = useState<ClientFilters>({ search: "", country: "", keyAccountManager: "", status: "" });
	const [clients, setClients] = useState<Client[]>(() => {
		let initialClients = demoClients;
		if (createdClient) {
			const id = Math.max(0, ...initialClients.map((client) => client.id)) + 1;
			initialClients = [...initialClients, { ...createdClient, id, stationCode: createdClient.stationCode || `DEMO-${id}`, status: true }];
		}
		if (updatedClient) {
			initialClients = initialClients.map((client) => (
				client.id === updatedClient.id ? { ...client, ...updatedClient.client, id: client.id } : client
			));
		}
		return initialClients;
	});
	const [clientToView, setClientToView] = useState<Client | null>(null);
	const keyAccountManagers = [...new Set(clients.map((client) => client.keyAccountManager).filter(Boolean))].sort();

	useEffect(() => {
		if (createdClient || updatedClient) {
			navigate("/master/client", { replace: true, state: null });
		}
	}, [createdClient, updatedClient, navigate]);

	const openCreatePage = () => {
		navigate("/master/client/create");
	};

	const openEditPage = (client: Client) => {
		navigate("/master/client/edit", { state: { editingClient: client } });
	};

	const openViewDialog = (client: Client) => setClientToView(client);
	const closeViewDialog = () => setClientToView(null);

	const handleDelete = (client: Client) => {
		if (!window.confirm(`Delete ${client.companyName}?`)) {
			return;
		}

		setClients((current) => current.filter((item) => item.id !== client.id));
	};

	const handleStatusChange = (client: Client, status: boolean) => {
		setClients((current) => current.map((item) => (
			item.id === client.id ? { ...item, status } : item
		)));
	};

	return (
		<Stack spacing={1}>
			<ClientIndexHeader onCreate={openCreatePage} />
			<ClientIndexFilter filters={filters} onFilterChange={setFilters} keyAccountManagers={keyAccountManagers} />
			<ClientIndexTable
				clients={clients}
				filters={filters}
				onDelete={handleDelete}
				onEdit={openEditPage}
				onView={openViewDialog}
				onStatusChange={handleStatusChange}
			/>
			<ClientViewDialog client={clientToView} onClose={closeViewDialog} />
		</Stack>
	);
}
