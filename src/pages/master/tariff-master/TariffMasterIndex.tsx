import Header from "./components/Header";
import Table, { DEMO_TARIFF_MASTERS } from "./components/Table";
import TariffMasterDialog from "./components/TrariffMasterDialog";
import { Box } from "@mui/material";
import { useState } from "react";
import type { TariffMaster } from "./types/trariffMaster.types";

export default function TariffMasterIndex() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingTariff, setEditingTariff] = useState<TariffMaster | null>(null);
    const [tariffs, setTariffs] = useState<TariffMaster[]>(DEMO_TARIFF_MASTERS);

    const handleCreate = () => {
        setEditingTariff(null);
        setDrawerOpen(true);
    };

    const handleEdit = (tariff: TariffMaster) => {
        setEditingTariff(tariff);
        setDrawerOpen(true);
    };

    const handleSaved = (data: TariffMaster) => {
        if (editingTariff) {
            setTariffs((current) => current.map((tariff) => (
                tariff.id === editingTariff.id ? { ...data, id: editingTariff.id } : tariff
            )));
            return;
        }

        setTariffs((current) => {
            const id = Math.max(0, ...current.map((tariff) => tariff.id)) + 1;
            return [{ ...data, id }, ...current];
        });
    };

    const handleDelete = (tariff: TariffMaster) => {
        setTariffs((current) => current.filter((item) => item.id !== tariff.id));
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setEditingTariff(null);
    };

    return (
        <Box>
            <Header onCreate={handleCreate} />
            <Table rows={tariffs} onEdit={handleEdit} onDelete={handleDelete} />
            <TariffMasterDialog
                open={drawerOpen}
                onClose={handleDrawerClose}
                tariffMaster={editingTariff}
                onSubmit={handleSaved}
            />
        </Box>
    );
}
