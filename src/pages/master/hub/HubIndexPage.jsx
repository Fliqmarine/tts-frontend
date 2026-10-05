import { useState } from "react";
import { Stack } from "@mui/material";
import HubIndexHeader from "./components/Header";
import HubIndexFilter from "./components/Fliter";
import HubIndexTable from "./components/Table";
import HubDialog from "./components/HubDialog";
import HubViewDialog from "./components/HubViewDialog";

const demoHubs = [
    {
        id: 1001,
        groupId: "Hub",
        status: true,
        companyName: "Northstar Freight",
        stationCode: "NSF",
        city: "London",
        country: "GB",
        address: "18 Harbour Road",
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
        groupId: "Hub",
        status: false,
        companyName: "Cedar & Coast Trading",
        stationCode: "CCT",
        city: "Dubai",
        country: "AE",
        address: "Business Bay, Tower 4",
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
        groupId: "Hub",
        status: true,
        companyName: "Pacific Bridge Logistics",
        stationCode: "PBL",
        city: "Singapore",
        country: "SG",
        address: "72 Anson Road",
        postalCode: "079911",
        vatNo: "SGM12345678",
        coordinatorInCharge: { name: "Ethan Lim", email: "ethan.lim@pacificbridge.example", phone: "+6591234567" },
        accountingDetails: { name: "Chloe Tan", email: "accounts@pacificbridge.example", phone: "+6591234568", country: "SG", creditLimit: "18000", useBillingCurrency: false, paymentTerms: "Net 15", currency: "SGD", billingAddress: "72 Anson Road, Singapore", specialInstructions: "Send statements to accounts" },
        multipleEmail: "support@pacificbridge.example",
        keyAccountManager: "Casey Wong",
        bankDetails: "Pacific Trust Bank",
    },
];

export default function HubIndexPage() {
    const [filters, setFilters] = useState({ search: "", country: "", keyAccountManager: "", status: "" });
    const [hubs, setHubs] = useState(demoHubs);
    const [hubDialogOpen, setHubDialogOpen] = useState(false);
    const [hubToEdit, setHubToEdit] = useState(null);
    const [hubToView, setHubToView] = useState(null);
    const keyAccountManagers = [...new Set(hubs.map((hub) => hub.keyAccountManager).filter(Boolean))].sort();

    const openCreateDialog = () => {
        setHubToEdit(null);
        setHubDialogOpen(true);
    };

    const openEditDialog = (hub) => {
        setHubToEdit(hub);
        setHubDialogOpen(true);
    };

    const openViewDialog = (hub) => setHubToView(hub);
    const closeViewDialog = () => setHubToView(null);

    const closeHubDialog = () => {
        setHubDialogOpen(false);
        setHubToEdit(null);
    };

    const handleDelete = (hub) => {
        if (!window.confirm(`Delete ${hub.companyName}?`)) {
            return;
        }

        setHubs((current) => current.filter((item) => item.id !== hub.id));
    };

    const handleStatusChange = (hub, status) => {
        setHubs((current) => current.map((item) => (
            item.id === hub.id ? { ...item, status } : item
        )));
    };

    const handleHubSaved = (savedHub) => {
        if (hubToEdit) {
            setHubs((current) => current.map((item) => (
                item.id === hubToEdit.id ? { ...item, ...savedHub, id: item.id } : item
            )));
            return;
        }

        setHubs((current) => {
            const id = Math.max(0, ...current.map((item) => Number(item.id) || 0)) + 1;
            return [...current, { ...savedHub, id, stationCode: `DEMO-${id}`, status: true }];
        });
    };

    return (
        <Stack spacing={1}>
            <HubIndexHeader onCreate={openCreateDialog} />
            <HubIndexFilter filters={filters} onFilterChange={setFilters} keyAccountManagers={keyAccountManagers} />
            <HubIndexTable
                hubs={hubs}
                filters={filters}
                onDelete={handleDelete}
                onEdit={openEditDialog}
                onView={openViewDialog}
                onStatusChange={handleStatusChange}
            />
            <HubDialog
                open={hubDialogOpen}
                hub={hubToEdit}
                onClose={closeHubDialog}
                onSaved={handleHubSaved}
            />
            <HubViewDialog hub={hubToView} onClose={closeViewDialog} />
        </Stack>
    );
}
