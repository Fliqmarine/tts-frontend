import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Checkbox, Button, Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, Switch, Snackbar, Alert } from "@mui/material";
import type { Hub } from "../types/hub.types";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useState } from "react";

const demoData: Hub[] = [
    { id: 1, contactCode: "C001", name: "Global Hub NY", stationCode: "NYX1", email: "ny@hub.com", telephoneNo: "+1 212 555 0199", country: "United States", isActive: true },
    { id: 2, contactCode: "C002", name: "Euro Hub Berlin", stationCode: "BER2", email: "berlin@hub.com", telephoneNo: "+49 30 123456", country: "Germany", isActive: true },
    { id: 3, contactCode: "C003", name: "Asia Hub Tokyo", stationCode: "TOK3", email: "tokyo@hub.com", telephoneNo: "+81 3 1234 5678", country: "Japan", isActive: false },
    { id: 4, contactCode: "C004", name: "Middle East Hub Dubai", stationCode: "DXB4", email: "dubai@hub.com", telephoneNo: "+971 4 123 4567", country: "United Arab Emirates", isActive: true },
    { id: 5, contactCode: "C005", name: "UK Hub London", stationCode: "LON5", email: "london@hub.com", telephoneNo: "+44 20 7946 0958", country: "United Kingdom", isActive: true }
];

const TOTAL_COLUMNS = 9;

interface HubIndexTableProps {
    onEdit: (hub: Hub) => void;
}

export default function HubIndexTable({ onEdit }: HubIndexTableProps) {
    const [rows, setRows] = useState<Hub[]>(demoData);
    const [page, setPage] = useState(0);

    const [selected, setSelected] = useState<number[]>([]);

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleDelete = (id: number) => {
        setRows((prev) => prev.filter((row) => row.id !== id));
    };

    const handleCopy = (hub: Hub) => {
        const textToCopy = `Name: ${hub.name}\nContact Code: ${hub.contactCode}\nStation Code: ${hub.stationCode}\nEmail: ${hub.email}\nPhone: ${hub.telephoneNo}\nCountry: ${hub.country}\nActive: ${hub.isActive ? "Yes" : "No"}`;
        navigator.clipboard.writeText(textToCopy);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    const handleActiveChange = (id: number, isActive: boolean) => {
        setRows((prev) =>
            prev.map((row) => (row.id === id ? { ...row, isActive } : row))
        );
    };

    const paginated = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const currentPageIds = paginated.map((hub) => hub.id);
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
        <>
            {selected.length > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1, mb: 1, bgcolor: "rgba(198,40,40,0.06)", borderRadius: 2, border: "1px solid rgba(198,40,40,0.15)" }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#C62828" }}>{selected.length} items selected</Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button variant="contained" size="small" startIcon={<FileDownloadOutlinedIcon />} onClick={handleExport} color="success" sx={{ color: "#fff", textTransform: "none", fontWeight: 600, borderRadius: 2, px: 2.5, boxShadow: "0 3px 10px rgba(198,40,40,0.3)" }}>
                            Export Excel
                        </Button>
                        <Button variant="contained" size="small" startIcon={<FileDownloadOutlinedIcon />} onClick={handleExport} sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 2.5, boxShadow: "0 3px 16px rgba(198,40,40,0.4)" }}>
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
                    <TableHead>
                        <TableRow
                            sx={{
                                background: "linear-gradient(135deg, #fafbfd 0%, #f1f5f9 100%)",
                                borderBottom: "2px solid rgba(198,40,40,0.15)",
                            }}>
                            <TableCell padding="checkbox" sx={{ pl: 1.5 }}><Checkbox size="small" indeterminate={someOnPageSelected} checked={allOnPageSelected} onChange={handleSelectAll} sx={{ color: "#94a3b8", "&.Mui-checked, &.MuiCheckbox-indeterminate": { color: "#C62828" } }} /></TableCell>
                            <TableCell>Contact Code</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Station Code</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Telephone No</TableCell>
                            <TableCell>Country</TableCell>
                            <TableCell align="center">Active</TableCell>
                            <TableCell sx={{ textAlign: "right", minWidth: 160 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginated.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={TOTAL_COLUMNS} sx={{ textAlign: "center", py: 5 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No hubs found.
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
                                    <TableCell sx={{ fontWeight: 600 }}>{item.contactCode}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.stationCode}</TableCell>
                                    <TableCell>{item.email}</TableCell>
                                    <TableCell>{item.telephoneNo}</TableCell>
                                    <TableCell>{item.country}</TableCell>
                                    
                                    <TableCell align="center">
                                        <Switch
                                            size="small"
                                            color="success"
                                            checked={item.isActive}
                                            onChange={(e) => handleActiveChange(item.id, e.target.checked)}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: "right" }}>
                                        <Box sx={{ display: "flex", gap: 0.25, justifyContent: "flex-end" }}>
                                            <IconButton
                                                size="small"
                                                aria-label="copy"
                                                onClick={() => handleCopy(item)}
                                                sx={{
                                                    color: "#94a3b8",
                                                    p: "4px",
                                                    "&:hover": {
                                                        bgcolor: "rgba(198,40,40,0.06)",
                                                        color: "#3f51b5",
                                                    },
                                                }}
                                            >
                                                <ContentCopyIcon fontSize="small" />
                                                <label style={{ fontSize: "12px", color: "#3f51b5", marginLeft: "2px" }}>Copy</label>
                                            </IconButton>
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
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%', boxShadow: 3 }}>
                    Hub details successfully copied to clipboard!
                </Alert>
            </Snackbar>
        </>
    );
}
