import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Checkbox, Button, Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, Switch } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { GLCodeChildren } from "../types/glCodeChildren.types";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useState } from "react";

const demoData: GLCodeChildren[] = [
    { id: 1, glCodeParentId: 1, name: "sales revenue", code: "1000", active: true },
    { id: 2, glCodeParentId: 1, name: "Cost of goods sold", code: "2000", active: true },
    { id: 3, glCodeParentId: 1, name: "personal", code: "3000", active: true },
    { id: 4, glCodeParentId: 1, name: "client Expenses", code: "4000", active: true },
    { id: 5, glCodeParentId: 1, name: "Legal & Compliance", code: "5000", active: true },
];

const TOTAL_COLUMNS = 6;

const headCellSx = {
    whiteSpace: "nowrap" as const,
};

interface GLCodeChildrenIndexTableProps {
    onEdit: (glCode: GLCodeChildren) => void;
}

export default function GLCodeChildrenIndexTable({ onEdit }: GLCodeChildrenIndexTableProps) {
    const [rows, setRows] = useState<GLCodeChildren[]>(demoData);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selected, setSelected] = useState<number[]>([]);
    const [deleteTarget, setDeleteTarget] = useState<GLCodeChildren | null>(null);

    const handleConfirmDelete = () => {
        if (!deleteTarget) return;
        const nextRows = rows.filter((row) => row.id !== deleteTarget.id);
        setRows(nextRows);
        setSelected((prev) => prev.filter((id) => id !== deleteTarget.id));
        setPage((currentPage) =>
            currentPage > 0 && currentPage * rowsPerPage >= nextRows.length
                ? currentPage - 1
                : currentPage,
        );
        setDeleteTarget(null);
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    const paginated = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const currentPageIds = paginated.map((row) => row.id);
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
            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: "8px 8px 16px 16px", border: "1px solid", borderColor: "divider", overflowX: "auto", overflowY: "hidden", mt: 2 }}>
                <Table size="small" sx={{ minWidth: { xs: 760, sm: "100%" } }}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox" sx={{ pl: 1.5 }}><Checkbox size="small" color="primary" indeterminate={someOnPageSelected} checked={allOnPageSelected} onChange={handleSelectAll} /></TableCell>
                            <TableCell sx={headCellSx}>GL Code Parent</TableCell>
                            <TableCell sx={headCellSx}>Name</TableCell>
                            <TableCell sx={headCellSx}>Code</TableCell>
                            <TableCell sx={headCellSx} align="center">Active</TableCell>
                            <TableCell sx={{ ...headCellSx, textAlign: "right" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginated.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={TOTAL_COLUMNS} sx={{ textAlign: "center", py: 5 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No GL Codes found.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginated.map((row) => (
                                <TableRow key={row.id} hover selected={selected.includes(row.id)}>
                                    <TableCell padding="checkbox" sx={{ pl: 1.5 }}><Checkbox size="small" color="primary" checked={selected.includes(row.id)} onChange={() => handleSelectRow(row.id)} /></TableCell>
                                    <TableCell sx={{ color: "text.primary" }}>{row.glCodeParentId}</TableCell>
                                    <TableCell sx={{ color: "text.primary" }}>{row.name}</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>{row.code}</TableCell>
                                    <TableCell align="center">
                                        <Switch size="small" color="success" checked={row.active} onChange={(e) => handleActiveChange(row.id, e.target.checked)} />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: "right" }}>
                                        <Box sx={{ display: "flex", gap: 0.25, justifyContent: "flex-end", alignItems: "center" }}>
                                            <IconButton size="small" color="primary" aria-label="edit" onClick={() => onEdit(row)}>
                                                <EditIcon fontSize="small" />
                                                <Typography variant="caption" sx={{ ml: 0.5 }}>Edit</Typography>
                                            </IconButton>
                                            <IconButton size="small" color="error" aria-label="delete" onClick={() => setDeleteTarget(row)}>
                                                <DeleteIcon fontSize="small" />
                                                <Typography variant="caption" sx={{ ml: 0.5 }}>Delete</Typography>
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <TablePagination component="div" count={rows.length} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} rowsPerPageOptions={[5, 10, 15, 25, 50, 100]} sx={{ borderTop: "1px solid", borderColor: "divider", "& .MuiTablePagination-toolbar": { px: { xs: 1, sm: 2 }, flexWrap: { xs: "wrap", sm: "nowrap" }, justifyContent: { xs: "center", sm: "flex-end" } }, "& .MuiTablePagination-selectLabel": { display: { xs: "none", sm: "block" } } }} />
            </TableContainer>
            <Dialog
                open={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                aria-labelledby="delete-gl-child-title"
                aria-describedby="delete-gl-child-description"
                fullWidth
                maxWidth="xs"
                slotProps={{ paper: { sx: { borderRadius: 3, p: 1, boxShadow: (theme) => theme.shadows[10] } } }}
            >
                <DialogTitle
                    id="delete-gl-child-title"
                    component="div"
                    sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, pt: 3, pb: 1 }}
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
                    <Typography variant="h6" component="h2" fontWeight={700}>Delete GL code child?</Typography>
                </DialogTitle>
                <DialogContent sx={{ textAlign: "center", pb: 1 }}>
                    <Typography id="delete-gl-child-description" variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        Are you sure you want to delete{" "}
                        {deleteTarget?.name ? (
                            <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
                                “{deleteTarget.name}”
                            </Box>
                        ) : (
                            "this GL code"
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
                        sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, borderColor: "divider" }}
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
