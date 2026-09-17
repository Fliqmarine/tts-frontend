import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Checkbox, Button, 
    Alert,
    Box,
    Chip,
    CircularProgress,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useEffect, useState } from "react";
import type { Contact } from "../types/contact.types";
import { getContacts } from "../services/contact.service";
import { useNavigate } from "react-router-dom";

// ── Filter shape ──────────────────────────────────────────────────────────────
export interface ContactFilters {
    search?: string;
    groupId?: string;
    country?: string;
}

interface ContactsIndexTableProps {
    onDelete?: (contact: Contact) => void;
    filters?: ContactFilters;
}

// ── Styles ────────────────────────────────────────────────────────────────────
const headCellSx = {
    fontWeight: 700,
    color: "#475569",
    fontSize: "0.72rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.6px",
    py: "8px",
    whiteSpace: "nowrap" as const,
};

const rowHoverSx = {
    "&:hover": { bgcolor: "rgba(198,40,40,0.03)" },
    transition: "background 0.15s",
};

export default function ContactsIndexTable({ onDelete, filters }: ContactsIndexTableProps) {
    const navigate = useNavigate();

    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ── Fetch ─────────────────────────────────────────────────────────────────
    useEffect(() => {
        const loadContacts = async () => {
            try {
                setLoading(true);
                setError(null);
                // getContacts() already returns Contact[] — no .json() needed
                const data = await getContacts();
                setContacts(data);
            } catch {
                setError("Failed to load contacts");
            } finally {
                setLoading(false);
            }
        };
        loadContacts();
    }, []);

    // ── Client-side filter ────────────────────────────────────────────────────
    const filtered = contacts.filter((c) => {
        const search = filters?.search?.toLowerCase() ?? "";
        const groupMatch = !filters?.groupId || c.groupId === filters.groupId;
        const countryMatch = !filters?.country || c.country === filters.country;

        const searchMatch =
            !search ||
            c.companyName?.toLowerCase().includes(search) ||
            c.email?.toLowerCase().includes(search) ||
            c.phone?.toLowerCase().includes(search) ||
            c.country?.toLowerCase().includes(search);

        return groupMatch && countryMatch && searchMatch;
    });

    const [selected, setSelected] = useState<number[]>([]);

    const currentPageIds = filtered.map((contact) => contact.id);
    const allOnPageSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selected.includes(id));
    const someOnPageSelected = currentPageIds.some((id) => selected.includes(id)) && !allOnPageSelected;

    const handleSelectAll = () => {
        if (allOnPageSelected) {
            setSelected((prev) => prev.filter((id) => !currentPageIds.includes(id)));
        } else {
            setSelected((prev) => [...new Set([...prev, ...currentPageIds])]);
        }
    };

    const handleSelectRow = (id: number) => {
        setSelected((prev) => prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]);
    };

    const handleExport = () => {
        alert(`Exporting ${selected.length} items (Placeholder)`);
    };

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <Paper sx={{ p: 5, display: "flex", justifyContent: "center" }}>
                <CircularProgress color="error" size={32} />
            </Paper>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    // ── Table ─────────────────────────────────────────────────────────────────
    return (
        <Box>
            {selected.length > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1, mb: 1, bgcolor: "rgba(198,40,40,0.06)", borderRadius: 2, border: "1px solid rgba(198,40,40,0.15)" }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#C62828" }}>{selected.length} items selected</Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button variant="contained" size="small" startIcon={<FileDownloadOutlinedIcon />} onClick={handleExport} color="success" sx={{ color: "#fff", textTransform: "none", fontWeight: 600, borderRadius: 2, px: 2.5, boxShadow: "0 3px 10px rgba(198,40,40,0.3)" }}>Export Excel</Button>
                        <Button variant="contained" size="small" startIcon={<FileDownloadOutlinedIcon />} onClick={handleExport} sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 2.5, boxShadow: "0 3px 16px rgba(198,40,40,0.4)" }}>Export PDF</Button>
                    </Box>
                </Box>
            )}
            <TableContainer
            component={Paper}
            elevation={3}
            sx={{
                borderRadius: "8px 8px 16px 16px",
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
            }}
        >
            <Table size="small">
                <TableHead>
                    <TableRow
                        sx={{
                            background: "linear-gradient(135deg, #fafbfd 0%, #f1f5f9 100%)",
                            borderBottom: "2px solid rgba(198,40,40,0.15)",
                        }}
                    >
                        <TableCell padding="checkbox" sx={{ pl: 1.5 }}><Checkbox size="small" indeterminate={someOnPageSelected} checked={allOnPageSelected} onChange={handleSelectAll} sx={{ color: "#94a3b8", "&.Mui-checked, &.MuiCheckbox-indeterminate": { color: "#C62828" } }} /></TableCell>
