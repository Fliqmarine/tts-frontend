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
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { useMemo, useState, type ChangeEvent, type MouseEvent as ReactMouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FileCell } from "./StockFollowupTable";
import type { Stock, StockIndexColumn, StockIndexFilters, StockIndexTableProps } from "../types/Stocks.types";

const stockSeeds: Omit<Stock, "id" | "stock_id">[] = [
    { station: "ICN-TTS-E 1", stock_status: "Pending", arrival_date: "2026-09-12", client: "Client 1", vessel: "Vessel 1", existing_manifest: "TTS-NB-26-09-1134", supplier: "Supplier 1", po_no: "PO-26002779", pkgs: 10, weight: 100, cbm: 1.25, value: 1000, transit_no: "TR-10001", pickup: true, docs: [{ name: "invoice.pdf", url: "/files/invoice.pdf" }], images: [{ name: "cargo-front.jpg", url: "/files/cargo-front.jpg" }], hasChineseDocs: true, daysInStock: 12, dg: false },
    { station: "DXB-TTS-02", stock_status: "In Progress", arrival_date: "2026-08-18", client: "Client 2", vessel: "Vessel 2", existing_manifest: "MAN-260818-02", supplier: "Supplier 2", po_no: "PO-26003403", pkgs: 24, weight: 840, cbm: 4.8, value: 7200, transit_no: "TR-10002", pickup: false, docs: [{ name: "packing-list.pdf", url: "/files/packing-list.pdf" }], images: [], hasChineseDocs: false, daysInStock: 38, dg: true },
    { station: "SIN-TTS-03", stock_status: "Completed", arrival_date: "2026-09-26", client: "Client 3", vessel: "Vessel 3", existing_manifest: "MAN-260926-03", supplier: "Supplier 3", po_no: "PO-26004111", pkgs: 6, weight: 52, cbm: 0.72, value: 2150, transit_no: "TR-10003", pickup: true, docs: [], images: [{ name: "container.jpg", url: "/files/container.jpg" }], hasChineseDocs: true, daysInStock: 4, dg: false },
    { station: "LHR-TTS-04", stock_status: "Pending", arrival_date: "2026-07-22", client: "Client 1", vessel: "Vessel 2", existing_manifest: "MAN-260722-04", supplier: "Supplier 2", po_no: "PO-26005102", pkgs: 18, weight: 1200, cbm: 7.4, value: 18400, transit_no: "TR-10004", pickup: false, docs: [{ name: "invoice-04.pdf", url: "/files/invoice-04.pdf" }], images: [], hasChineseDocs: false, daysInStock: 65, dg: true },
    { station: "JFK-TTS-05", stock_status: "In Progress", arrival_date: "2026-09-04", client: "Client 2", vessel: "Vessel 1", existing_manifest: "MAN-260904-05", supplier: "Supplier 1", po_no: "PO-26006008", pkgs: 3, weight: 16, cbm: 0.18, value: 340, transit_no: "TR-10005", pickup: true, docs: [{ name: "entry.pdf", url: "/files/entry.pdf" }], images: [], hasChineseDocs: true, daysInStock: 20, dg: false },
    { station: "HND-TTS-06", stock_status: "Pending", arrival_date: "2026-08-01", client: "Client 3", vessel: "Vessel 3", existing_manifest: "MAN-260801-06", supplier: "Supplier 3", po_no: "PO-26007110", pkgs: 42, weight: 2260, cbm: 12.6, value: 39800, transit_no: "TR-10006", pickup: false, docs: [], images: [], hasChineseDocs: false, daysInStock: 52, dg: false },
];

const demoStocks: Stock[] = Array.from({ length: 24 }, (_, index) => {
    const seed = stockSeeds[index % stockSeeds.length];
    const id = index + 1;
    return { ...seed, id, stock_id: `STK-${String(260900 + id).padStart(6, "0")}` };
});

