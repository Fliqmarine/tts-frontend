import { useState } from "react";
import { Box } from "@mui/material";
import Header from "./components/Header";
import Filter from "./components/Filter";
import Table from "./components/Table";
import VendorDialog from "./components/VendorDialog";
import type { Vendor } from "./types/vendor.types";
import type { VendorsFilters } from "./components/Filter";

export default function VendorsIndex() {
    // ── Dialog state ──────────────────────────────────────────────────────
    const [DialogOpen, setDialogOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

    // ── Filter state ──────────────────────────────────────────────────────
    const [filters, setFilters] = useState<VendorsFilters>({ search: "" });

    // ── Handlers ──────────────────────────────────────────────────────────
    const handleCreate = () => {
        setEditingVendor(null);
        setDialogOpen(true);
    };

    const handleEdit = (vendor: Vendor) => {
        setEditingVendor(vendor);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setEditingVendor(null);
    };

    const handleSaved = () => {
        // TODO: refetch vendor list from API
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Header onCreate={handleCreate} />
            <Filter filters={filters} onChange={setFilters} />
            <Table filters={filters} onEdit={handleEdit} />

            <VendorDialog
                open={DialogOpen}
                onClose={handleDialogClose}
                vendor={editingVendor}
                onSaved={handleSaved}
            />
        </Box>
    );
}
