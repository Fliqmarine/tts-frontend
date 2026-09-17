import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Checkbox, Button, Box,
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
    fontWeight: 700,
    color: "#C62828",
    fontSize: "0.72rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.6px",
    py: "8px",
    whiteSpace: "nowrap" as const,
};

const rowHoverSx = {
    "&:hover": { bgcolor: "rgba(198,40,40,0.03)" },
    transition: "background 0.15s",
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

const TOTAL_COLUMNS = 4; // Name + Calculation Rule + Actions

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
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1, mb: 1, bgcolor: "rgba(198,40,40,0.06)", borderRadius: 2, border: "1px solid rgba(198,40,40,0.15)" }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#C62828" }}>{selected.length} items selected</Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button variant="contained" size="small" startIcon={<FileDownloadOutlinedIcon />} onClick={handleExport} color="success" sx={{ color: "#fff", textTransform: "none", fontWeight: 600, borderRadius: 2, px: 2.5, boxShadow: "0 3px 10px rgba(198,40,40,0.3)" }}>Export Excel</Button>
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
                mt: 2,
            }}
        >
            <Table size="small">
                <TableHead>
                    <TableRow
                        sx={{
                            background: "linear-gradient(135deg, #fafbfd 0%, #f1f5f9 100%)",
                            borderBottom: "2px solid rgba(198,40,40,0.15)",
                        }}
                    >
                        <TableCell padding="checkbox" sx={{ pl: 1.5 }}><Checkbox size="small" indeterminate={someOnPageSelected} checked={allOnPageSelected} onChange={handleSelectAll} sx={{ color: "#94a3b8", "&.Mui-checked, &.MuiCheckbox-indeterminate": { color: "#C62828" } }} /></TableCell>
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
            <TableRow key={tariff.id} hover selected={isSelected} sx={{ ...rowHoverSx, ...(isSelected && { bgcolor: "rgba(198,40,40,0.04) !important" }) }}>
                <TableCell padding="checkbox" sx={{ pl: 1.5 }}><Checkbox size="small" checked={isSelected} onChange={() => handleSelectRow(tariff.id)} sx={{ color: "#94a3b8", "&.Mui-checked": { color: "#C62828" } }} /></TableCell>
                                {/* Name */}
                                <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>
                                    {tariff.name}
                                </TableCell>

                                {/* Calculation Rule */}
                                <TableCell sx={{ color: "#475569" }}>
                                    {tariff.calculation_rule}
                                </TableCell>

                                {/* Actions */}
                                <TableCell align="right">
                                    <Box sx={{ display: "flex", gap: 0.25, justifyContent: "flex-end" }}>
                                        {/* Edit â†’ opens drawer in edit mode */}
                                        <Tooltip title="Edit" arrow>
                                            <IconButton
                                                size="small"
                                                onClick={() => onEdit(tariff)}
                                                sx={{
                                                    color: "#94a3b8",
                                                    p: "4px",
                                                    "&:hover": {
                                                        bgcolor: "rgba(198,40,40,0.06)",
                                                        color: "#006affff",
                                                    },
                                                }}
                                            >
                                                <EditIcon sx={{ fontSize: "1rem" }} />
                                            </IconButton>
                                        </Tooltip>

                                        {/* Delete â†’ removes row from list */}
                                        <Tooltip title="Delete" arrow>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDelete(tariff.id)}
                                                sx={{
                                                    color: "#94a3b8",
                                                    p: "4px",
                                                    "&:hover": {
                                                        bgcolor: "rgba(239,68,68,0.06)",
                                                        color: "#ef4444",
                                                    },
                                                }}
                                            >
                                                <DeleteIcon sx={{ fontSize: "1rem" }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}))
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
                    ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                        fontSize: "0.8rem",
                        color: "#64748b",
                    },
                    ".MuiTablePagination-actions button": {
                        color: "#C62828",
                    },
                }}
            />
        </TableContainer>
            </Box>
    );
}
