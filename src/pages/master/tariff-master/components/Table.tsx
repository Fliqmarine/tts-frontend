import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import {
    Checkbox, Button, Box,
    IconButton,
    Paper,
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
import { useState } from "react";
import type { TariffMaster } from "../types/trariffMaster.types";

const headCellSx = {
    whiteSpace: "nowrap" as const,
};

const DEMO_TARIFF_MASTERS: TariffMaster[] = [
    { id: 1, name: "Air Tariff", calculation_rule: "None" },
    { id: 2, name: "Air Freight Charges", calculation_rule: "Per Kg" },
    { id: 3, name: "Ocean Freight Charges", calculation_rule: "Per Container" },
    { id: 4, name: "Sea Freight Charges", calculation_rule: "Per CBM" },
    { id: 5, name: "Customs Clearance Fee", calculation_rule: "Flat Rate" },
    { id: 6, name: "Handling Charges", calculation_rule: "Per Kg" },
    { id: 7, name: "Storage Charges", calculation_rule: "Per Day" },
    { id: 8, name: "Documentation Fee", calculation_rule: "Flat Rate" },
    { id: 9, name: "Port Handling Fee", calculation_rule: "Per Container" },
    { id: 10, name: "Inland Transport", calculation_rule: "Per Trip" },
    { id: 11, name: "Insurance Premium", calculation_rule: "Per Kg" },
    { id: 12, name: "Fumigation Charges", calculation_rule: "Flat Rate" },
];

const TOTAL_COLUMNS = 4;

interface TariffMasterIndexTableProps {
    onEdit: (tariff: TariffMaster) => void;
}

export default function TariffMasterIndexTable({ onEdit }: TariffMasterIndexTableProps) {
    const [rows, setRows] = useState<TariffMaster[]>(DEMO_TARIFF_MASTERS);
    const [page, setPage] = useState(0);

    const [selected, setSelected] = useState<number[]>([]);

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const paginated = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const currentPageIds = paginated.map((tariff) => tariff.id);
    const allOnPageSelected = currentPageIds.length > 0 && currentPageIds.every((id: number) => selected.includes(id));
    const someOnPageSelected = currentPageIds.some((id: number) => selected.includes(id)) && !allOnPageSelected;

    const handleSelectAll = () => {
        if (allOnPageSelected) {
            setSelected((prev) => prev.filter((id) => !currentPageIds.includes(id)));
        } else {
            setSelected((prev) => [...new Set([...prev, ...currentPageIds])]);
        }
    };

    const handleSelectRow = (id: number) => {
        setSelected((prev) => prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]);
    };

    const handleExport = () => {
        alert(`Exporting ${selected.length} items (Placeholder)`);
    };

    const handleDelete = (id: number) => {
        setRows((prev) => prev.filter((r) => r.id !== id));
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    return (
        <Box>
            {selected.length > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1, mb: 1, bgcolor: "action.hover", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>{selected.length} items selected</Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
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
                    overflow: "hidden",
                    mt: 2,
                }}
            >
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox" sx={{ pl: 1.5 }}>
                                <Checkbox size="small" color="primary" indeterminate={someOnPageSelected} checked={allOnPageSelected} onChange={handleSelectAll} />
                            </TableCell>
                            <TableCell sx={headCellSx}>Name</TableCell>
                            <TableCell sx={headCellSx}>Calculation Rule</TableCell>
                            <TableCell sx={{ ...headCellSx, textAlign: "right" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginated.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={TOTAL_COLUMNS} sx={{ textAlign: "center", py: 5 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No tariffs found.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginated.map((tariff) => {
                                const isSelected = selected.includes(tariff.id);
                                return (
                                    <TableRow key={tariff.id} hover selected={isSelected}>
                                        <TableCell padding="checkbox" sx={{ pl: 1.5 }}>
                                            <Checkbox size="small" color="primary" checked={isSelected} onChange={() => handleSelectRow(tariff.id)} />
                                        </TableCell>

                                        <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                                            {tariff.name}
                                        </TableCell>

                                        <TableCell sx={{ color: "text.secondary" }}>
                                            {tariff.calculation_rule}
                                        </TableCell>

                                        <TableCell align="right">
                                            <Box sx={{ display: "flex", gap: 0.25, justifyContent: "flex-end" }}>
                                                <Tooltip title="Edit" arrow>
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => onEdit(tariff)}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Delete" arrow>
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDelete(tariff.id)}
                                                    >
                                                        <DeleteIcon fontSize="small" />
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
        </Box>
    );
}

