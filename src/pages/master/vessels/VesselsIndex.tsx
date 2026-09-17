import { useState } from "react";
import VesselIndexHeader from "./components/Header";
import VesselIndexFilter from "./components/Filter";
import VesselIndexTable from "./components/Table";
import { Box } from "@mui/material";

export default function VesselsIndex() {
    const [activeOnly, setActiveOnly] = useState(false);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <VesselIndexHeader />
            <VesselIndexFilter activeOnly={activeOnly} onActiveChange={setActiveOnly} />
            <VesselIndexTable filters={{ active: activeOnly ? true : undefined }} />
        </Box>
    );
}