import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Checkbox, Button, Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import type { AirportCodes } from "../types/airportCodes.types";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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

    const handleDelete = (id: number) => {
        setRows((prev) => prev.filter((row) => row.id !== id));
    }

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

    return (
        <Box>
            {selected.length > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1, mb: 1, bgcolor: "action.hover", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>{selected.length} items selected</Typography>
                    <Button variant="contained" size="small" color="primary" startIcon={<FileDownloadOutlinedIcon />} onClick={handleExport} sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 2.5 }}>Export</Button>
                </Box>
            )}
            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: "8px 8px 16px 16px", border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
                <Table size="small">
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
                                                <IconButton size="small" color="error" aria-label="delete" onClick={() => handleDelete(airportCode.id)}><DeleteIcon fontSize="small" /></IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
                <TablePagination component="div" count={rows.length} page={page} onPageChange={handleChangePage} rowsPerPage={rowsPerPage} onRowsPerPageChange={handleChangeRowsPerPage} rowsPerPageOptions={[5, 10, 15, 25, 50, 100]} sx={{ borderTop: "1px solid", borderColor: "divider" }} />
            </TableContainer>
        </Box>
    );
}