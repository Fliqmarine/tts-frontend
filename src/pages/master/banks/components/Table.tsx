import { Box, Button, Checkbox, Chip, IconButton, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { useState } from "react";
import type { Bank } from "../types/bank.types";
import type { Filters } from "./Filter";

const headCellSx = {
    whiteSpace: "nowrap" as const,
};

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
    const [banks, setBanks] = useState<Bank[]>(DEMO_BANKS);
    const [page, setPage] = useState(0);
    const [selected, setSelected] = useState<number[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(15);

    const handleExport = () => {
        alert(`Exporting ${selected.length} items (Placeholder)`);
    };

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

    const handleToggleActive = (id: number) => {
        setBanks((prev) =>
            prev.map((b) =>
                b.id === id ? { ...b, isActive: !b.isActive } : b,
            ),
        );
    };

    const handleDelete = (id: number) => {
        setBanks((prev) => prev.filter((b) => b.id !== id));
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    const TOTAL_COLUMNS = 10;

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
                }}
            >
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox" sx={{ pl: 1.5 }}>
                                <Checkbox size="small" color="primary" indeterminate={someOnPageSelected} checked={allOnPageSelected} onChange={handleSelectAll} />
                            </TableCell>
                            <TableCell sx={headCellSx}>Entity</TableCell>
                            <TableCell sx={headCellSx}>Bank</TableCell>
                            <TableCell sx={headCellSx}>Bank Code</TableCell>
                            <TableCell sx={headCellSx}>Account Name</TableCell>
                            <TableCell sx={headCellSx}>Account Number</TableCell>
                            <TableCell sx={headCellSx}>Currency</TableCell>
                            <TableCell sx={headCellSx}>Bank Balance</TableCell>
                            <TableCell sx={headCellSx}>Status</TableCell>
                            <TableCell sx={{ ...headCellSx, textAlign: "right" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>

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
                                        selected={isSelected}
                                    >
                                        <TableCell padding="checkbox" sx={{ pl: 1.5 }}>
                                            <Checkbox size="small" color="primary" checked={isSelected} onChange={() => handleSelectRow(bank.id)} />
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={bank.entity}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                                sx={{
                                                    fontWeight: 600,
                                                    fontSize: "0.75rem",
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                                            {bank.bank}
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                color: "text.secondary",
                                                fontFamily: "monospace",
                                                fontWeight: 500,
                                            }}
                                        >
                                            {bank.bankCode}
                                        </TableCell>

                                        <TableCell sx={{ color: "text.secondary" }}>
                                            {bank.accountName}
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                color: "text.secondary",
                                                fontFamily: "monospace",
                                            }}
                                        >
                                            {bank.accountNumber}
                                        </TableCell>

                                        <TableCell sx={{ color: "text.secondary" }}>
                                            {bank.currency}
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontWeight: 600,
                                                color: "text.primary",
                                                fontFamily: "monospace",
                                            }}
                                        >
                                            {formatBalance(bank.bankBalance)}
                                        </TableCell>

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
                                                        color="primary"
                                                        onClick={() => onEdit(bank)}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete" arrow>
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() =>
                                                            handleDelete(bank.id)
                                                        }
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
                    count={filtered.length}
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