<TableCell sx={headCellSx}>Category</TableCell>
                        <TableCell sx={headCellSx}>Contact Code</TableCell>
                        <TableCell sx={headCellSx}>Company Name</TableCell>
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
                            <TableCell colSpan={9} sx={{ textAlign: "center", py: 5 }}>
                                <Typography variant="body2" color="text.secondary">
                                    No contacts found.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        filtered.map((contact) => {
        const isSelected = selected.includes(contact.id);
        return (
            <TableRow key={contact.id} selected={isSelected} sx={{ ...rowHoverSx, ...(isSelected && { bgcolor: "rgba(198,40,40,0.04) !important" }) }}>
                <TableCell padding="checkbox" sx={{ pl: 1.5 }}><Checkbox size="small" checked={isSelected} onChange={() => handleSelectRow(contact.id)} sx={{ color: "#94a3b8", "&.Mui-checked": { color: "#C62828" } }} /></TableCell>
                                {/* Category / Group */}
                                <TableCell>
                                    <Chip
                                        label={contact.groupId}
                                        size="small"
                                        sx={{
                                            fontSize: "0.68rem",
                                            bgcolor: "rgba(198,40,40,0.08)",
                                            color: "#c62828",
                                            fontWeight: 600,
                                        }}
                                    />
                                </TableCell>

                                {/* Contact code (ID padded) */}
                                <TableCell sx={{ color: "#64748b", fontFamily: "monospace" }}>
                                    {String(contact.id).padStart(5, "0")}
                                </TableCell>

                                {/* Company Name */}
                                <TableCell sx={{ fontWeight: 500 }}>
                                    {contact.companyName || "—"}
                                </TableCell>

                                {/* Station Code */}
                                <TableCell sx={{ color: "#64748b" }}>
                                    {contact.stationCode || "—"}
                                </TableCell>

                                {/* Email */}
                                <TableCell sx={{ color: "#475569" }}>
                                    {contact.email || "—"}
                                </TableCell>

                                {/* Phone */}
                                <TableCell sx={{ color: "#475569" }}>
                                    {contact.phone || "—"}
                                </TableCell>

                                {/* Country */}
                                <TableCell sx={{ color: "#64748b" }}>
                                    {contact.country || "—"}
                                </TableCell>

                                {/* Status — placeholder until backend has an isActive field */}
                                <TableCell>
                                    <Chip
                                        label="Active"
                                        size="small"
                                        sx={{
                                            fontSize: "0.68rem",
                                            bgcolor: "rgba(34,197,94,0.10)",
                                            color: "#16a34a",
                                            fontWeight: 600,
                                        }}
                                    />
                                </TableCell>

                                {/* Actions */}
                                <TableCell align="right">
                                    <Box sx={{ display: "flex", gap: 0.25, justifyContent: "flex-end" }}>

                                        {/* View */}
                                        <Tooltip title="View" arrow>
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    navigate(
                                                        `/master/contact-list/contact-view/${contact.id}`
                                                    )
                                                }
                                                sx={{
                                                    color: "#94a3b8",
                                                    p: "4px",
                                                    "&:hover": {
                                                        bgcolor: "rgba(59,130,246,0.06)",
                                                        color: "#2563eb",
                                                    },
                                                }}
                                            >
                                                <VisibilityIcon sx={{ fontSize: "1rem" }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit" arrow>
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    navigate(
                                                        `/master/contact-list/contact-edit/${contact.id}`
                                                    )
                                                }
                                                sx={{
                                                    color: "#94a3b8",
                                                    p: "4px",
                                                    "&:hover": {
                                                        bgcolor: "rgba(198,40,40,0.06)",
                                                        color: "#006affff",
                                                    },
                                                }}
                                            >
                                                <EditIcon sx={{ fontSize: "1rem" }} />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Delete" arrow>
                                            <IconButton
                                                size="small"
                                                onClick={() => onDelete?.(contact)}
                                                sx={{
                                                    color: "#94a3b8",
                                                    p: "4px",
                                                    "&:hover": {
                                                        bgcolor: "rgba(239,68,68,0.06)",
                                                        color: "#ef4444",
                                                    },
                                                }}
                                            >
                                                <DeleteIcon sx={{ fontSize: "1rem" }} />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="More" arrow>
                                            <IconButton
                                                size="small"
                                                sx={{
                                                    color: "#94a3b8",
                                                    p: "4px",
                                                    "&:hover": {
                                                        bgcolor: "rgba(100,116,139,0.06)",
                                                        color: "#64748b",
                                                    },
                                                }}
                                            >
                                                <MoreVertIcon sx={{ fontSize: "1rem" }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}))
                    }
                </TableBody>

                {/* Footer — row count summary */}
                {filtered.length > 0 && (
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={9}>
                                <Typography variant="caption" color="text.secondary">
                                    Showing {filtered.length} of {contacts.length} contact
                                    {contacts.length !== 1 ? "s" : ""}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                )}
            </Table>
        </TableContainer>
            </Box>
    );
}
