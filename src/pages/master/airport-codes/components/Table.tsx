import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Checkbox, Button, Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { AirportCodes } from "../types/airportCodes.types";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useState } from "react";


const demoData: AirportCodes[] = [
    { id: 1, city_name: "New York", airport_code: "JFK", airport_name: "John F. Kennedy International Airport", country: "USA", },
    { id: 2, city_name: "London", airport_code: "LHR", airport_name: "Heathrow Airport", country: "UK", },
    { id: 3, city_name: "Tokyo", airport_code: "HND", airport_name: "Haneda Airport", country: "Japan", },
    { id: 4, city_name: "Dubai", airport_code: "DXB", airport_name: "Dubai International Airport", country: "UAE", },
    { id: 5, city_name: "Singapore", airport_code: "SIN", airport_name: "Changi Airport", country: "Singapore", }
];

const TOTAL_COLUMNS = 5;

const headCellSx = {
    whiteSpace: "nowrap" as const,
};

interface AirportCodesIndexTableProps {
    onEdit: (airportCode: AirportCodes) => void;
}

export default function AirportCodesIndexTable({ onEdit }: AirportCodesIndexTableProps) {
    const [rows, setRows] = useState<AirportCodes[]>(demoData);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [deleteTarget, setDeleteTarget] = useState<AirportCodes | null>(null);

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    const paginated = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const [selected, setSelected] = useState<number[]>([]);
    const currentPageIds = paginated.map((airportCode) => airportCode.id);
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

    return (
        <Box>
            {selected.length > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1, mb: 1, bgcolor: "action.hover", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>{selected.length} items selected</Typography>
                    <Button variant="contained" size="small" color="primary" startIcon={<FileDownloadOutlinedIcon />} onClick={handleExport} sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 2.5 }}>Export</Button>
                </Box>
            )}
            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: "8px 8px 16px 16px", border: "1px solid", borderColor: "divider", overflowX: "auto", overflowY: "hidden" }}>
                <Table size="small" sx={{ minWidth: { xs: 680, sm: "100%" } }}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox" sx={{ pl: 1.5 }}><Checkbox size="small" color="primary" indeterminate={someOnPageSelected} checked={allOnPageSelected} onChange={handleSelectAll} /></TableCell>
                            <TableCell sx={headCellSx}>City</TableCell>
                            <TableCell sx={headCellSx}>Airport Code</TableCell>
                            <TableCell sx={headCellSx}>Airport Name</TableCell>
                            <TableCell sx={headCellSx}>Country</TableCell>
                            <TableCell sx={{ ...headCellSx, textAlign: "right" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginated.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={TOTAL_COLUMNS + 1} sx={{ textAlign: "center", py: 5 }}>
                                    <Typography variant="body2" color="text.secondary">No airport codes found.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginated.map((airportCode) => {
                                const isSelected = selected.includes(airportCode.id);
                                return (
                                    <TableRow key={airportCode.id} hover selected={isSelected}>
                                        <TableCell padding="checkbox" sx={{ pl: 1.5 }}><Checkbox size="small" color="primary" checked={isSelected} onChange={() => handleSelectRow(airportCode.id)} /></TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>{airportCode.city_name}</TableCell>
                                        <TableCell sx={{ color: "text.secondary" }}>{airportCode.airport_code}</TableCell>
                                        <TableCell sx={{ color: "text.secondary" }}>{airportCode.airport_name}</TableCell>
                                        <TableCell sx={{ color: "text.secondary" }}>{airportCode.country}</TableCell>
                                        <TableCell sx={{ textAlign: "right" }}>
                                            <Box sx={{ display: "flex", gap: 0.25, justifyContent: "flex-end" }}>
                                                <IconButton size="small" color="primary" aria-label="edit" onClick={() => onEdit(airportCode)}><EditIcon fontSize="small" /></IconButton>
                                                <IconButton size="small" color="error" aria-label="delete" onClick={() => setDeleteTarget(airportCode)}><DeleteIcon fontSize="small" /></IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
                <TablePagination component="div" count={rows.length} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} rowsPerPageOptions={[5, 10, 15, 25, 50, 100]} sx={{ borderTop: "1px solid", borderColor: "divider", "& .MuiTablePagination-toolbar": { px: { xs: 1, sm: 2 }, flexWrap: { xs: "wrap", sm: "nowrap" }, justifyContent: { xs: "center", sm: "flex-end" } }, "& .MuiTablePagination-selectLabel": { display: { xs: "none", sm: "block" } } }} />
            </TableContainer>

            <Dialog
                open={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                aria-labelledby="delete-airport-title"
                aria-describedby="delete-airport-description"
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
                    id="delete-airport-title"
                    component="div"
                    sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, pt: 3, pb: 1 }}
                >
                    <Box sx={(theme) => ({ width: 64, height: 64, borderRadius: "50%", display: "grid", placeItems: "center", bgcolor: alpha(theme.palette.error.main, 0.12), color: "error.main", boxShadow: `0 0 0 8px ${alpha(theme.palette.error.main, 0.06)}` })}>
                        <DeleteOutlinedIcon sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="h6" component="h2" fontWeight={700}>
                        Delete airport code?
                    </Typography>
                </DialogTitle>

                <DialogContent sx={{ textAlign: "center", pb: 1 }}>
                    <Typography id="delete-airport-description" variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        Are you sure you want to delete{" "}
                        {deleteTarget?.airport_code ? (
                            <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
                                “{deleteTarget.airport_code}”
                            </Box>
                        ) : "this airport code"}?
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
