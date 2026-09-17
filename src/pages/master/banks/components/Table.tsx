import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Checkbox, Button, Box,
    Chip,
    IconButton,
    Paper,
    Switch,
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
import type { Bank } from "../types/bank.types";
import type { Filters } from "./Filter";

// ── Styles (matching Vessel table) ────────────────────────────────────────────
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

// ── Demo data ─────────────────────────────────────────────────────────────────
const DEMO_BANKS: Bank[] = [
    { id: 1, entity: "TTS", bank: "Emirates NBD", bankCode: "EBILAEAD", accountName: "TTS Logistics LLC", accountNumber: "1015-800-432710", currency: "AED", bankBalance: "245000.00", isActive: true },
    { id: 2, entity: "TTS", bank: "Emirates NBD", bankCode: "EBILAEAD", accountName: "TTS Logistics LLC", accountNumber: "1015-800-432711", currency: "USD", bankBalance: "87500.00", isActive: true },
    { id: 3, entity: "Fliq", bank: "Mashreq Bank", bankCode: "BOMLAEAD", accountName: "Fliq Technologies FZE", accountNumber: "0192-0000-4871", currency: "AED", bankBalance: "562300.00", isActive: true },
    { id: 4, entity: "Fliq", bank: "ADCB", bankCode: "ADCBAEAD", accountName: "Fliq Technologies FZE", accountNumber: "1100-8832-7654", currency: "USD", bankBalance: "134200.00", isActive: false },
    { id: 5, entity: "MFS", bank: "RAK Bank", bankCode: "NABORAKH", accountName: "MFS Services LLC", accountNumber: "0723-5541-9012", currency: "AED", bankBalance: "98750.00", isActive: true },
    { id: 6, entity: "Fliq LLP", bank: "HSBC", bankCode: "BBMEAEAD", accountName: "Fliq LLP Partners", accountNumber: "4400-1122-3344", currency: "GBP", bankBalance: "45000.00", isActive: true },
    { id: 7, entity: "TTS", bank: "FAB", bankCode: "NBADAEAD", accountName: "TTS Logistics LLC", accountNumber: "6677-8899-0011", currency: "EUR", bankBalance: "67200.00", isActive: false },
    { id: 8, entity: "MFS", bank: "DIB", bankCode: "DUIBAEAD", accountName: "MFS Services LLC", accountNumber: "2233-4455-6677", currency: "AED", bankBalance: "312000.00", isActive: true },
];

interface BanksIndexTableProps {
    filters?: Filters;
    onEdit: (bank: Bank) => void;
}

export default function BanksIndexTable({ filters, onEdit }: BanksIndexTableProps) {
    // ── State ─────────────────────────────────────────────────────────────────
    const [banks, setBanks] = useState<Bank[]>(DEMO_BANKS);
    const [page, setPage] = useState(0);

    const [selected, setSelected] = useState<number[]>([]);

    const handleExport = () => {
        alert(`Exporting ${selected.length} items (Placeholder)`);
    };

    const [rowsPerPage, setRowsPerPage] = useState(15);

    // ── Client-side filter ────────────────────────────────────────────────────
    const filtered = banks.filter((b) => {
        const search = filters?.search?.toLowerCase() ?? "";
        return (
            !search ||
            b.entity.toLowerCase().includes(search) ||
            b.bank.toLowerCase().includes(search) ||
            b.bankCode.toLowerCase().includes(search) ||
            b.accountName.toLowerCase().includes(search) ||
            b.accountNumber.toLowerCase().includes(search) ||
            b.currency.toLowerCase().includes(search)
        );
    });

    // ── Paginated slice ───────────────────────────────────────────────────────
    const paginatedBanks = filtered.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
    );

    const currentPageIds = paginatedBanks.map((bank) => bank.id);
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
        setSelected((prev) => prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]);
    };

    // ── Toggle active ─────────────────────────────────────────────────────────
    const handleToggleActive = (id: number) => {
        setBanks((prev) =>
            prev.map((b) =>
                b.id === id ? { ...b, isActive: !b.isActive } : b,
            ),
        );
    };

    // ── Delete handler ────────────────────────────────────────────────────────
    const handleDelete = (id: number) => {
        setBanks((prev) => prev.filter((b) => b.id !== id));
    };

    // ── Pagination handlers ───────────────────────────────────────────────────
    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    const TOTAL_COLUMNS = 10; // 7 data cols + active + actions

    // ── Formatter ─────────────────────────────────────────────────────────────
    const formatBalance = (val: string) => {
        const num = parseFloat(val);
        if (isNaN(num)) return val;
        return num.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
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
            }}
        >
            <Table size="small">
                {/* ── Head ──────────────────────────────────────────── */}
                <TableHead>
                    <TableRow
                        sx={{
                            background:
                                "linear-gradient(135deg, #fafbfd 0%, #f1f5f9 100%)",
                            borderBottom:
                                "2px solid rgba(198,40,40,0.15)",
                        }}
                    >
                        <TableCell padding="checkbox" sx={{ pl: 1.5 }}><Checkbox size="small" indeterminate={someOnPageSelected} checked={allOnPageSelected} onChange={handleSelectAll} sx={{ color: "#94a3b8", "&.Mui-checked, &.MuiCheckbox-indeterminate": { color: "#C62828" } }} /></TableCell>
