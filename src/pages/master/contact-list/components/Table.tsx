import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
    Box,
    Button,
    Checkbox,
    Chip,
    IconButton,
    Paper,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Contact } from "../types/contact.types";
import { loadDemoContacts, saveDemoContacts } from "../data/demoContacts";

export interface ContactFilters {
    search?: string;
    groupId?: string;
    country?: string;
    status?: "active" | "inactive";
}

interface ContactsIndexTableProps {
    onDelete?: (contact: Contact) => void;
    filters?: ContactFilters;
}

const headCellSx = { whiteSpace: "nowrap" as const };

export default function ContactsIndexTable({ onDelete, filters }: ContactsIndexTableProps) {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState<Contact[]>(loadDemoContacts);
    const [selected, setSelected] = useState<number[]>([]);
    const [activeById, setActiveById] = useState<Record<number, boolean>>({ 2102: false });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const search = filters?.search?.toLowerCase() ?? "";
    const filtered = contacts.filter((contact) => {
        const groupMatch = !filters?.groupId || contact.groupId === filters.groupId;
        const countryMatch = !filters?.country || contact.country === filters.country;
        const isActive = activeById[contact.id] ?? true;
        const statusMatch = !filters?.status || isActive === (filters.status === "active");
        const searchMatch = !search || [
            contact.companyName,
            contact.coordinatorInCharge?.name,
            contact.coordinatorInCharge?.email,
            contact.coordinatorInCharge?.phone,
            contact.country,
        ].some((value) => value?.toLowerCase().includes(search));

        return groupMatch && countryMatch && statusMatch && searchMatch;
    });
    const pageCount = Math.ceil(filtered.length / rowsPerPage);
    const safePage = Math.max(0, Math.min(page, pageCount - 1));
    const paginatedContacts = filtered.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage);

    const currentPageIds = filtered.map((contact) => contact.id);
    const allOnPageSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selected.includes(id));
    const someOnPageSelected = currentPageIds.some((id) => selected.includes(id)) && !allOnPageSelected;

    const handleSelectAll = () => {
        if (allOnPageSelected) {
            setSelected((previous) => previous.filter((id) => !currentPageIds.includes(id)));
        } else {
            setSelected((previous) => [...new Set([...previous, ...currentPageIds])]);
        }
    };

    const handleExport = () => window.alert(`Exporting ${selected.length} items (Placeholder)`);

    return (
        <Box>
            {selected.length > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1, mb: 1, bgcolor: "action.hover", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>{selected.length} items selected</Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button variant="contained" size="small" color="success" startIcon={<FileDownloadOutlinedIcon />} onClick={handleExport}>Export Excel</Button>
                        <Button variant="contained" size="small" color="secondary" startIcon={<FileDownloadOutlinedIcon />} onClick={handleExport}>Export PDF</Button>
                    </Box>
                </Box>
            )}
            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: "8px 8px 16px 16px", border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox" sx={{ pl: 1.5 }}><Checkbox size="small" color="primary" indeterminate={someOnPageSelected} checked={allOnPageSelected} onChange={handleSelectAll} /></TableCell>
                            <TableCell sx={headCellSx}>Category</TableCell>
                            <TableCell sx={headCellSx}>Contact Code</TableCell>
                            <TableCell sx={headCellSx}>Company Name</TableCell>
                            <TableCell sx={headCellSx}>Coordinator In Charge</TableCell>
                            <TableCell sx={headCellSx}>Station Code</TableCell>
                            <TableCell sx={headCellSx}>Email</TableCell>
                            <TableCell sx={headCellSx}>Phone</TableCell>
                            <TableCell sx={headCellSx}>Country</TableCell>
                            <TableCell sx={headCellSx}>Status</TableCell>
                            <TableCell sx={{ ...headCellSx, textAlign: "right" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={11} sx={{ textAlign: "center", py: 5 }}>
                                    <Typography variant="body2" color="text.secondary">No contacts found.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : paginatedContacts.map((contact) => {
                            const isSelected = selected.includes(contact.id);
                            return (
                                <TableRow key={contact.id} selected={isSelected} hover>
                                    <TableCell padding="checkbox" sx={{ pl: 1.5 }}>
                                        <Checkbox size="small" color="primary" checked={isSelected} onChange={() => setSelected((previous) => isSelected ? previous.filter((id) => id !== contact.id) : [...previous, contact.id])} />
                                    </TableCell>
                                    <TableCell><Chip label={contact.groupId} size="small" color="primary" variant="outlined" sx={{ fontSize: "0.68rem", fontWeight: 600 }} /></TableCell>
                                    <TableCell sx={{ color: "text.secondary", fontFamily: "monospace" }}>{String(contact.id).padStart(5, "0")}</TableCell>
                                    <TableCell sx={{ fontWeight: 500, color: "text.primary" }}>{contact.companyName || "—"}</TableCell>
                                    <TableCell sx={{ color: "text.secondary" }}>{contact.coordinatorInCharge?.name || "—"}</TableCell>
                                    <TableCell sx={{ color: "text.secondary" }}>{contact.stationCode || "—"}</TableCell>
                                    <TableCell sx={{ color: "text.secondary" }}>{contact.coordinatorInCharge?.email || "—"}</TableCell>
                                    <TableCell sx={{ color: "text.secondary" }}>{contact.coordinatorInCharge?.phone || "—"}</TableCell>
                                    <TableCell sx={{ color: "text.secondary" }}>{contact.country || "—"}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                            <Switch
                                                size="small"
                                                checked={activeById[contact.id] ?? true}
                                                onChange={(event) => setActiveById((current) => ({ ...current, [contact.id]: event.target.checked }))}
                                                slotProps={{ input: { "aria-label": `Set ${contact.companyName} ${activeById[contact.id] ?? true ? "inactive" : "active"}` } }}
                                            />
                                            <Typography variant="caption" color={(activeById[contact.id] ?? true) ? "success.main" : "text.secondary"}>
                                                {(activeById[contact.id] ?? true) ? "Active" : "Inactive"}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: "flex", gap: 0.25, justifyContent: "flex-end" }}>
                                            <Tooltip title="View" arrow>
                                                <IconButton size="small" color="primary" onClick={() => navigate(`/master/contact-list/contact-view/${contact.id}`)}><VisibilityIcon sx={{ fontSize: "1rem" }} /></IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit" arrow>
                                                <IconButton size="small" color="primary" onClick={() => navigate(`/master/contact-list/contact-edit/${contact.id}`)}><EditIcon sx={{ fontSize: "1rem" }} /></IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete" arrow>
                                                <IconButton size="small" color="error" onClick={() => {
                                                    onDelete?.(contact);
                                                    const remaining = contacts.filter((item) => item.id !== contact.id);
                                                    saveDemoContacts(remaining);
                                                    setContacts(remaining);
                                                }}><DeleteIcon sx={{ fontSize: "1rem" }} /></IconButton>
                                            </Tooltip>
                                            <Tooltip title="More" arrow>
                                                <IconButton size="small" color="default"><MoreVertIcon sx={{ fontSize: "1rem" }} /></IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                colSpan={11}
                                count={filtered.length}
                                page={safePage}
                                rowsPerPage={rowsPerPage}
                                rowsPerPageOptions={[5, 10, 25]}
                                onPageChange={(_, nextPage) => setPage(nextPage)}
                                onRowsPerPageChange={(event) => {
                                    setRowsPerPage(Number.parseInt(event.target.value, 10));
                                    setPage(0);
                                }}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Box>
    );
}
