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
    TableHead,
    TablePagination,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { useState } from "react";
import type { Vendor } from "../types/vendor.types";
import type { VendorsFilters } from "./Filter";

// ── Styles (matching Vessel table) ────────────────────────────────────────────
const headCellSx = {
    fontWeight: 700,
    color: "#C62828",
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

// ── Demo data ─────────────────────────────────────────────────────────────────
const DEMO_VENDORS: Vendor[] = [
    { id: 1, vendorName: "Al Futtaim Logistics", currency: "AED", paymentTerm: "30 Days", isActive: true },
    { id: 2, vendorName: "Gulf Agency Company", currency: "USD", paymentTerm: "COD", isActive: true },
    { id: 3, vendorName: "Agility Global", currency: "USD", paymentTerm: "60 Days", isActive: false },
    { id: 4, vendorName: "DP World Services", currency: "AED", paymentTerm: "15 Days", isActive: true },
    { id: 5, vendorName: "Aramex Freight", currency: "EUR", paymentTerm: "30 Days", isActive: true },
    { id: 6, vendorName: "Kuehne + Nagel ME", currency: "USD", paymentTerm: "10 Days", isActive: true },
    { id: 7, vendorName: "DB Schenker UAE", currency: "AED", paymentTerm: "COD", isActive: false },
    { id: 8, vendorName: "Tristar Transport", currency: "AED", paymentTerm: "30 Days", isActive: true },
];

interface VendorsIndexTableProps {
    filters?: VendorsFilters;
    onEdit: (vendor: Vendor) => void;
}

export default function VendorsListTable({ filters, onEdit }: VendorsIndexTableProps) {
    // ── State ─────────────────────────────────────────────────────────────────
    const [vendors, setVendors] = useState<Vendor[]>(DEMO_VENDORS);
    const [selected, setSelected] = useState<number[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);

    // ── Client-side filter ────────────────────────────────────────────────────
    const filtered = vendors.filter((v) => {
        const search = filters?.search?.toLowerCase() ?? "";
        const searchMatch =
            !search ||
            v.vendorName.toLowerCase().includes(search) ||
            v.currency.toLowerCase().includes(search) ||
            v.paymentTerm.toLowerCase().includes(search);
        return searchMatch;
    });

    // ── Paginated slice ───────────────────────────────────────────────────────
    const paginatedVendors = filtered.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
    );

    // ── Selection helpers ─────────────────────────────────────────────────────
    const currentPageIds = paginatedVendors.map((v) => v.id);
    const allOnPageSelected =
        currentPageIds.length > 0 && currentPageIds.every((id) => selected.includes(id));
    const someOnPageSelected =
        currentPageIds.some((id) => selected.includes(id)) && !allOnPageSelected;

    const handleSelectAll = () => {
        if (allOnPageSelected) {
            setSelected((prev) => prev.filter((id) => !currentPageIds.includes(id)));
        } else {
            setSelected((prev) => [...new Set([...prev, ...currentPageIds])]);
        }
    };

    const handleSelectRow = (id: number) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
        );
    };

    // ── Toggle active ─────────────────────────────────────────────────────────
    const handleToggleActive = (id: number) => {
        setVendors((prev) =>
            prev.map((v) => (v.id === id ? { ...v, isActive: !v.isActive } : v)),
        );
    };

    // ── Delete handler ────────────────────────────────────────────────────────
    const handleDelete = (id: number) => {
        setVendors((prev) => prev.filter((v) => v.id !== id));
        setSelected((prev) => prev.filter((sid) => sid !== id));
    };

    // ── Export handler (placeholder) ──────────────────────────────────────────
    const handleExport = () => {
        const selectedVendors = vendors.filter((v) => selected.includes(v.id));
        console.log("Exporting vendors:", selectedVendors);
        alert(`Exporting ${selectedVendors.length} vendor(s)`);
    };

    // ── Pagination handlers ───────────────────────────────────────────────────
    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    const TOTAL_COLUMNS = 7; // checkbox + 4 data cols + active + actions

    // ── Table ─────────────────────────────────────────────────────────────────
    return (
        <Box>
            {/* ── Export bar (visible when rows are selected) ─────────────── */}
            {selected.length > 0 && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 2,
                        py: 1,
                        mb: 1,
                        bgcolor: "rgba(198,40,40,0.06)",
                        borderRadius: 2,
                        border: "1px solid rgba(198,40,40,0.15)",
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#C62828" }}>
                        {selected.length} vendor{selected.length > 1 ? "s" : ""} selected
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<FileDownloadOutlinedIcon />}
                            onClick={handleExport}
                            color="success"
                            sx={{
                                color: "#fff",
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: 2,
                                px: 2.5,
                                boxShadow: "0 3px 10px rgba(198,40,40,0.3)",
                            }}
                        >
                            Export Excel
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<FileDownloadOutlinedIcon />}
                            onClick={handleExport}

                            sx={{
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: 2,
                                px: 2.5,
                                boxShadow: "0 3px 16px rgba(198,40,40,0.4)",
                            }}
                        >
                            Export PDF
                        </Button>
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
                    {/* ── Head ──────────────────────────────────────────────── */}
                    <TableHead>
                        <TableRow
                            sx={{
                                background: "linear-gradient(135deg, #fafbfd 0%, #f1f5f9 100%)",
                                borderBottom: "2px solid rgba(198,40,40,0.15)",
                            }}
                        >
                            {/* Select-all checkbox */}
                            <TableCell padding="checkbox" sx={{ pl: 1.5 }}>
                                <Checkbox
                                    size="small"
                                    indeterminate={someOnPageSelected}
                                    checked={allOnPageSelected}
                                    onChange={handleSelectAll}
                                    sx={{
                                        color: "#94a3b8",
                                        "&.Mui-checked, &.MuiCheckbox-indeterminate": {
                                            color: "#C62828",
                                        },
                                    }}
                                />
                            </TableCell>
                            <TableCell sx={headCellSx}>Vendor Name</TableCell>
                            <TableCell sx={headCellSx}>Currency</TableCell>
                            <TableCell sx={headCellSx}>Payment Term</TableCell>
                            <TableCell sx={headCellSx}>Status</TableCell>
                            <TableCell sx={{ ...headCellSx, textAlign: "right" }}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    {/* ── Body ──────────────────────────────────────────────── */}
                    <TableBody>
                        {paginatedVendors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={TOTAL_COLUMNS} sx={{ textAlign: "center", py: 5 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No vendors found.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedVendors.map((vendor) => {
                                const isSelected = selected.includes(vendor.id);
                                return (
                                    <TableRow
                                        key={vendor.id}
                                        hover
                                        selected={isSelected}
                                        sx={{
                                            ...rowHoverSx,
                                            ...(isSelected && {
                                                bgcolor: "rgba(198,40,40,0.04) !important",
                                            }),
                                        }}
                                    >
                                        {/* Row checkbox */}
                                        <TableCell padding="checkbox" sx={{ pl: 1.5 }}>
                                            <Checkbox
                                                size="small"
                                                checked={isSelected}
                                                onChange={() => handleSelectRow(vendor.id)}
                                                sx={{
                                                    color: "#94a3b8",
                                                    "&.Mui-checked": { color: "#C62828" },
                                                }}
                                            />
                                        </TableCell>

                                        {/* Vendor Name */}
                                        <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>
                                            {vendor.vendorName}
                                        </TableCell>

                                        {/* Currency */}
                                        <TableCell sx={{ color: "#475569" }}>
                                            {vendor.currency}
                                        </TableCell>

                                        {/* Payment Term */}
                                        <TableCell>
                                            <Chip
                                                label={vendor.paymentTerm}
                                                size="small"
                                                sx={{
                                                    fontWeight: 500,
                                                    fontSize: "0.75rem",
                                                    bgcolor: "rgba(198,40,40,0.08)",
                                                    color: "#C62828",
                                                }}
                                            />
                                        </TableCell>

                                        {/* Active toggle */}
                                        <TableCell>
                                            <Switch
                                                size="small"
                                                checked={vendor.isActive}
                                                onChange={() => handleToggleActive(vendor.id)}
                                                color="success"
                                            />
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell align="right">
                                            <Box sx={{ display: "flex", gap: 0.25, justifyContent: "flex-end" }}>
                                                <Tooltip title="Edit" arrow>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => onEdit(vendor)}
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
                                                        onClick={() => handleDelete(vendor.id)}
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
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>

                {/* ── Pagination ────────────────────────────────────────────── */}
                <TablePagination
                    component="div"
                    count={filtered.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 15, 25, 50, 100]}
                    sx={{
                        borderTop: "1px solid",
                        borderColor: "divider",
                        ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                            fontSize: "0.8rem",
                            color: "#64748b",
                        },
                        ".MuiTablePagination-actions button": {
                            color: "#C62828",
                        },
                    }}
                />
            </TableContainer>
        </Box>
    );
}