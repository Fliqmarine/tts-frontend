import {
    Box,
    Button,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
import { alpha } from "@mui/material/styles";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DownloadIcon from "@mui/icons-material/Download";
import MailIcon from "@mui/icons-material/Mail";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import { useMemo, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FileCell, type FileItem } from "./StockFollowupTable";
import type { StockIndexFilters } from "./StockIndexFilter";

interface StockIndexRow {
    id: number;
    station: string;
    stockId: string;
    status: "Pending" | "In Progress" | "Completed";
    arrivalDate: string;
    client: string;
    vessel: string;
    existingManifest: string;
    supplier: string;
    poNo: string;
    pieces: number;
    weightKgs: number;
    cbm: number;
    value: number;
    transitNo: string;
    pickup: boolean;
    docs: FileItem[];
    images: FileItem[];
    hasChineseDocs: boolean;
    daysInStock: number;
    dg: boolean;
};

const stockSeeds: Omit<StockIndexRow, "id" | "stockId">[] = [
    { station: "ICN-TTS-E 1", status: "Pending", arrivalDate: "2026-09-12", client: "Client 1", vessel: "Vessel 1", existingManifest: "TTS-NB-26-09-1134", supplier: "Supplier 1", poNo: "PO-26002779", pieces: 10, weightKgs: 100, cbm: 1.25, value: 1000, transitNo: "TR-10001", pickup: true, docs: [{ name: "invoice.pdf", url: "/files/invoice.pdf" }], images: [{ name: "cargo-front.jpg", url: "/files/cargo-front.jpg" }], hasChineseDocs: true, daysInStock: 12, dg: false },
    { station: "DXB-TTS-02", status: "In Progress", arrivalDate: "2026-08-18", client: "Client 2", vessel: "Vessel 2", existingManifest: "MAN-260818-02", supplier: "Supplier 2", poNo: "PO-26003403", pieces: 24, weightKgs: 840, cbm: 4.8, value: 7200, transitNo: "TR-10002", pickup: false, docs: [{ name: "packing-list.pdf", url: "/files/packing-list.pdf" }], images: [], hasChineseDocs: false, daysInStock: 38, dg: true },
    { station: "SIN-TTS-03", status: "Completed", arrivalDate: "2026-09-26", client: "Client 3", vessel: "Vessel 3", existingManifest: "MAN-260926-03", supplier: "Supplier 3", poNo: "PO-26004111", pieces: 6, weightKgs: 52, cbm: 0.72, value: 2150, transitNo: "TR-10003", pickup: true, docs: [], images: [{ name: "container.jpg", url: "/files/container.jpg" }], hasChineseDocs: true, daysInStock: 4, dg: false },
    { station: "LHR-TTS-04", status: "Pending", arrivalDate: "2026-07-22", client: "Client 1", vessel: "Vessel 2", existingManifest: "MAN-260722-04", supplier: "Supplier 2", poNo: "PO-26005102", pieces: 18, weightKgs: 1200, cbm: 7.4, value: 18400, transitNo: "TR-10004", pickup: false, docs: [{ name: "invoice-04.pdf", url: "/files/invoice-04.pdf" }], images: [], hasChineseDocs: false, daysInStock: 65, dg: true },
    { station: "JFK-TTS-05", status: "In Progress", arrivalDate: "2026-09-04", client: "Client 2", vessel: "Vessel 1", existingManifest: "MAN-260904-05", supplier: "Supplier 1", poNo: "PO-26006008", pieces: 3, weightKgs: 16, cbm: 0.18, value: 340, transitNo: "TR-10005", pickup: true, docs: [{ name: "entry.pdf", url: "/files/entry.pdf" }], images: [], hasChineseDocs: true, daysInStock: 20, dg: false },
    { station: "HND-TTS-06", status: "Pending", arrivalDate: "2026-08-01", client: "Client 3", vessel: "Vessel 3", existingManifest: "MAN-260801-06", supplier: "Supplier 3", poNo: "PO-26007110", pieces: 42, weightKgs: 2260, cbm: 12.6, value: 39800, transitNo: "TR-10006", pickup: false, docs: [], images: [], hasChineseDocs: false, daysInStock: 52, dg: false },
];

const demoStocks: StockIndexRow[] = Array.from({ length: 24 }, (_, index) => {
    const seed = stockSeeds[index % stockSeeds.length];
    const id = index + 1;
    return { ...seed, id, stockId: `STK-${String(260900 + id).padStart(6, "0")}` };
});

const columns: { key: keyof StockIndexRow; label: string; width: number; align?: "left" | "center" | "right" }[] = [
    { key: "station", label: "Station", width: 120 },
    { key: "stockId", label: "Stock ID", width: 130 },
    { key: "status", label: "Stock Status", width: 120 },
    { key: "arrivalDate", label: "Arrival Date", width: 115 },
    { key: "client", label: "Client", width: 150 },
    { key: "vessel", label: "Vessel", width: 150 },
    { key: "existingManifest", label: "Existing Manifest", width: 160 },
    { key: "supplier", label: "Supplier", width: 150 },
    { key: "poNo", label: "PO No", width: 130 },
    { key: "pieces", label: "Pieces", width: 75, align: "right" },
    { key: "weightKgs", label: "Weight (KGS)", width: 105, align: "right" },
    { key: "cbm", label: "CBM", width: 85, align: "right" },
    { key: "value", label: "Value", width: 105, align: "right" },
    { key: "transitNo", label: "Transit No", width: 120 },
    { key: "pickup", label: "Pickup", width: 75, align: "center" },
    { key: "docs", label: "Docs", width: 75, align: "center" },
    { key: "images", label: "Images", width: 75, align: "center" },
];

const ROW_HEIGHT = 38;
const HEADER_HEIGHT = 42;

const statusColor = (status: StockIndexRow["status"]) => {
    if (status === "Completed") return "success";
    if (status === "In Progress") return "info";
    return "warning";
};

const formatDate = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString();

export default function StockIndexTable({ filters }: { filters: StockIndexFilters }) {
    const navigate = useNavigate();
    const [rows, setRows] = useState<StockIndexRow[]>(demoStocks);
    const [selected, setSelected] = useState<number[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [deleteTarget, setDeleteTarget] = useState<StockIndexRow | null>(null);

    const filteredRows = useMemo(() => rows.filter((row) => {
        const search = filters.search.trim().toLowerCase();
        const searchable = [row.station, row.stockId, row.status, row.client, row.vessel, row.existingManifest, row.supplier, row.poNo, row.transitNo].join(" ").toLowerCase();
        return searchable.includes(search)
            && (!filters.client || row.client === filters.client)
            && (!filters.vessel || row.vessel === filters.vessel)
            && (!filters.station || row.station === filters.station)
            && (!filters.supplier || row.supplier === filters.supplier)
            && (!filters.poNumber || row.poNo.toLowerCase().includes(filters.poNumber.toLowerCase()))
            && (!filters.transitNumber || row.transitNo.toLowerCase().includes(filters.transitNumber.toLowerCase()))
            && (!filters.status || row.status === filters.status)
            && (!filters.fromDate || row.arrivalDate >= filters.fromDate)
            && (!filters.toDate || row.arrivalDate <= filters.toDate)
            && (!filters.stock30PlusDays || row.daysInStock >= 30)
            && (!filters.dg || row.dg)
            && (!filters.pickup || row.pickup)
            && (!filters.withoutChineseDocs || !row.hasChineseDocs);
    }), [rows, filters]);

    const pageCount = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
    const safePage = Math.min(page, pageCount - 1);
    const paginatedRows = filteredRows.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage);
    const pageIds = paginatedRows.map((row) => row.id);
    const allOnPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.includes(id));
    const someOnPageSelected = pageIds.some((id) => selected.includes(id)) && !allOnPageSelected;

    const handleSelectAll = () => setSelected((current) => allOnPageSelected
        ? current.filter((id) => !pageIds.includes(id))
        : [...new Set([...current, ...pageIds])]);

    const handleDelete = (row: StockIndexRow) => {
        setRows((current) => current.filter((item) => item.id !== row.id));
        setSelected((current) => current.filter((id) => id !== row.id));
    };

    const downloadChineseDocs = (id: number) => {
        const row = rows.find((item) => item.id === id);
        if (!row?.hasChineseDocs || !row.docs.length) return;

        row.docs.forEach((file) => {
            const link = document.createElement("a");
            link.href = file.url;
            link.download = file.name;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            document.body.appendChild(link);
            link.click();
            link.remove();
        });
    };
    
    const mail = (id: number) => {
        const row = rows.find((item) => item.id === id);
        if (!row) return;
        const subject = encodeURIComponent(`Stock ${row.stockId}`);
        const body = encodeURIComponent(`Stock: ${row.stockId}\nClient: ${row.client}\nStation: ${row.station}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };

    const handlePageChange = (_event: unknown, nextPage: number) => setPage(nextPage);
    const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(Number.parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Paper elevation={2} sx={{ mt: 2, borderRadius: 2, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: HEADER_HEIGHT + ROW_HEIGHT * 15, overflow: "auto" }}>
                <Table size="small" stickyHeader sx={(theme) => ({
                    minWidth: 2260,
                    tableLayout: "fixed",
                    "& .MuiTableCell-root": { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", px: 1, borderColor: theme.palette.divider },
                    "& .MuiTableCell-head": { zIndex: 1, fontWeight: 700, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: 0.35, lineHeight: 1.2, py: 0.75, bgcolor: "background.paper", borderBottom: `2px solid ${theme.palette.divider}` },
                    "& .MuiTableCell-body": { fontSize: "0.7rem", lineHeight: 1.3, py: 0, height: ROW_HEIGHT },
                    "& .MuiTableBody-root .MuiTableRow-root:hover": { bgcolor: theme.palette.action.hover },
                    "& .MuiTableBody-root .MuiTableRow-root.Mui-selected": { bgcolor: alpha(theme.palette.primary.main, 0.08) },
                    "& .col-actions": { position: "sticky", right: 0, bgcolor: "background.paper", boxShadow: "-6px 0 8px -6px rgba(0,0,0,0.25)", overflow: "visible", zIndex: 2 },
                    "& .MuiTableCell-head.col-actions": { zIndex: 4 },
                    "& .MuiTableBody-root .MuiTableRow-root:hover .col-actions": { backgroundImage: `linear-gradient(${theme.palette.action.hover}, ${theme.palette.action.hover})` },
                    "& .MuiTableBody-root .MuiTableRow-root.Mui-selected .col-actions": { backgroundImage: `linear-gradient(${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.primary.main, 0.08)})` },
                })}>
                    <colgroup>
                        <col style={{ width: 44 }} />
                        {columns.map((column) => <col key={column.key} style={{ width: column.width }} />)}
                        <col style={{ width: 190 }} />
                    </colgroup>
                    <TableHead sx={{ height: HEADER_HEIGHT }}>
                        <TableRow>
                            <TableCell padding="checkbox"><Checkbox size="small" checked={allOnPageSelected} indeterminate={someOnPageSelected} onChange={handleSelectAll} /></TableCell>
                            {columns.map((column) => <TableCell key={column.key} align={column.align}>{column.label}</TableCell>)}
                            <TableCell align="center" className="col-actions">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedRows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + 2} align="center" sx={{ py: 5, color: "text.secondary" }}>No stocks found</TableCell>
                            </TableRow>
                        ) : paginatedRows.map((row) => (
                            <TableRow key={row.id} hover selected={selected.includes(row.id)}>
                                <TableCell padding="checkbox">
                                    <Checkbox size="small" checked={selected.includes(row.id)} onChange={() => setSelected((current) => current.includes(row.id) ? current.filter((id) => id !== row.id) : [...current, row.id])} />
                                </TableCell>
                                {columns.map((column) => {
                                    if (column.key === "status") {
                                        const color = statusColor(row.status);
                                        return <TableCell key={column.key}><Chip size="small" label={row.status} color={color} variant="outlined" sx={(theme) => ({ height: 20, fontSize: "0.65rem", fontWeight: 600, bgcolor: alpha(theme.palette[color].main, 0.08) })} /></TableCell>;
                                    }
                                    if (column.key === "pickup") return <TableCell key={column.key} align="center"><Tooltip title={row.pickup ? "Pickup required" : "No pickup"}><span>{row.pickup ? <CheckCircleOutlinedIcon fontSize="small" color="success" /> : <HighlightOffIcon fontSize="small" color="error" />}</span></Tooltip></TableCell>;
                                    if (column.key === "docs") return <TableCell key={column.key} align="center"><FileCell files={row.docs} type="doc" /></TableCell>;
                                    if (column.key === "images") return <TableCell key={column.key} align="center"><FileCell files={row.images} type="image" /></TableCell>;
                                    let value: string | number = row[column.key] as string | number;
                                    if (column.key === "arrivalDate") value = formatDate(row.arrivalDate);
                                    if (column.key === "weightKgs") value = `${row.weightKgs.toLocaleString()} kg`;
                                    if (column.key === "cbm") value = row.cbm.toFixed(2);
                                    if (column.key === "value") value = `$${row.value.toLocaleString()}`;
                                    if (column.key === "stockId") {
                                        return (
                                            <TableCell key={column.key}>
                                                <Button
                                                    size="small"
                                                    onClick={() => navigate(`/stocks/view/${row.id}`, { state: { stock: row } })}
                                                    sx={{ minWidth: 0, p: 0, textTransform: "none", fontSize: "inherit", fontWeight: 600, justifyContent: "flex-start" }}
                                                >
                                                    {row.stockId}
                                                </Button>
                                            </TableCell>
                                        );
                                    }
                                    return <TableCell key={column.key} align={column.align} title={String(value)}>{value}</TableCell>;
                                })}
                                <TableCell align="center" className="col-actions">
                                    <Box sx={{ display: "flex", justifyContent: "center", gap: 0.1 }}>
                                        
                                        <IconButton size="small" color="success" aria-label="Download Chinese Docs" disabled={!row.hasChineseDocs || !row.docs.length} onClick={() => downloadChineseDocs(row.id)} sx={{ p: 0.4, gap: 0.4, borderRadius: 1 }}>
                                            <DownloadIcon sx={{ fontSize: 16 }} />
                                            <Typography component="span" sx={{ fontSize: "0.62rem", lineHeight: 1, whiteSpace: "nowrap" }}>China Docs</Typography>
                                        </IconButton>
                                        <IconButton size="small" color="success" aria-label="Mail" onClick={() => mail(row.id)} sx={{ p: 0.4 }}><MailIcon sx={{ fontSize: 16 }} /></IconButton>
                                        <IconButton size="small" color="primary" aria-label="view stock" onClick={() => navigate(`/stocks/view/${row.id}`, { state: { stock: row } })} sx={{ p: 0.4 }}><VisibilityIcon sx={{ fontSize: 16 }} /> </IconButton>
                                        <IconButton size="small" color="primary" aria-label="Edit stock" onClick={() => navigate(`/stocks/edit/${row.id}`, { state: { stock: row } })} sx={{ p: 0.4 }}><EditIcon sx={{ fontSize: 16 }} /></IconButton>
                                        <IconButton size="small" color="error" aria-label="Delete stock" onClick={() => setDeleteTarget(row)} sx={{ p: 0.4 }}><DeleteIcon sx={{ fontSize: 16 }} /></IconButton>
                                        <IconButton size="small" color="secondary" aria-label="Stock logs" onClick={() => navigate("/stocks/history", { state: { stock: row } })} sx={{ p: 0.4 }}><HistoryOutlinedIcon sx={{ fontSize: 16 }} /></IconButton>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={filteredRows.length}
                page={safePage}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[10, 25, 50, 100]}
                sx={{ borderTop: "1px solid", borderColor: "divider", "& .MuiTablePagination-toolbar": { px: { xs: 1, sm: 2 }, flexWrap: { xs: "wrap", sm: "nowrap" }, justifyContent: { xs: "center", sm: "flex-end" } }, "& .MuiTablePagination-selectLabel": { display: { xs: "none", sm: "block" } } }}
            />
            <Dialog
                open={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                aria-labelledby="delete-stock-index-title"
                aria-describedby="delete-stock-index-description"
                fullWidth
                maxWidth="xs"
                slotProps={{ paper: { sx: { borderRadius: 3, p: 1, boxShadow: (theme) => theme.shadows[10] } } }}
            >
                <DialogTitle
                    id="delete-stock-index-title"
                    component="div"
                    sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, pt: 3, pb: 1 }}
                >
                    <Box
                        sx={(theme) => ({
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            display: "grid",
                            placeItems: "center",
                            bgcolor: alpha(theme.palette.error.main, 0.12),
                            color: "error.main",
                            boxShadow: `0 0 0 8px ${alpha(theme.palette.error.main, 0.06)}`,
                        })}
                    >
                        <DeleteOutlinedIcon sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="h6" component="h2" fontWeight={700}>Delete stock?</Typography>
                </DialogTitle>
                <DialogContent sx={{ textAlign: "center", pb: 1 }}>
                    <Typography id="delete-stock-index-description" variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        Are you sure you want to delete{" "}
                        {deleteTarget?.stockId ? (
                            <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
                                {deleteTarget.stockId}
                            </Box>
                        ) : (
                            "this stock record"
                        )}
                        ? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pt: 2, pb: 3, gap: 1.5 }}>
                    <Button onClick={() => setDeleteTarget(null)} variant="outlined" color="inherit" fullWidth sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, borderColor: "divider" }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            if (deleteTarget) handleDelete(deleteTarget);
                            setDeleteTarget(null);
                        }}
                        color="error"
                        variant="contained"
                        fullWidth
                        autoFocus
                        disableElevation
                        sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}