const columns: StockIndexColumn[] = [
    { key: "station", label: "Station", width: 120 },
    { key: "stock_id", label: "Stock ID", width: 130 },
    { key: "stock_status", label: "Stock Status", width: 120 },
    { key: "arrival_date", label: "Arrival Date", width: 115 },
    { key: "client", label: "Client", width: 150 },
    { key: "vessel", label: "Vessel", width: 150 },
    { key: "existing_manifest", label: "Existing Manifest", width: 160 },
    { key: "supplier", label: "Supplier", width: 150 },
    { key: "po_no", label: "PO No", width: 130 },
    { key: "pkgs", label: "Pieces", width: 75, align: "right" },
    { key: "weight", label: "Weight (KGS)", width: 105, align: "right" },
    { key: "cbm", label: "CBM", width: 85, align: "right" },
    { key: "value", label: "Value", width: 105, align: "right" },
    { key: "transit_no", label: "Transit No", width: 120 },
    { key: "pickup", label: "Pickup", width: 75, align: "center" },
    { key: "docs", label: "Docs", width: 75, align: "center" },
    { key: "images", label: "Images", width: 75, align: "center" },
];

const ROW_HEIGHT = 38;
const HEADER_HEIGHT = 42;
const MIN_COL_WIDTH = 60;
const CHECKBOX_COL_WIDTH = 44;
const ACTIONS_COL_WIDTH = 190;
const defaultWidths = Object.fromEntries(columns.map((column) => [column.key, column.width])) as Record<string, number>;

const statusColor = (status: Stock["stock_status"]) => {
    if (status === "Completed") return "success";
    if (status === "In Progress") return "info";
    return "warning";
};

const formatDate = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString();

