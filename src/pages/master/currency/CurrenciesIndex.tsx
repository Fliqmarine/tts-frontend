import { Box } from "@mui/material";
import { useState } from "react";
import type { Currency } from "./types/currency.types.ts";
import CurrencyIndexHeader from "./components/Header.tsx";
import CurrencyIndexTable from "./components/Table.tsx";
import CurrencyDialog from "./components/CurrencyDialog.tsx";

export default function CurrenciesIndex() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editCurrency, setEditCurrency] = useState<Currency | null>(null);

    const handleCreate = () => {
        setDrawerOpen(true);
        setEditCurrency(null);
    };

    const handleEdit = (currency: Currency) => {
        setDrawerOpen(true);
        setEditCurrency(currency);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setEditCurrency(null);
    };

    const handleDrawerSubmit = (data: Currency) => {
        console.log("Drawer submitted:", data);
        setDrawerOpen(false);
        setEditCurrency(null);
    };

    return (
        <Box sx={{ p: 2 }}>
            <CurrencyIndexHeader onCreate={handleCreate} />
            <CurrencyIndexTable onEdit={handleEdit} />
            <CurrencyDialog
                open={drawerOpen}
                onClose={handleDrawerClose}
                currency={editCurrency}
                onSubmit={handleDrawerSubmit}
            />
        </Box>
    );
}