<TableCell sx={headCellSx}>Entity</TableCell>
                        <TableCell sx={headCellSx}>Bank</TableCell>
                        <TableCell sx={headCellSx}>Bank Code</TableCell>
                        <TableCell sx={headCellSx}>Account Name</TableCell>
                        <TableCell sx={headCellSx}>Account Number</TableCell>
                        <TableCell sx={headCellSx}>Currency</TableCell>
                        <TableCell sx={headCellSx}>Bank Balance</TableCell>
                        <TableCell sx={headCellSx}>Status</TableCell>
                        <TableCell sx={{ ...headCellSx, textAlign: "right" }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>

                {/* ── Body ──────────────────────────────────────────── */}
                <TableBody>
                    {paginatedBanks.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={TOTAL_COLUMNS}
                                sx={{ textAlign: "center", py: 5 }}
                            >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    No banks found.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        paginatedBanks.map((bank) => {
        const isSelected = selected.includes(bank.id);
        return (
            <TableRow
                                key={bank.id}
                                hover
                                selected={isSelected} sx={{ ...rowHoverSx, ...(isSelected && { bgcolor: "rgba(198,40,40,0.04) !important" }) }}>
                <TableCell padding="checkbox" sx={{ pl: 1.5 }}><Checkbox size="small" checked={isSelected} onChange={() => handleSelectRow(bank.id)} sx={{ color: "#94a3b8", "&.Mui-checked": { color: "#C62828" } }} /></TableCell>
                                {/* Entity */}
                                <TableCell>
                                    <Chip
                                        label={bank.entity}
                                        size="small"
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: "0.75rem",
                                            bgcolor: "rgba(198,40,40,0.08)",
                                            color: "#C62828",
                                        }}
                                    />
                                </TableCell>

                                {/* Bank */}
                                <TableCell
                                    sx={{
                                        fontWeight: 600,
                                        color: "#1e293b",
                                    }}
                                >
                                    {bank.bank}
                                </TableCell>

                                {/* Bank Code */}
                                <TableCell
                                    sx={{
                                        color: "#64748b",
                                        fontFamily: "monospace",
                                        fontWeight: 500,
                                    }}
                                >
                                    {bank.bankCode}
                                </TableCell>

                                {/* Account Name */}
                                <TableCell sx={{ color: "#475569" }}>
                                    {bank.accountName}
                                </TableCell>

                                {/* Account Number */}
                                <TableCell
                                    sx={{
                                        color: "#64748b",
                                        fontFamily: "monospace",
                                    }}
                                >
                                    {bank.accountNumber}
                                </TableCell>

                                {/* Currency */}
                                <TableCell sx={{ color: "#475569" }}>
                                    {bank.currency}
                                </TableCell>

                                {/* Bank Balance */}
                                <TableCell
                                    sx={{
                                        fontWeight: 600,
                                        color: "#1e293b",
                                        fontFamily: "monospace",
                                    }}
                                >
                                    {formatBalance(bank.bankBalance)}
                                </TableCell>

                                {/* Active toggle */}
                                <TableCell>
                                    <Switch
                                        size="small"
                                        checked={bank.isActive}
                                        onChange={() =>
                                            handleToggleActive(bank.id)
                                        }
                                        color="success"
                                    />
                                </TableCell>

                                {/* Actions */}
                                <TableCell align="right">
                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 0.25,
                                            justifyContent: "flex-end",
                                        }}
                                    >
                                        <Tooltip title="Edit" arrow>
                                            <IconButton
                                                size="small"
                                                onClick={() => onEdit(bank)}
                                                sx={{
                                                    color: "#94a3b8",
                                                    p: "4px",
                                                    "&:hover": {
                                                        bgcolor: "rgba(198,40,40,0.06)",
                                                        color: "#006affff",
                                                    },
                                                }}
                                            >
                                                <EditIcon
                                                    sx={{ fontSize: "1rem" }}
                                                />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete" arrow>
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    handleDelete(bank.id)
                                                }
                                                sx={{
                                                    color: "#94a3b8",
                                                    p: "4px",
                                                    "&:hover": {
                                                        bgcolor:
                                                            "rgba(239,68,68,0.06)",
                                                        color: "#ef4444",
                                                    },
                                                }}
                                            >
                                                <DeleteIcon
                                                    sx={{ fontSize: "1rem" }}
                                                />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}))
                    }
                </TableBody>
            </Table>

            {/* ── Pagination ────────────────────────────────────────── */}
            <TablePagination
                component="div"
                count={filtered.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 15, 25, 50, 100]}
                sx={{
                    borderTop: "1px solid",
                    borderColor: "divider",
                    ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                    {
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
