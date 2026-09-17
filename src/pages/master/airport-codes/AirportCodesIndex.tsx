import { Box } from "@mui/material";
import { useState } from "react";
import type { AirportCodes } from "./types/airportCodes.types.ts";
import Header from "./components/Header.tsx";
import Table from "./components/Table.tsx";
import AirportCodesDialog from "./components/AirportCodesDialog.tsx";

export default function AirportCodesIndex() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editAirportCode, setEditAirportCode] = useState<AirportCodes | null>(null);

    const handleCreate = () => {
        setDrawerOpen(true);
        setEditAirportCode(null);
    };

    const handleEdit = (airportCode: AirportCodes) => {
        setDrawerOpen(true);
        setEditAirportCode(airportCode);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setEditAirportCode(null);
    };

    const handleDrawerSubmit = (data: AirportCodes) => {
        console.log("Drawer submitted:", data);
        setDrawerOpen(false);
        setEditAirportCode(null);
    };

    return (
        <Box sx={{ p: 2 }}>
            <Header onCreate={handleCreate} />
            <Table  onEdit={handleEdit} />
            <AirportCodesDialog 
                open={drawerOpen} 
                onClose={handleDrawerClose}    
                airportCode={editAirportCode} 
                onSubmit={handleDrawerSubmit}
            />
        </Box>
    );
}
