import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { useEffect, useMemo, useState } from "react";
import {
    Checkbox,
    Button,
    Alert,
    Avatar,
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

import { getUsers } from "../services/user.service";
import type { User } from "../types/user.types";
import type { UserFilters } from "./Filter";

/* ── chip helpers ── */
const statusChipSx = (isActive: number) =>
    isActive === 1
        ? {
            bgcolor: "rgba(16,185,129,0.10)",
            color: "#059669",
            fontWeight: 600,
            fontSize: "0.7rem",
            height: 22,
        }
        : {
            bgcolor: "rgba(100,116,139,0.08)",
            color: "#94a3b8",
            fontWeight: 600,
            fontSize: "0.7rem",
            height: 22,
        };

const roleChipSx = (role: string) => {
    const map: Record<string, { bg: string; fg: string }> = {
        SuperAdmin: { bg: "rgba(198,40,40,0.10)", fg: "#C62828" },
        Employee: { bg: "rgba(59,130,246,0.10)", fg: "#2563eb" },
        Client: { bg: "rgba(245,158,11,0.10)", fg: "#d97706" },
        Vendor: { bg: "rgba(168,85,247,0.10)", fg: "#9333ea" },
    };
    const c = map[role] ?? { bg: "rgba(100,116,139,0.08)", fg: "#64748b" };
    return {
        bgcolor: c.bg,
        color: c.fg,
        fontWeight: 600,
        fontSize: "0.7rem",
        height: 22,
    };
};

/* ── shared cell style ── */
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

interface UserTableProps {
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    filters: UserFilters;
}

export default function UserTable({ onEdit, onDelete, filters }: UserTableProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);
                const data = await getUsers();
                setUsers(data);
            } catch (error) {
                console.error(error);
                setError("Failed to load users.");
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, []);

    /*
     * ── Client-side filtering ──
     * Filters are applied in order: search → status → role
     * - search : case-insensitive partial match on `name` OR `email`
     * - status : "active" / "inactive" (empty = all)
     * - role   : exact match against user.role (empty = all)
     * Recalculated via useMemo whenever `users` or `filters` change.
     */
    const filteredUsers = useMemo(() => {
        let result = users;

        // Search by name or email
        if (filters.search.trim()) {
            const q = filters.search.toLowerCase().trim();
            result = result.filter(
                (u) =>
                    u.name.toLowerCase().includes(q) ||
                    u.email.toLowerCase().includes(q)
            );
        }

        // Filter by status
        if (filters.status === "active") {
            result = result.filter((u) => u.isActive);
        } else if (filters.status === "inactive") {
            result = result.filter((u) => !u.isActive);
        }

        // Filter by role
        if (filters.role) {
            result = result.filter(
                (u) => u.role.toLowerCase() === filters.role.toLowerCase()
            );
        }

        return result;
    }, [users, filters]);

    const [selected, setSelected] = useState<number[]>([]);

    const currentPageIds = filteredUsers.map((user) => user.id);
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

    if (loading) {
        return (
            <Paper sx={{ p: 5, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
            </Paper>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

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
                {/* ── Header ── */}
                <TableHead>
                    <TableRow
                        sx={{
                            background:
                                "linear-gradient(135deg, #fafbfd 0%, #f1f5f9 100%)",
                            borderBottom: "2px solid rgba(198,40,40,0.15)",
                        }}
                    >
                        <TableCell padding="checkbox" sx={{ pl: 1.5 }}><Checkbox size="small" indeterminate={someOnPageSelected} checked={allOnPageSelected} onChange={handleSelectAll} sx={{ color: "#94a3b8", "&.Mui-checked, &.MuiCheckbox-indeterminate": { color: "#C62828" } }} /></TableCell>
<TableCell sx={headCellSx}>User</TableCell>
                        <TableCell sx={headCellSx}>Email</TableCell>
                        <TableCell sx={headCellSx}>Role</TableCell>
                        <TableCell sx={headCellSx}>Status</TableCell>
                        <TableCell sx={{ ...headCellSx, textAlign: "right" }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>

                {/* ── Body ── */}
                <TableBody>
                    {filteredUsers.map((user) => {
        const isSelected = selected.includes(user.id);
        return (
            <TableRow
                            key={user.id}
                            hover
                            selected={isSelected}
                            sx={{ ...rowHoverSx, ...(isSelected && { bgcolor: "rgba(198,40,40,0.04) !important" }) }}
                        >
                <TableCell padding="checkbox" sx={{ pl: 1.5 }}><Checkbox size="small" checked={isSelected} onChange={() => handleSelectRow(user.id)} sx={{ color: "#94a3b8", "&.Mui-checked": { color: "#C62828" } }} /></TableCell>
                            {/* Avatar + Name */}
                            <TableCell>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    <Avatar
                                        src={
                                            user.avatar
                                                ? `http://localhost:3000/${user.avatar}`
                                                : undefined
                                        }
                                        sx={{
                                            width: 28,
                                            height: 28,
                                            bgcolor: "#C62828",
                                            fontSize: "0.72rem",
                                            fontWeight: 700,
                                        }}
                                    >
                                        {user.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: "0.82rem",
                                            color: "#1e293b",
                                        }}
                                    >
                                        {user.name}
                                    </Typography>
                                </Box>
                            </TableCell>

                            {/* Email */}
                            <TableCell>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "text.secondary",
                                        fontSize: "0.8rem",
                                    }}
                                >
                                    {user.email}
                                </Typography>
                            </TableCell>

                            {/* Role chip */}
                            <TableCell>
                                <Chip
                                    label={user.role}
                                    size="small"
                                    sx={roleChipSx(user.role)}
                                />
                            </TableCell>

                            {/* Status chip */}
                            <TableCell>
                                <Chip
                                    label={
                                        user.isActive ? "Active" : "Inactive"
                                    }
                                    size="small"
                                    icon={
                                        <Box
                                            sx={{
                                                width: 6,
                                                height: 6,
                                                borderRadius: "50%",
                                                bgcolor: user.isActive
                                                    ? "#10b981"
                                                    : "#94a3b8",
                                                ml: 0.8,
                                            }}
                                        />
                                    }
                                    sx={statusChipSx(user.isActive ? 1 : 0)}
                                />
                            </TableCell>

                            {/* Actions */}
                            <TableCell align="right">
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 0.25,
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <Tooltip title="Edit" arrow>
                                        <IconButton
                                            size="small"
                                            onClick={() => onEdit(user)}
                                            sx={{
                                                color: "#94a3b8",
                                                p: "4px",
                                                "&:hover": {
                                                    bgcolor:
                                                        "rgba(198,40,40,0.06)",
                                                    color: "#006affff",
                                                },
                                            }}
                                        >
                                            <EditIcon
                                                sx={{ fontSize: "1rem" }}
                                            />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Delete" arrow>
                                        <IconButton
                                            size="small"
                                            onClick={() => onDelete(user)}
                                            sx={{
                                                color: "#94a3b8",
                                                p: "4px",
                                                "&:hover": {
                                                    bgcolor:
                                                        "rgba(239,68,68,0.06)",
                                                    color: "#ef4444",
                                                },
                                            }}
                                        >
                                            <DeleteIcon
                                                sx={{ fontSize: "1rem" }}
                                            />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="More" arrow>
                                        <IconButton
                                            size="small"
                                            sx={{
                                                color: "#94a3b8",
                                                p: "4px",
                                                "&:hover": {
                                                    bgcolor:
                                                        "rgba(100,116,139,0.06)",
                                                    color: "#64748b",
                                                },
                                            }}
                                        >
                                            <MoreVertIcon
                                                sx={{ fontSize: "1rem" }}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </TableCell>
                        </TableRow>
                        );
                    })}
                </TableBody>

                {/* ── Footer ── */}
                <TableFooter>
                    <TableRow>
                        <TableCell
                            colSpan={5}
                            sx={{
                                py: 1,
                                borderBottom: 0,
                                bgcolor: "rgba(248,250,252,0.5)",
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "text.secondary",
                                    fontWeight: 500,
                                    letterSpacing: "0.2px",
                                }}
                            >
                                Showing {filteredUsers.length} of {users.length} users
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
            </Box>
    );
}