import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Checkbox, Button, Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, Switch } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { Currency } from "../types/currency.types";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useState } from "react";

const demoData: Currency[] = [
    { id: 1, code: "USD", country: "United States", currency: "US Dollar", symbol: "$", active: true, conversion_rate: 1.00 },
    { id: 2, code: "INR", country: "India", currency: "Indian Rupee", symbol: "₹", active: true, conversion_rate: 83.50 },
    { id: 3, code: "EUR", country: "Eurozone", currency: "Euro", symbol: "€", active: true, conversion_rate: 0.92 },
    { id: 4, code: "GBP", country: "United Kingdom", currency: "British Pound", symbol: "£", active: false, conversion_rate: 0.79 },
    { id: 5, code: "AED", country: "United Arab Emirates", currency: "UAE Dirham", symbol: "د.إ", active: true, conversion_rate: 3.67 }
];

const headCellSx = {
    whiteSpace: "nowrap" as const,
};

const TOTAL_COLUMNS = 8;

interface CurrencyIndexTableProps {
    onEdit: (currency: Currency) => void;
}

export default function CurrencyIndexTable({ onEdit }: CurrencyIndexTableProps) {
    const [rows, setRows] = useState<Currency[]>(demoData);
    const [page, setPage] = useState(0);
    const [deleteTarget, setDeleteTarget] = useState<Currency | null>(null);

    const [selected, setSelected] = useState<number[]>([]);

    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    const paginated = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const currentPageIds = paginated.map((currency) => currency.id);
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

    const handleConfirmDelete = () => {
        if (!deleteTarget) return;
        setRows((prev) => prev.filter((row) => row.id !== deleteTarget.id));
        setSelected((prev) => prev.filter((id) => id !== deleteTarget.id));
        if (paginated.length === 1 && page > 0) setPage((current) => current - 1);
        setDeleteTarget(null);
    };

        const handleActiveChange = (id: number, active: boolean) => {
            setRows((prev) =>
                prev.map((row) => (row.id === id ? { ...row, active } : row))
            );
        }

    return (
        <Box>
            {selected.length > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1, mb: 1, bgcolor: "action.hover", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>{selected.length} items selected</Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "flex-end" }}>
                        <Button variant="contained" size="small" color="success" startIcon={<FileDownloadOutlinedIcon />} onClick={handleExport} sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 2.5 }}>Export Excel</Button>
                        <Button variant="contained" size="small" color="secondary" startIcon={<FileDownloadOutlinedIcon />} onClick={handleExport} sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 2.5 }}>Export PDF</Button>
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
                <Table size="small" stickyHeader sx={{ minWidth: { xs: 900, sm: "100%" } }}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox" sx={{ pl: 1.5 }}>
                                <Checkbox size="small" color="primary" indeterminate={someOnPageSelected} checked={allOnPageSelected} onChange={handleSelectAll} />
                            </TableCell>
                            <TableCell sx={headCellSx}>Code</TableCell>
                            <TableCell sx={headCellSx}>Currency</TableCell>
                            <TableCell sx={headCellSx}>Symbol</TableCell>
                            <TableCell sx={headCellSx}>Country</TableCell>
                            <TableCell sx={headCellSx}>Conversion Rate</TableCell>
                            <TableCell sx={headCellSx} align="center">Active</TableCell>
                            <TableCell sx={{ ...headCellSx, textAlign: "right" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginated.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={TOTAL_COLUMNS} sx={{ textAlign: "center", py: 5 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No currencies found.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginated.map((cur) => (
                                <TableRow key={cur.id} hover selected={selected.includes(cur.id)}>
                                    <TableCell padding="checkbox" sx={{ pl: 1.5 }}>
                                        <Checkbox
                                            size="small"
                                            color="primary"
                                            checked={selected.includes(cur.id)}
                                            onChange={() => handleSelectRow(cur.id)}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>{cur.code}</TableCell>
                                    <TableCell sx={{ color: "text.secondary" }}>{cur.currency}</TableCell>
                                    <TableCell sx={{ color: "text.secondary" }}>{cur.symbol}</TableCell>
                                    <TableCell sx={{ color: "text.secondary" }}>{cur.country}</TableCell>
                                    <TableCell sx={{ color: "text.secondary" }}>{cur.conversion_rate}</TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            size="small"
                                            color="success"
                                            checked={cur.active}
                                            onChange={(e) => handleActiveChange(cur.id, e.target.checked)}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: "right" }}>
                                        <Box sx={{ display: "flex", gap: 0.25, justifyContent: "flex-end", alignItems: "center" }}>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                aria-label="edit"
                                                onClick={() => onEdit(cur)}
                                            >
                                                <EditIcon fontSize="small" />
                                                <Typography variant="caption" sx={{ ml: 0.5 }}>Edit</Typography>
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                aria-label="delete"
                                                onClick={() => setDeleteTarget(cur)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                                <Typography variant="caption" sx={{ ml: 0.5 }}>Delete</Typography>
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )))
                        }
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={rows.length}
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
                aria-labelledby="delete-currency-title"
                aria-describedby="delete-currency-description"
                fullWidth
                maxWidth="xs"
                slotProps={{ paper: { sx: { borderRadius: 3, p: 1, boxShadow: (theme) => theme.shadows[10] } } }}
            >
                <DialogTitle id="delete-currency-title" component="div" sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, pt: 3, pb: 1 }}>
                    <Box sx={(theme) => ({ width: 64, height: 64, borderRadius: "50%", display: "grid", placeItems: "center", bgcolor: alpha(theme.palette.error.main, 0.12), color: "error.main", boxShadow: `0 0 0 8px ${alpha(theme.palette.error.main, 0.06)}` })}>
                        <DeleteOutlinedIcon sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="h6" component="h2" fontWeight={700}>Delete currency?</Typography>
                </DialogTitle>

                <DialogContent sx={{ textAlign: "center", pb: 1 }}>
                    <Typography id="delete-currency-description" variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        Are you sure you want to delete{" "}
                        {deleteTarget?.currency ? <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>“{deleteTarget.currency}”</Box> : "this currency"}?
                        {" "}This action cannot be undone.
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ px: 3, pt: 2, pb: 3, gap: 1.5 }}>
                    <Button onClick={() => setDeleteTarget(null)} variant="outlined" color="inherit" fullWidth sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, borderColor: "divider" }}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" fullWidth autoFocus disableElevation sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
