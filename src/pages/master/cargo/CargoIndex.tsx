import { Box } from "@mui/material";
import { useState } from "react";
import type { Cargo } from "./types/cargo.types.ts";
import CargoIndexHeader from "./components/Header.tsx";
import CargoDialog from "./components/CargoDialog.tsx";
import CargoIndexTable from "./components/Table.tsx";

export default function CargoIndex() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editCargo, setEditCargo] = useState<Cargo | null>(null);

    const handleCreate = () => {
        setDrawerOpen(true);
        setEditCargo(null);
    };

    const handleEdit = (cargo: Cargo) => {
        setDrawerOpen(true);
        setEditCargo(cargo);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setEditCargo(null);
    };

    const handleDrawerSubmit = (data: Cargo) => {
        console.log("Drawer submitted:", data);
        setDrawerOpen(false);
        setEditCargo(null);
    };

    return (
        <Box sx={{ p: 2 }}>
            <CargoIndexHeader onCreate={handleCreate} />
            <CargoIndexTable onEdit={handleEdit} />
            <CargoDialog
                open={drawerOpen}
                onClose={handleDrawerClose}
                cargo={editCargo}
                onSubmit={handleDrawerSubmit}
            />
        </Box>
    );
}
