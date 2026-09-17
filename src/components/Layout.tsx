import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import TopBar from "../components/TopBar";

export default function Layout() {
    return (
        <>
            <TopBar />
            <Box sx={{ p: 3 }}>
                <Outlet />
            </Box>
        </>
    );
}