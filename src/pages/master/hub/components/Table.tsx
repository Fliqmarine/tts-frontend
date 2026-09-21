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

const headCellSx = {
    whiteSpace: "nowrap" as const,
};

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
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1, mb: 1, bgcolor: "action.hover", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>{selected.length} items selected</Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button variant="contained" size="small" startIcon={<FileDownloadOutlinedIcon />} onClick={handleExport} color="success" sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 2.5 }}>
                            Export Excel
                        </Button>
                        <Button variant="contained" size="small" color="secondary" startIcon={<FileDownloadOutlinedIcon />} onClick={handleExport} sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 2.5 }}>
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
                        <TableRow>
                            <TableCell padding="checkbox" sx={{ pl: 1.5 }}><Checkbox size="small" color="primary" indeterminate={someOnPageSelected} checked={allOnPageSelected} onChange={handleSelectAll} /></TableCell>
                            <TableCell sx={headCellSx}>Contact Code</TableCell>
                            <TableCell sx={headCellSx}>Name</TableCell>
                            <TableCell sx={headCellSx}>Station Code</TableCell>
                            <TableCell sx={headCellSx}>Email</TableCell>
                            <TableCell sx={headCellSx}>Telephone No</TableCell>
                            <TableCell sx={headCellSx}>Country</TableCell>
                            <TableCell sx={headCellSx} align="center">Active</TableCell>
                            <TableCell sx={{ ...headCellSx, textAlign: "right", minWidth: 160 }}>Actions</TableCell>
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
                                <TableRow key={item.id} hover selected={selected.includes(item.id)}>
                                    <TableCell padding="checkbox" sx={{ pl: 1.5 }}>
                                        <Checkbox
                                            size="small"
                                            color="primary"
                                            checked={selected.includes(item.id)}
                                            onChange={() => handleSelectRow(item.id)}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>{item.contactCode}</TableCell>
                                    <TableCell sx={{ color: "text.secondary" }}>{item.name}</TableCell>
                                    <TableCell sx={{ color: "text.secondary" }}>{item.stationCode}</TableCell>
                                    <TableCell sx={{ color: "text.secondary" }}>{item.email}</TableCell>
                                    <TableCell sx={{ color: "text.secondary" }}>{item.telephoneNo}</TableCell>
                                    <TableCell sx={{ color: "text.secondary" }}>{item.country}</TableCell>

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
                                                color="info"
                                                aria-label="copy"
                                                onClick={() => handleCopy(item)}
                                            >
                                                <ContentCopyIcon fontSize="small" />
                                                <Typography variant="caption" sx={{ ml: 0.5 }}>Copy</Typography>
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                aria-label="edit"
                                                onClick={() => onEdit(item)}
                                            >
                                                <EditIcon fontSize="small" />
                                                <Typography variant="caption" sx={{ ml: 0.5 }}>Edit</Typography>
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                aria-label="delete"
                                                onClick={() => handleDelete(item.id)}
                                            >
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
