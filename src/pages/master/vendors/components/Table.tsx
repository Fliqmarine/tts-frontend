import {
    Box,
    Button,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { alpha } from "@mui/material/styles";
import { useState } from "react";
import type { Vendor } from "../types/vendor.types";
import type { VendorsFilters } from "./Filter";

const headCellSx = {
    whiteSpace: "nowrap" as const,
};

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
    const [vendors, setVendors] = useState<Vendor[]>(DEMO_VENDORS);
    const [selected, setSelected] = useState<number[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [deleteTarget, setDeleteTarget] = useState<Vendor | null>(null);

    const filtered = vendors.filter((v) => {
        const search = filters?.search?.toLowerCase() ?? "";
        const searchMatch =
            !search ||
            v.vendorName.toLowerCase().includes(search) ||
            v.currency.toLowerCase().includes(search) ||
            v.paymentTerm.toLowerCase().includes(search);
        return searchMatch;
    });

    const paginatedVendors = filtered.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
    );

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

    const handleToggleActive = (id: number) => {
        setVendors((prev) =>
            prev.map((v) => (v.id === id ? { ...v, isActive: !v.isActive } : v)),
        );
    };

    const handleConfirmDelete = () => {
        if (!deleteTarget) return;

        const nextVendors = vendors.filter((vendor) => vendor.id !== deleteTarget.id);
        setVendors(nextVendors);
        setSelected((prev) => prev.filter((id) => id !== deleteTarget.id));
        setPage((currentPage) =>
            currentPage > 0 && currentPage * rowsPerPage >= nextVendors.length
                ? currentPage - 1
                : currentPage,
        );
        setDeleteTarget(null);
    };

    const handleExport = () => {
        const selectedVendors = vendors.filter((v) => selected.includes(v.id));
        console.log("Exporting vendors:", selectedVendors);
        alert(`Exporting ${selectedVendors.length} vendor(s)`);
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    const TOTAL_COLUMNS = 7;

    return (
        <Box>
            {selected.length > 0 && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 2,
                        py: 1,
                        mb: 1,
                        bgcolor: "action.hover",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                        {selected.length} vendor{selected.length > 1 ? "s" : ""} selected
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "flex-end" }}>
                        <Button
                            variant="contained"
                            size="small"
                            color="success"
                            startIcon={<FileDownloadOutlinedIcon />}
                            onClick={handleExport}
                            sx={{
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: 2,
                                px: 2.5,
                            }}
                        >
                            Export Excel
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            color="secondary"
                            startIcon={<FileDownloadOutlinedIcon />}
                            onClick={handleExport}
                            sx={{
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: 2,
                                px: 2.5,
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
                    overflowX: "auto",
                    overflowY: "hidden",
                    mt: 2,
                }}
            >
                <Table size="small" sx={{ minWidth: { xs: 680, sm: "100%" } }}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox" sx={{ pl: 1.5 }}>
                                <Checkbox
                                    size="small"
                                    color="primary"
                                    indeterminate={someOnPageSelected}
                                    checked={allOnPageSelected}
                                    onChange={handleSelectAll}
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
                                    >
                                        <TableCell padding="checkbox" sx={{ pl: 1.5 }}>
                                            <Checkbox
                                                size="small"
                                                color="primary"
                                                checked={isSelected}
                                                onChange={() => handleSelectRow(vendor.id)}
                                            />
                                        </TableCell>

                                        <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                                            {vendor.vendorName}
                                        </TableCell>

                                        <TableCell sx={{ color: "text.secondary" }}>
                                            {vendor.currency}
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={vendor.paymentTerm}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                                sx={{
                                                    fontWeight: 500,
                                                    fontSize: "0.75rem",
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <Switch
                                                size="small"
                                                checked={vendor.isActive}
                                                onChange={() => handleToggleActive(vendor.id)}
                                                color="success"
                                            />
                                        </TableCell>

                                        <TableCell align="right">
                                            <Box sx={{ display: "flex", gap: 0.25, justifyContent: "flex-end" }}>
                                                <Tooltip title="Edit" arrow>
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => onEdit(vendor)}
                                                    >
                                                        <EditIcon sx={{ fontSize: "1rem" }} />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Delete" arrow>
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => setDeleteTarget(vendor)}
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
                        "& .MuiTablePagination-toolbar": {
                            px: { xs: 1, sm: 2 },
                            flexWrap: { xs: "wrap", sm: "nowrap" },
                            justifyContent: { xs: "center", sm: "flex-end" },
                        },
                        "& .MuiTablePagination-selectLabel": {
                            display: { xs: "none", sm: "block" },
                        },
                    }}
                />
            </TableContainer>

            <Dialog
                open={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                aria-labelledby="delete-vendor-title"
                aria-describedby="delete-vendor-description"
                fullWidth
                maxWidth="xs"
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: 3,
                            p: 1,
                            boxShadow: (theme) => theme.shadows[10],
                        },
                    },
                }}
            >
                <DialogTitle
                    id="delete-vendor-title"
                    component="div"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        pt: 3,
                        pb: 1,
                    }}
                >
                    <Box
                        sx={(theme) => ({
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            display: "grid",
                            placeItems: "center",
                            bgcolor: alpha(theme.palette.error.main, 0.12),
                            color: "error.main",
                            boxShadow: `0 0 0 8px ${alpha(theme.palette.error.main, 0.06)}`,
                        })}
                    >
                        <DeleteOutlinedIcon sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="h6" component="h2" fontWeight={700}>
                        Delete vendor?
                    </Typography>
                </DialogTitle>

                <DialogContent sx={{ textAlign: "center", pb: 1 }}>
                    <Typography
                        id="delete-vendor-description"
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1.6 }}
                    >
                        Are you sure you want to delete{" "}
                        {deleteTarget?.vendorName ? (
                            <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
                                “{deleteTarget.vendorName}”
                            </Box>
                        ) : (
                            "this vendor"
                        )}
                        ? This action cannot be undone.
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ px: 3, pt: 2, pb: 3, gap: 1.5 }}>
                    <Button
                        onClick={() => setDeleteTarget(null)}
                        variant="outlined"
                        color="inherit"
                        fullWidth
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 2,
                            borderColor: "divider",
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                        fullWidth
                        autoFocus
                        disableElevation
                        sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
