import {
    Alert,
    Box,
    Button,
    Checkbox,
    CircularProgress,
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
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Filter shape ──────────────────────────────────────────────────────────────
export interface VesselFilters {
    search?: string;
    client?: string;
    active?: boolean;
}

// ── Vessel type (placeholder until backend types are created) ─────────────────
export interface Vessel {
    id: number;
    vesselName: string;
    clientName: string;
    vesselCode: string;
    imoNo: string;
    picName: string;
    picEmail: string;
    isActive: boolean;
}

interface VesselListTableProps {
    filters?: VesselFilters;
}

// ── Styles ────────────────────────────────────────────────────────────────────
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
const DEMO_VESSELS: Vessel[] = [
    { id: 1, vesselName: "MV Atlantic Star", clientName: "Maersk Line", vesselCode: "ATL-001", imoNo: "9321483", picName: "John Smith", picEmail: "john.smith@maersk.com", isActive: true },
    { id: 2, vesselName: "MV Pacific Explorer", clientName: "MSC", vesselCode: "PAC-002", imoNo: "9456712", picName: "Maria Garcia", picEmail: "maria.garcia@msc.com", isActive: true },
    { id: 3, vesselName: "MV Indian Voyager", clientName: "CMA CGM", vesselCode: "IND-003", imoNo: "9578234", picName: "Ahmed Hassan", picEmail: "ahmed.hassan@cma-cgm.com", isActive: false },
    { id: 4, vesselName: "MV Arctic Breeze", clientName: "Hapag-Lloyd", vesselCode: "ARC-004", imoNo: "9612345", picName: "Lars Nielsen", picEmail: "lars.nielsen@hapag-lloyd.com", isActive: true },
    { id: 5, vesselName: "MV Southern Cross", clientName: "Evergreen", vesselCode: "SOU-005", imoNo: "9701298", picName: "Wei Chen", picEmail: "wei.chen@evergreen.com", isActive: true },
    { id: 6, vesselName: "MV Baltic Wave", clientName: "ZIM", vesselCode: "BAL-006", imoNo: "9823456", picName: "David Levy", picEmail: "david.levy@zim.com", isActive: false },
    { id: 7, vesselName: "MV Mediterranean Sun", clientName: "COSCO", vesselCode: "MED-007", imoNo: "9934567", picName: "Li Wei", picEmail: "li.wei@cosco.com", isActive: true },
    { id: 8, vesselName: "MV Caribbean Dream", clientName: "Yang Ming", vesselCode: "CAR-008", imoNo: "9045678", picName: "Takeshi Honda", picEmail: "takeshi.honda@yangming.com", isActive: true },
    { id: 9, vesselName: "MV North Sea Pioneer", clientName: "ONE", vesselCode: "NSP-009", imoNo: "9156789", picName: "Kenji Tanaka", picEmail: "kenji.tanaka@one-line.com", isActive: false },
    { id: 10, vesselName: "MV Red Sea Falcon", clientName: "PIL", vesselCode: "RSF-010", imoNo: "9267890", picName: "Raj Patel", picEmail: "raj.patel@pilship.com", isActive: true },
    { id: 11, vesselName: "MV Gulf Trader", clientName: "OOCL", vesselCode: "GLF-011", imoNo: "9378901", picName: "James Wong", picEmail: "james.wong@oocl.com", isActive: true },
    { id: 12, vesselName: "MV Coral Empress", clientName: "Wan Hai", vesselCode: "COR-012", imoNo: "9489012", picName: "Min Soo Park", picEmail: "minsoo.park@wanhai.com", isActive: true },
];

export default function VesselListTable({ filters }: VesselListTableProps) {
    const navigate = useNavigate();

    // ── State ─────────────────────────────────────────────────────────────────
    const [vessels, setVessels] = useState<Vessel[]>(DEMO_VESSELS);
    const [selected, setSelected] = useState<number[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);

    // ── Client-side filter ────────────────────────────────────────────────────
    const filtered = vessels.filter((v) => {
        const search = filters?.search?.toLowerCase() ?? "";
        const clientMatch = !filters?.client || v.clientName === filters.client;
        const activeMatch = filters?.active === undefined || v.isActive === filters.active;
        const searchMatch =
            !search ||
            v.vesselName.toLowerCase().includes(search) ||
            v.clientName.toLowerCase().includes(search) ||
            v.vesselCode.toLowerCase().includes(search) ||
            v.imoNo.toLowerCase().includes(search) ||
            v.picName.toLowerCase().includes(search) ||
            v.picEmail.toLowerCase().includes(search);
        return clientMatch && activeMatch && searchMatch;
    });

    // ── Paginated slice ───────────────────────────────────────────────────────
    const paginatedVessels = filtered.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    // ── Selection helpers ─────────────────────────────────────────────────────
    const currentPageIds = paginatedVessels.map((v) => v.id);
    const allOnPageSelected =
        currentPageIds.length > 0 && currentPageIds.every((id) => selected.includes(id));
    const someOnPageSelected =
        currentPageIds.some((id) => selected.includes(id)) && !allOnPageSelected;

    const handleSelectAll = () => {
        if (allOnPageSelected) {
            setSelected((prev) => prev.filter((id) => !currentPageIds.includes(id)));
        } else {
            setSelected((prev) => [...new Set([...prev, ...currentPageIds])]);
        }
    };

    const handleSelectRow = (id: number) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        );
    };

    // ── Toggle active ─────────────────────────────────────────────────────────
    const handleToggleActive = (id: number) => {
        setVessels((prev) =>
            prev.map((v) => (v.id === id ? { ...v, isActive: !v.isActive } : v))
        );
    };

    // ── Delete handler ────────────────────────────────────────────────────────
    const handleDelete = (id: number) => {
        setVessels((prev) => prev.filter((v) => v.id !== id));
        setSelected((prev) => prev.filter((sid) => sid !== id));
    };

    // ── Export handler (placeholder) ──────────────────────────────────────────
    const handleExport = () => {
        const selectedVessels = vessels.filter((v) => selected.includes(v.id));
        console.log("Exporting vessels:", selectedVessels);
        alert(`Exporting ${selectedVessels.length} vessel(s)`);
    };

    // ── Pagination handlers ───────────────────────────────────────────────────
    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    const TOTAL_COLUMNS = 9; // checkbox + 6 data columns + active + actions

    // ── Table ─────────────────────────────────────────────────────────────────
    return (
        <Box>
            {/* ── Export bar (visible when rows are selected) ─────────────── */}
            {selected.length > 0 && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 2,
                        py: 1,
                        mb: 1,
                        bgcolor: "rgba(198,40,40,0.06)",
                        borderRadius: 2,
                        border: "1px solid rgba(198,40,40,0.15)",
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#C62828" }}>
                        {selected.length} vessel{selected.length > 1 ? "s" : ""} selected
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<FileDownloadOutlinedIcon />}
                            onClick={handleExport}
                            color="success"
                            sx={{
                                color: "#fff",
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: 2,
                                px: 2.5,
                                boxShadow: "0 3px 10px rgba(198,40,40,0.3)",
                            }}
                        >
                            Export Excel
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<FileDownloadOutlinedIcon />}
                            onClick={handleExport}

                            sx={{
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: 2,
                                px: 2.5,
                                boxShadow: "0 3px 16px rgba(198,40,40,0.4)",
                            }}
                        >
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
                    {/* ── Head ──────────────────────────────────────────────── */}
                    <TableHead>
                        <TableRow
                            sx={{
                                background: "linear-gradient(135deg, #fafbfd 0%, #f1f5f9 100%)",
                                borderBottom: "2px solid rgba(198,40,40,0.15)",
                            }}
                        >
                            {/* Select-all checkbox */}
                            <TableCell padding="checkbox" sx={{ pl: 1.5 }}>
                                <Checkbox
                                    size="small"
                                    indeterminate={someOnPageSelected}
                                    checked={allOnPageSelected}
                                    onChange={handleSelectAll}
                                    sx={{
                                        color: "#94a3b8",
                                        "&.Mui-checked, &.MuiCheckbox-indeterminate": {
                                            color: "#C62828",
                                        },
                                    }}
                                />
                            </TableCell>
                            <TableCell sx={headCellSx}>Vessel Name</TableCell>
                            <TableCell sx={headCellSx}>Client Name</TableCell>
                            <TableCell sx={headCellSx}>Vessel Code</TableCell>
                            <TableCell sx={headCellSx}>IMO No</TableCell>
                            <TableCell sx={headCellSx}>PIC Name</TableCell>
                            <TableCell sx={headCellSx}>PIC Email</TableCell>
                            <TableCell sx={headCellSx}>Active</TableCell>
                            <TableCell sx={{ ...headCellSx, textAlign: "right" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    {/* ── Body ──────────────────────────────────────────────── */}
                    <TableBody>
                        {paginatedVessels.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={TOTAL_COLUMNS} sx={{ textAlign: "center", py: 5 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No vessels found.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedVessels.map((vessel) => {
                                const isSelected = selected.includes(vessel.id);
                                return (
                                    <TableRow
                                        key={vessel.id}
                                        hover
                                        selected={isSelected}
                                        sx={{
                                            ...rowHoverSx,
                                            ...(isSelected && {
                                                bgcolor: "rgba(198,40,40,0.04) !important",
                                            }),
                                        }}
                                    >
                                        {/* Row checkbox */}
                                        <TableCell padding="checkbox" sx={{ pl: 1.5 }}>
                                            <Checkbox
                                                size="small"
                                                checked={isSelected}
                                                onChange={() => handleSelectRow(vessel.id)}
                                                sx={{
                                                    color: "#94a3b8",
                                                    "&.Mui-checked": { color: "#C62828" },
                                                }}
                                            />
                                        </TableCell>

                                        {/* Vessel Name */}
                                        <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>
                                            {vessel.vesselName}
                                        </TableCell>

                                        {/* Client Name */}
                                        <TableCell sx={{ color: "#475569" }}>
                                            {vessel.clientName}
                                        </TableCell>

                                        {/* Vessel Code */}
                                        <TableCell sx={{ color: "#64748b", fontFamily: "monospace", fontWeight: 500 }}>
                                            {vessel.vesselCode}
                                        </TableCell>

                                        {/* IMO No */}
                                        <TableCell sx={{ color: "#64748b", fontFamily: "monospace" }}>
                                            {vessel.imoNo}
                                        </TableCell>

                                        {/* PIC Name */}
                                        <TableCell sx={{ color: "#475569" }}>
                                            {vessel.picName}
                                        </TableCell>

                                        {/* PIC Email */}
                                        <TableCell sx={{ color: "#475569", fontSize: "0.82rem" }}>
                                            {vessel.picEmail}
                                        </TableCell>

                                        {/* Active toggle */}
                                        <TableCell>
                                            <Switch
                                                size="small"
                                                checked={vessel.isActive}
                                                onChange={() => handleToggleActive(vessel.id)}
                                                color="success"
                                            />
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell align="right">
                                            <Box sx={{ display: "flex", gap: 0.25, justifyContent: "flex-end" }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        navigate(`/master/vessels/vessel-edit/${vessel.id}`)
                                                    }
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

                                                <Tooltip title="Delete" arrow>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDelete(vessel.id)}
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
                                );
                            })
                        )}
                    </TableBody>
                </Table>

                {/* ── Pagination ────────────────────────────────────────────── */}
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
