import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Checkbox, Button, Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, Switch } from "@mui/material";
import type { Cargo } from "../types/cargo.types";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

const demoData: Cargo[] = [
    { id: 1, cargo_name: "Electronics", description: "Consumer electronics, computers, and related equipment", hsv_code: "8543", active: true },
    { id: 2, cargo_name: "Textiles", description: "Clothing, garments, and raw fabric materials", hsv_code: "5208", active: true },
    { id: 3, cargo_name: "Automotive Parts", description: "Spare parts, engine components for vehicles", hsv_code: "8708", active: true },
    { id: 4, cargo_name: "Chemicals", description: "Industrial and commercial grade chemicals", hsv_code: "2801", active: false },
    { id: 5, cargo_name: "Heavy Machinery", description: "Construction equipment and large machinery", hsv_code: "8429", active: true }
];

const TOTAL_COLUMNS = 6;

interface CargoIndexTableProps {
    onEdit: (cargo: Cargo) => void;
}

export default function CargoIndexTable({ onEdit }: CargoIndexTableProps) {
    const [rows, setRows] = useState<Cargo[]>(demoData);
    const [page, setPage] = useState(0);

    const [selected, setSelected] = useState<number[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleDelete = (id: number) => {
        setRows((prev) => prev.filter((row) => row.id !== id));
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    const handleActiveChange = (id: number, active: boolean) => {
        setRows((prev) =>
            prev.map((row) => (row.id === id ? { ...row, active } : row))
        );
    };

    const paginated = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const currentPageIds = paginated.map((cargo) => cargo.id);
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

    return (
        <Box>
            {selected.length > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1, mb: 1, bgcolor: "action.hover", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>{selected.length} items selected</Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<FileDownloadOutlinedIcon />}
                            onClick={handleExport}
                            color="success"
                            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 2.5 }}>Export Excel</Button>
                        <Button variant="contained" size="small" color="secondary" startIcon={<FileDownloadOutlinedIcon />} onClick={handleExport} sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 2.5 }}>Export PDF</Button>
                    </Box>
                </Box>
            )}
            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: "8px 8px 16px 16px", border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox" sx={{ pl: 1.5 }}><Checkbox size="small" color="primary" indeterminate={someOnPageSelected} checked={allOnPageSelected} onChange={handleSelectAll} /></TableCell>
                            <TableCell sx={{ whiteSpace: "nowrap" as const }}>Cargo Name</TableCell>
                            <TableCell sx={{ whiteSpace: "nowrap" as const }}>Description</TableCell>
                            <TableCell sx={{ whiteSpace: "nowrap" as const }}>HSV Code</TableCell>
                            <TableCell sx={{ whiteSpace: "nowrap" as const }} align="center">Active</TableCell>
                            <TableCell sx={{ whiteSpace: "nowrap" as const, textAlign: "right" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginated.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={TOTAL_COLUMNS} sx={{ textAlign: "center", py: 5 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No cargo records found.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginated.map((item) => (
                                <TableRow key={item.id} hover selected={selected.includes(item.id)}>
                                    <TableCell padding="checkbox" sx={{ pl: 1.5 }}>
                                        <Checkbox size="small" color="primary" checked={selected.includes(item.id)} onChange={() => handleSelectRow(item.id)} />
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>{item.cargo_name}</TableCell>
                                    <TableCell sx={{ color: "text.secondary" }}>{item.description}</TableCell>
                                    <TableCell sx={{ color: "text.secondary" }}>{item.hsv_code}</TableCell>
                                    <TableCell align="center">
                                        <Switch size="small" color="success" checked={item.active} onChange={(e) => handleActiveChange(item.id, e.target.checked)} />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: "right" }}>
                                        <Box sx={{ display: "flex", gap: 0.25, justifyContent: "flex-end", alignItems: "center" }}>
                                            <IconButton size="small" color="primary" aria-label="edit" onClick={() => onEdit(item)}>
                                                <EditIcon fontSize="small" />
                                                <Typography variant="caption" sx={{ ml: 0.5 }}>Edit</Typography>
                                            </IconButton>
                                            <IconButton size="small" color="error" aria-label="delete" onClick={() => handleDelete(item.id)}>
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
                <TablePagination component="div" count={rows.length} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} rowsPerPageOptions={[5, 10, 15, 25, 50, 100]} sx={{ borderTop: "1px solid", borderColor: "divider" }} />
            </TableContainer>
        </Box>
    );
}