export default function StockIndexTable({ filters }: StockIndexTableProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const [rows, setRows] = useState<Stock[]>(() => {
        const deletedStockId = (location.state as { deletedStockId?: string } | null)?.deletedStockId;
        return deletedStockId
            ? demoStocks.filter((row) => String(row.id) !== deletedStockId)
            : demoStocks;
    });
    const [selected, setSelected] = useState<number[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [deleteTarget, setDeleteTarget] = useState<Stock | null>(null);
    const [widths, setWidths] = useState<Record<string, number>>(defaultWidths);

    const startResize = (key: string, event: ReactMouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        const startX = event.clientX;
        const startWidth = widths[key];
        const onMove = (moveEvent: MouseEvent) => setWidths((current) => ({
            ...current,
            [key]: Math.max(MIN_COL_WIDTH, startWidth + moveEvent.clientX - startX),
        }));
        const onUp = () => {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
    };

    const resetWidth = (key: string) => setWidths((current) => ({ ...current, [key]: defaultWidths[key] }));
    const totalWidth = CHECKBOX_COL_WIDTH + ACTIONS_COL_WIDTH + columns.reduce((sum, column) => sum + widths[column.key], 0);

    const filteredRows = useMemo(() => rows.filter((row) => {
        const search = filters.search.trim().toLowerCase();
        const searchable = [row.station, row.stock_id, row.stock_status, row.client, row.vessel, row.existing_manifest, row.supplier, row.po_no, row.transit_no].join(" ").toLowerCase();
        return searchable.includes(search)
            && (!filters.client || row.client === filters.client)
            && (!filters.vessel || row.vessel === filters.vessel)
            && (!filters.station || row.station === filters.station)
            && (!filters.supplier || row.supplier === filters.supplier)
            && (!filters.poNumber || row.po_no.toLowerCase().includes(filters.poNumber.toLowerCase()))
            && (!filters.transitNumber || row.transit_no.toLowerCase().includes(filters.transitNumber.toLowerCase()))
            && (!filters.status || row.stock_status === filters.status)
            && (!filters.fromDate || row.arrival_date >= filters.fromDate)
            && (!filters.toDate || row.arrival_date <= filters.toDate)
            && (!filters.stock30PlusDays || (row.daysInStock ?? 0) >= 30)
            && (!filters.dg || row.dg === true)
            && (!filters.pickup || row.pickup === true)
            && (!filters.withoutChineseDocs || row.hasChineseDocs !== true);
    }), [rows, filters]);

    const pageCount = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
    const safePage = Math.min(page, pageCount - 1);
    const paginatedRows = filteredRows.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage);
    const pageIds = paginatedRows.map((row) => row.id);
    const allOnPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.includes(id));
    const someOnPageSelected = pageIds.some((id) => selected.includes(id)) && !allOnPageSelected;
    const selectedRows = filteredRows.filter((row) => selected.includes(row.id));
    const selectedTotals = selectedRows.reduce((totals, row) => ({
        pkgs: totals.pkgs + row.pkgs,
        weight: totals.weight + row.weight,
        cbm: totals.cbm + row.cbm,
        value: totals.value + row.value,
    }), { pkgs: 0, weight: 0, cbm: 0, value: 0 });

    const exportColumns = columns;
    const exportValue = (row: Stock, key: StockIndexColumn["key"]): string | number => {
        if (key === "pickup") return row.pickup ? "Yes" : "No";
        if (key === "docs" || key === "images") return row[key].map((file) => file.name).join(", ");
        if (key === "weight") return row.weight;
        if (key === "value") return row.value;
        if (key === "cbm") return row.cbm;
        if (key === "pkgs") return row.pkgs;
        return String(row[key]);
    };

    const handleCreateManifest = () => {
        if (selectedRows.length === 0) return;
        const firstStock = selectedRows[0];
        navigate("/manifest/manifest-create", {
            state: {
                stocks: selectedRows.map((row) => ({
                    id: row.id,
                    vessel: row.vessel,
                    stock_id: row.stock_id,
                    station: row.station,
                    arrival_date: row.arrival_date,
                    supplier: row.supplier,
                    po_no: row.po_no,
                    pkgs: row.pkgs,
                    weight: row.weight,
                    cbm: row.cbm,
                    value: row.value,
                    stock_status: row.stock_status,
                    docs: row.docs,
                    charges: row.charges,
                })),
                initialValues: {
                    client: firstStock.client,
                    vessel: firstStock.vessel,
                    stationCode: firstStock.station,
                },
            },
        });
    };

    const handleExportExcel = () => {
        const csvCell = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
        const csv = [
            exportColumns.map((column) => csvCell(column.label)).join(","),
            ...selectedRows.map((row) => exportColumns.map((column) => csvCell(exportValue(row, column.key))).join(",")),
        ].join("\r\n");
        const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = "stock-list.csv";
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 0);
    };

    const handleExportPdf = () => {
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;
        const escapeHtml = (value: string | number) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
        const headings = exportColumns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join("");
        const body = selectedRows.map((row) => `<tr>${exportColumns.map((column) => `<td>${escapeHtml(exportValue(row, column.key))}</td>`).join("")}</tr>`).join("");
        printWindow.document.write(`<html><head><title>Stock List</title><style>body{font-family:Arial,sans-serif}table{border-collapse:collapse;width:100%;font-size:10px}th,td{border:1px solid #bbb;padding:6px;text-align:left}th{background:#eee}</style></head><body><h2>Stock List</h2><table><thead><tr>${headings}</tr></thead><tbody>${body}</tbody></table><script>window.onload=()=>{window.print();window.close()}</script></body></html>`);
        printWindow.document.close();
    };

    const handleSelectAll = () => setSelected((current) => allOnPageSelected
        ? current.filter((id) => !pageIds.includes(id))
        : [...new Set([...current, ...pageIds])]);

    const handleDelete = (row: Stock) => {
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
        const subject = encodeURIComponent(`Stock ${row.stock_id}`);
        const body = encodeURIComponent(`Stock: ${row.stock_id}\nClient: ${row.client}\nStation: ${row.station}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };

    const handlePageChange = (_event: unknown, nextPage: number) => setPage(nextPage);
    const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(Number.parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <>
        {selectedRows.length > 0 && <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap", px: 2, py: 1, mb: 1, bgcolor: "action.hover", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>{selectedRows.length} items selected</Typography>
                <Button startIcon={<CheckCircleOutlinedIcon />}variant="contained" size="small" color="primary" onClick={handleCreateManifest} sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 1 }}>Create Manifest</Button>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1, flexWrap: "wrap", ml: "auto" }}>
                <Button variant="contained" size="small" color="success" startIcon={<FileDownloadOutlinedIcon />} onClick={handleExportExcel} sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 1.5 }}>Export Excel</Button>
                <Button variant="contained" size="small" color="secondary" startIcon={<FileDownloadOutlinedIcon />} onClick={handleExportPdf} sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 1.5 }}>Export PDF</Button>
                <Button variant="contained" size="small" color="success" startIcon={<FileDownloadOutlinedIcon />} onClick={handleExportExcel} sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 1.5 }}>Stock Doc</Button>
                <Button variant="contained" size="small" color="success" startIcon={<FileDownloadOutlinedIcon />} onClick={handleExportExcel} sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 1.5 }}>China Docs</Button>
            </Box>
        </Box>}
        <Paper elevation={2} sx={{ mt: 2, borderRadius: "8px 8px 16px 16px", border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: HEADER_HEIGHT + ROW_HEIGHT * 15, overflow: "auto" }}>
                <Table size="small" stickyHeader sx={(theme) => ({
                    width: totalWidth,
                    minWidth: "100%",
                    tableLayout: "fixed",
                    "& .MuiTableCell-root": { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", px: 1, borderColor: theme.palette.divider },
                    "& .MuiTableCell-head": { position: "relative", zIndex: 1, fontWeight: 700, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: 0.35, lineHeight: 1.2, py: 0.75, bgcolor: "background.paper", borderBottom: `2px solid ${theme.palette.divider}` },
                    "& .col-resizer": {
                        position: "absolute", top: 0, right: 0, height: "100%", width: 10,
                        cursor: "col-resize", display: "flex", justifyContent: "flex-end",
                        userSelect: "none", touchAction: "none",
                        "&::after": { content: '""', width: 2, height: "60%", alignSelf: "center", borderRadius: 1, bgcolor: "divider", transition: "background-color .15s" },
                        "&:hover::after": { bgcolor: "primary.main" },
                    },
                    "& .MuiTableCell-body": { fontSize: "0.7rem", lineHeight: 1.3, py: 0, height: ROW_HEIGHT },
                    "& .MuiTableBody-root .MuiTableRow-root:hover": { bgcolor: theme.palette.action.hover },
                    "& .MuiTableBody-root .MuiTableRow-root.Mui-selected": { bgcolor: alpha(theme.palette.primary.main, 0.08) },
                    "& .col-actions": { position: "sticky", right: 0, bgcolor: "background.paper", boxShadow: "-6px 0 8px -6px rgba(0,0,0,0.25)", overflow: "visible", zIndex: 2 },
                    "& .MuiTableCell-head.col-actions": { zIndex: 4 },
                    "& .MuiTableBody-root .MuiTableRow-root:hover .col-actions": { backgroundImage: `linear-gradient(${theme.palette.action.hover}, ${theme.palette.action.hover})` },
                    "& .MuiTableBody-root .MuiTableRow-root.Mui-selected .col-actions": { backgroundImage: `linear-gradient(${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.primary.main, 0.08)})` },
                })}>
                    <colgroup>
                        <col style={{ width: CHECKBOX_COL_WIDTH }} />
                        {columns.map((column) => <col key={column.key} style={{ width: widths[column.key] }} />)}
                        <col style={{ width: ACTIONS_COL_WIDTH }} />
                    </colgroup>
                    <TableHead sx={{ height: HEADER_HEIGHT }}>
                        <TableRow>
                            <TableCell padding="checkbox"><Checkbox size="small" checked={allOnPageSelected} indeterminate={someOnPageSelected} onChange={handleSelectAll} /></TableCell>
                            {columns.map((column) => <TableCell key={column.key} align={column.align} title={column.label}>
                                {column.label}
                                <Box className="col-resizer" onMouseDown={(event) => startResize(column.key, event)} onDoubleClick={() => resetWidth(column.key)} />
                            </TableCell>)}
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
                                    if (column.key === "stock_status") {
                                        const color = statusColor(row.stock_status);
                                        return <TableCell key={column.key}><Chip size="small" label={row.stock_status} color={color} variant="outlined" sx={(theme) => ({ height: 20, fontSize: "0.65rem", fontWeight: 600, bgcolor: alpha(theme.palette[color].main, 0.08) })} /></TableCell>;
                                    }
                                    if (column.key === "pickup") return <TableCell key={column.key} align="center"><Tooltip title={row.pickup ? "Pickup required" : "No pickup"}><span>{row.pickup ? <CheckCircleOutlinedIcon fontSize="small" color="success" /> : <HighlightOffIcon fontSize="small" color="error" />}</span></Tooltip></TableCell>;
                                    if (column.key === "docs") return <TableCell key={column.key} align="center"><FileCell files={row.docs} type="doc" /></TableCell>;
                                    if (column.key === "images") return <TableCell key={column.key} align="center"><FileCell files={row.images} type="image" /></TableCell>;
                                    let value: string | number = row[column.key] as string | number;
                                    if (column.key === "arrival_date") value = formatDate(row.arrival_date);
                                    if (column.key === "weight") value = `${row.weight.toLocaleString()} kg`;
                                    if (column.key === "cbm") value = row.cbm.toFixed(2);
                                    if (column.key === "value") value = `$${row.value.toLocaleString()}`;
                                    if (column.key === "stock_id") {
                                        return (
                                            <TableCell key={column.key}>
                                                <Button
                                                    size="small"
                                                    onClick={() => navigate(`/stocks/view/${row.id}`, { state: { stock: row } })}
                                                    sx={{ minWidth: 0, p: 0, textTransform: "none", fontSize: "inherit", fontWeight: 600, justifyContent: "flex-start" }}
                                                >
                                                    {row.stock_id}
                                                </Button>
                                            </TableCell>
                                        );
                                    }
                                    if (column.key === "existing_manifest") {
                                        return (
                                            <TableCell key={column.key}>
                                                <Button
                                                    size="small"
                                                    onClick={() => navigate(`/manifest/manifest-view/${encodeURIComponent(String(row.existing_manifest))}`, { state: { stock: row } })}
                                                    sx={{ minWidth: 0, p: 0, textTransform: "none", fontSize: "inherit", fontWeight: 600, justifyContent: "flex-start" }}
                                                >
                                                    {row.existing_manifest}
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
            <Box sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: { xs: 1.5, sm: 3 },
                px: 2,
                py: 1.5,
                borderTop: "2px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
            }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Selected totals ({selectedRows.length})</Typography>
                <Typography variant="body2"><Box component="span" sx={{ color: "text.secondary" }}>Pieces: </Box><strong>{selectedTotals.pkgs.toLocaleString()}</strong></Typography>
                <Typography variant="body2"><Box component="span" sx={{ color: "text.secondary" }}>Weight: </Box><strong>{selectedTotals.weight.toLocaleString()} kg</strong></Typography>
                <Typography variant="body2"><Box component="span" sx={{ color: "text.secondary" }}>CBM: </Box><strong>{selectedTotals.cbm.toFixed(2)}</strong></Typography>
                <Typography variant="body2"><Box component="span" sx={{ color: "text.secondary" }}>Value: </Box><strong>${selectedTotals.value.toLocaleString()}</strong></Typography>
            </Box>
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
                slotProps={{ paper: { sx: { borderRadius: 3, p: 1,mb:50, boxShadow: (theme) => theme.shadows[10] } } }}
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
                        {deleteTarget?.stock_id ? (
                            <Box component="span" sx={{ fontWeight: 600, color: "error.main" }}>
                                {deleteTarget.stock_id}
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
        </>
    );
}
