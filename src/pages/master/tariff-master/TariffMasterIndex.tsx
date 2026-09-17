import Header from "./components/Header";
import Table from "./components/Table";
import TariffMasterDialog from "./components/TrariffMasterDialog";
import { Box } from "@mui/material";
import { useState } from "react";
import type { TariffMaster } from "./types/trariffMaster.types";

export default function TariffMasterIndex() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingTariff, setEditingTariff] = useState<TariffMaster | null>(null);

    const handleCreate = () => {
        setEditingTariff(null);
        setDrawerOpen(true);
    };

    const handleEdit = (tariff: TariffMaster) => {
        setEditingTariff(tariff);
        setDrawerOpen(true);
    };

    const handleSaved = (data: TariffMaster) => {
        console.log("Saved tariff:", data);
        // TODO: call API to create/update, then refetch the list
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setEditingTariff(null);
    };

    return (
        <Box>
            <Header onCreate={handleCreate} />
            <Table onEdit={handleEdit} />
            <TariffMasterDialog
                open={drawerOpen}
                onClose={handleDrawerClose}
                tariffMaster={editingTariff}
                onSubmit={handleSaved}
            />
        </Box>
    );
}
