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
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1, mb: 1, bgcolor: "rgba(198,40,40,0.06)", borderRadius: 2, border: "1px solid rgba(198,40,40,0.15)" }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#C62828" }}>{selected.length} items selected</Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button 
                            variant="contained" 
                            size="small" 
                            startIcon={<FileDownloadOutlinedIcon />} 
                            onClick={handleExport} 
                            color="success" 
                            sx={{ color: "#fff", textTransform: "none", fontWeight: 600, borderRadius: 2, px: 2.5, boxShadow: "0 3px 10px rgba(198,40,40,0.3)" }}>Export Excel</Button>
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
                        }}>
                        <TableCell padding="checkbox" sx={{ pl: 1.5 }}><Checkbox size="small" indeterminate={someOnPageSelected} checked={allOnPageSelected} onChange={handleSelectAll} sx={{ color: "#94a3b8", "&.Mui-checked, &.MuiCheckbox-indeterminate": { color: "#C62828" } }} /></TableCell>
                        <TableCell>Cargo Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>HSV Code</TableCell>
                        <TableCell align="center">Active</TableCell>
                        <TableCell sx={{ textAlign: "right" }}>Actions</TableCell>
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
                            <TableRow key={item.id} hover>
                                <TableCell padding="checkbox" sx={{ pl: 1.5 }}>
                                    <Checkbox
                                        size="small"
                                        checked={selected.includes(item.id)}
                                        onChange={() => handleSelectRow(item.id)}
                                    />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>{item.cargo_name}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>{item.hsv_code}</TableCell>
                                <TableCell align="center">
                                    <Switch
                                        size="small"
                                        color="success"
                                        checked={item.active}
                                        onChange={(e) => handleActiveChange(item.id, e.target.checked)}
                                    />
                                </TableCell>
                                <TableCell sx={{ textAlign: "right" }}>
                                    <Box sx={{ display: "flex", gap: 0.25, justifyContent: "flex-end" }}>
                                        <IconButton
                                            size="small"
                                            aria-label="edit"
                                            onClick={() => onEdit(item)}
                                            sx={{
                                                color: "#94a3b8",
                                                p: "4px",
                                                "&:hover": {
                                                    bgcolor: "rgba(198,40,40,0.06)",
                                                    color: "#006affff",
                                                },
                                            }}
                                        >
                                            <EditIcon fontSize="small" />
                                            <label style={{ fontSize: "12px", color: "#006affff", marginLeft: "2px" }}>Edit</label>
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            aria-label="delete"
                                            onClick={() => handleDelete(item.id)}
                                            sx={{
                                                color: "#94a3b8",
                                                p: "4px",
                                                "&:hover": {
                                                    bgcolor: "rgba(198,40,40,0.06)",
                                                    color: "#ff0019ff",
                                                },
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                            <label style={{ fontSize: "12px", color: "#ff0019ff", marginLeft: "2px" }}>Delete</label>
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
                    borderTop: "1px solid #e2e8f0",
                    bgcolor: "#fafbfd",
                }}
            />
        </TableContainer>
            </Box>
    );
}
