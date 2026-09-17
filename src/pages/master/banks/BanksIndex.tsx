import { useState } from "react";
import { Box } from "@mui/material";
import Header from "./components/Header";
import Filter from "./components/Filter";
import Table from "./components/Table";
import BankDialog from "./components/BankDialog";
import type { Bank } from "./types/bank.types";
import type { Filters } from "./components/Filter";

export default function BanksIndex() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingBank, setEditingBank] = useState<Bank | null>(null);

    const [filters, setFilters] = useState<Filters>({ search: "" });

    const handleCreate = () => {
        setEditingBank(null);
        setDrawerOpen(true);
    };

    const handleEdit = (bank: Bank) => {
        setEditingBank(bank);
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setEditingBank(null);
    };

    const handleSaved = () => {
        // TODO: refetch bank list from API
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Header onCreate={handleCreate} />
            <Filter filters={filters} onChange={setFilters} />
            <Table filters={filters} onEdit={handleEdit} />

            <BankDialog
                open={drawerOpen}
                onClose={handleDrawerClose}
                bank={editingBank}
                onSaved={handleSaved}
            />
        </Box>
    );
}
