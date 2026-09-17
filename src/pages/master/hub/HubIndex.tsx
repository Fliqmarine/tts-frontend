import { Box } from "@mui/material";
import { useState } from "react";
import type { Hub } from "./types/hub.types.ts";
import HubIndexHeader from "./components/Header.tsx";
import HubIndexTable from "./components/Table.tsx";
import HubDialog from "./components/HubDialog.tsx";

export default function HubIndex() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editHub, setEditHub] = useState<Hub | null>(null);

    const handleCreate = () => {
        setDrawerOpen(true);
        setEditHub(null);
    };

    const handleEdit = (hub: Hub) => {
        setDrawerOpen(true);
        setEditHub(hub);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setEditHub(null);
    };

    const handleDrawerSubmit = (data: Hub) => {
        console.log("Drawer submitted:", data);
        setDrawerOpen(false);
        setEditHub(null);
    };

    return (
        <Box sx={{ p: 2 }}>
            <HubIndexHeader onCreate={handleCreate} />
            <HubIndexTable onEdit={handleEdit} />
            <HubDialog
                open={drawerOpen}
                onClose={handleDrawerClose}
                hub={editHub}
                onSubmit={handleDrawerSubmit}
            />
        </Box>
    );
}
