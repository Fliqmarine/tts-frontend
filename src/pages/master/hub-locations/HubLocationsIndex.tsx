import { useState } from "react";
import {
    Alert,
    Box,
    Chip,
    IconButton,
    Paper,
    Snackbar,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import type { HubLocations, HubFilters } from "./types/hubLocations.types.ts";
import HubListFilter from "./components/Filter";
import HubIndexHeader from "./components/Header";
import HubLocationsDialog from "./components/HubLocationsDialog.tsx";

export default function HubLocationsIndex() {

    const demoData: HubLocations[] = [
    { id: 1, contactCode: "C001", name: "Global Hub NY", stationCode: "NYX1", email: "ny@hub.com", telephoneNo: "+1 212 555 0199", country: "United States", isActive: true },
    { id: 2, contactCode: "C002", name: "Euro Hub Berlin", stationCode: "BER2", email: "berlin@hub.com", telephoneNo: "+49 30 123456", country: "Germany", isActive: true },
    { id: 3, contactCode: "C003", name: "Asia Hub Tokyo", stationCode: "TOK3", email: "tokyo@hub.com", telephoneNo: "+81 3 1234 5678", country: "Japan", isActive: false },
    { id: 4, contactCode: "C004", name: "Middle East Hub Dubai", stationCode: "DXB4", email: "dubai@hub.com", telephoneNo: "+971 4 123 4567", country: "United Arab Emirates", isActive: true },
    { id: 5, contactCode: "C005", name: "UK Hub London", stationCode: "LON5", email: "london@hub.com", telephoneNo: "+44 20 7946 0958", country: "United Kingdom", isActive: true }
    ];
    const [hubLocations, setHubLocations] = useState<HubLocations[]>(demoData);
    const [filters, setFilters] = useState<HubFilters>({});
    const [hubLocationToEdit, setHubLocationToEdit] = useState<HubLocations  | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [notification, setNotification] = useState<{
        message: string;
        severity: "success" | "error";
    } | null>(null);

    const openCreateDialog = () => {
        setHubLocationToEdit(null);
        setDialogOpen(true);
    };

    const openEditDialog = (hub: HubLocations) => {
        setHubLocationToEdit(hub);
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setHubLocationToEdit(null);
    };

    const saveHub = (hub: HubLocations) => {
        if (hub.id) {
            setHubLocations((current) =>
                current.map((item) => (item.id === hub.id ? hub : item))
            );
            return;
        }

        setHubLocations((current) => {
            const id = Math.max(0, ...current.map((item) => item.id)) + 1;
            return [...current, { ...hub, id }];
        });
    };

    const filteredHubs = hubLocations.filter((hub) => {
        const search = filters.search?.trim().toLowerCase() ?? "";
        const matchesSearch =
            !search ||
            [hub.name, hub.contactCode, hub.stationCode, hub.email, hub.telephoneNo, hub.country]
                .some((value) => value.toLowerCase().includes(search));
        const matchesStation =
            !filters.stationCode || hub.stationCode === filters.stationCode;
        return matchesSearch && matchesStation;
    });

    const copyHub = async (hub: HubLocations) => {
        const text = [
            `Name: ${hub.name}`,
            `Contact Code: ${hub.contactCode}`,
            `Station Code: ${hub.stationCode}`,
            `Email: ${hub.email}`,
            `Phone: ${hub.telephoneNo}`,
            `Country: ${hub.country}`,
            `Active: ${hub.isActive ? "Yes" : "No"}`,
        ].join("\n");

        try {
            await navigator.clipboard.writeText(text);
            setNotification({ message: "Hub details copied.", severity: "success" });
        } catch {
            setNotification({
                message: "Could not copy hub details. Check clipboard permissions and try again.",
                severity: "error",
            });
        }
    };

    const deleteHub = (hub: HubLocations) => {
        if (!window.confirm(`Delete "${hub.name}"?`)) {
            return;
        }
        setHubLocations((current) => current.filter((item) => item.id !== hub.id));
    };

    return (
        <Stack spacing={2}>
            <HubIndexHeader onCreate={openCreateDialog} />
            <HubListFilter
                filters={filters}
                onFilterChange={setFilters}
                stationCodes={[...new Set(hubLocations.map((hub) => hub.stationCode))].sort()}
            />
            {filteredHubs.length ? (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 310px), 1fr))",
                        gap: 2,
                    }}
                >
                    {filteredHubs.map((hub) => (
                        <Paper
                            key={hub.id}
                            variant="outlined"
                            sx={{
                                p: 2.5,
                                borderRadius: 2,
                                display: "flex",
                                flexDirection: "column",
                                minWidth: 0,
                                transition: "box-shadow .2s, transform .2s, border-color .2s",
                                "&:hover": {
                                    boxShadow: 3,
                                    transform: "translateY(-2px)",
                                    borderColor: "primary.main",
                                },
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={1.5}
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                    <Typography variant="h6" fontWeight={600} noWrap title={hub.name}>
                                        {hub.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Contact code: {hub.contactCode}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.5,
                                        flexShrink: 0,
                                    }}
                                >
                                    <Chip
                                        size="small"
                                        label={hub.isActive ? "Active" : "Inactive"}
                                        color={hub.isActive ? "success" : "default"}
                                        variant={hub.isActive ? "filled" : "outlined"}
                                    />
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={0}
                                        sx={{ "& .MuiIconButton-root": { p: 0.5 } }}
                                    >
                                        <Tooltip title="Copy hub details">
                                            <IconButton
                                                size="small"
                                                color="info"
                                                aria-label={`Copy ${hub.name}`}
                                                onClick={() => void copyHub(hub)}
                                            >
                                                <ContentCopyOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit hub location">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                aria-label={`Edit ${hub.name}`}
                                                onClick={() => openEditDialog(hub)}
                                            >
                                                <EditOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete hub location">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                aria-label={`Delete ${hub.name}`}
                                                onClick={() => deleteHub(hub)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Box>
                            </Stack>

                            <Stack spacing={0.75} sx={{ mt: 2, flexGrow: 1 }}>
                                <Typography variant="body2">
                                    <Box component="span" sx={{ color: "text.secondary" }}>Station: </Box>
                                    {hub.stationCode}
                                </Typography>
                                <Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>
                                    <Box component="span" sx={{ color: "text.secondary" }}>Email: </Box>
                                    {hub.email}
                                </Typography>
                                <Typography variant="body2">
                                    <Box component="span" sx={{ color: "text.secondary" }}>Phone: </Box>
                                    {hub.telephoneNo}
                                </Typography>
                                <Typography variant="body2">
                                    <Box component="span" sx={{ color: "text.secondary" }}>Country: </Box>
                                    {hub.country}
                                </Typography>
                            </Stack>

                            
                        </Paper>
                    ))}
                </Box>
            ) : (
                <Paper variant="outlined" sx={{ p: 5, textAlign: "center", borderRadius: 2 }}>
                    <Typography color="text.secondary">
                        {hubLocations.length ? "No hub locations match your filters." : "No hub locations yet."}
                    </Typography>
                </Paper>
            )}
            <HubLocationsDialog
                open={dialogOpen}
                hubLocations={hubLocationToEdit}
                onClose={closeDialog}
                onSubmit={saveHub}
            />
            
        </Stack>
    );
}
