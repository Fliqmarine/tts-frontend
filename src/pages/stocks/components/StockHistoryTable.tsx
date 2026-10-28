import {
    Box,
    Checkbox,
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Tooltip,
    IconButton,
    Button,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { useMemo, useState, type ChangeEvent, type MouseEvent as ReactMouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FileCell } from "./StockFollowupTable";
import type { StockHistoryTableProps } from "../types/Stocks.types";

type HistoryRow = {
    id: number;
    arrivalDate: string;
    station: string;
    stockId: string;
    vessel: string;
    client: string;
    poNumber: string;
    supplier: string;
    pkgs: number;
    weight: number;
    cbm: number;
    value: number;
    transitNumber: string;
    stockStatus: "Pending" | "In Progress" | "Completed";
    pickup: boolean;
    docs: { name: string; url: string }[];
    images: { name: string; url: string }[];
};

type HistoryColumn = { key: keyof Omit<HistoryRow, "id">; label: string; width: number; align?: "left" | "center" | "right" };

// Table columns and sample rows
const columns: HistoryColumn[] = [
    { key: "arrivalDate", label: "Arrival Date", width: 120 },
    { key: "station", label: "Station", width: 130 },
    { key: "stockStatus", label: "Stock Status", width: 125 },
    { key: "stockId", label: "Stock ID", width: 135 },
    { key: "vessel", label: "Vessel", width: 145 },
    { key: "client", label: "Client", width: 145 },
    { key: "poNumber", label: "PO No", width: 135 },
    { key: "supplier", label: "Supplier", width: 140 },
    { key: "pkgs", label: "PKGS", width: 75, align: "right" },
    { key: "weight", label: "Weight (KGS)", width: 110, align: "right" },
    { key: "cbm", label: "CBM", width: 85, align: "right" },
    { key: "value", label: "Value", width: 105, align: "right" },
    { key: "transitNumber", label: "Transit", width: 125 },
    { key: "pickup", label: "Pickup", width: 80, align: "center" },
    { key: "docs", label: "Docs", width: 75, align: "center" },
    { key: "images", label: "Images", width: 75, align: "center" },
];

const demoHistory: HistoryRow[] = [
    { id: 1, arrivalDate: "2026-09-12", station: "ICN-TTS-E 1", stockId: "STK-2609001", vessel: "Vessel 1", client: "Client 1", poNumber: "PO-26002779", supplier: "Supplier 1", pkgs: 10, weight: 100, cbm: 1.25, value: 1000, transitNumber: "TR-10001", stockStatus: "Pending", pickup: true, docs: [{ name: "invoice.pdf", url: "/files/invoice.pdf" }], images: [{ name: "cargo-front.jpg", url: "/files/cargo-front.jpg" }] },
    { id: 2, arrivalDate: "2026-08-18", station: "DXB-TTS-02", stockId: "STK-2609002", vessel: "Vessel 2", client: "Client 2", poNumber: "PO-26003403", supplier: "Supplier 2", pkgs: 24, weight: 840, cbm: 4.8, value: 7200, transitNumber: "TR-10002", stockStatus: "In Progress", pickup: false, docs: [{ name: "packing-list.pdf", url: "/files/packing-list.pdf" }], images: [] },
    { id: 3, arrivalDate: "2026-09-26", station: "SIN-TTS-03", stockId: "STK-2609003", vessel: "Vessel 3", client: "Client 3", poNumber: "PO-26004111", supplier: "Supplier 3", pkgs: 6, weight: 52, cbm: 0.72, value: 2150, transitNumber: "TR-10003", stockStatus: "Completed", pickup: true, docs: [], images: [{ name: "container.jpg", url: "/files/container.jpg" }] },
    { id: 4, arrivalDate: "2026-07-22", station: "LHR-TTS-04", stockId: "STK-2609004", vessel: "Vessel 2", client: "Client 1", poNumber: "PO-26005102", supplier: "Supplier 2", pkgs: 18, weight: 1200, cbm: 7.4, value: 18400, transitNumber: "TR-10004", stockStatus: "Pending", pickup: false, docs: [{ name: "invoice-04.pdf", url: "/files/invoice-04.pdf" }], images: [] },
    { id: 5, arrivalDate: "2026-09-04", station: "JFK-TTS-05", stockId: "STK-2609005", vessel: "Vessel 1", client: "Client 2", poNumber: "PO-26006008", supplier: "Supplier 1", pkgs: 3, weight: 16, cbm: 0.18, value: 340, transitNumber: "TR-10005", stockStatus: "In Progress", pickup: true, docs: [{ name: "entry.pdf", url: "/files/entry.pdf" }], images: [] },
    { id: 6, arrivalDate: "2026-08-01", station: "HND-TTS-06", stockId: "STK-2609006", vessel: "Vessel 3", client: "Client 3", poNumber: "PO-26007110", supplier: "Supplier 3", pkgs: 42, weight: 2260, cbm: 12.6, value: 39800, transitNumber: "TR-10006", stockStatus: "Pending", pickup: false, docs: [], images: [] },
];

const HEADER_HEIGHT = 42;
const ROW_HEIGHT = 38;
const CHECKBOX_COL_WIDTH = 44;
const ACTIONS_COL_WIDTH = 88;
const MIN_COL_WIDTH = 60;
const defaultWidths = Object.fromEntries(columns.map(({ key, width }) => [key, width])) as Record<HistoryColumn["key"], number>;
const formatDate = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString();
const statusColor = (status: HistoryRow["stockStatus"]) => status === "Completed" ? "success" : status === "In Progress" ? "info" : "warning";

export default function StockHistoryTable({ filters }: StockHistoryTableProps) {
    // Table state and stock context
    const location = useLocation();
    const navigate = useNavigate();
    const selectedStock = (location.state as { stock?: Record<string, unknown> } | null)?.stock;
    const [selected, setSelected] = useState<number[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [widths, setWidths] = useState(defaultWidths);

    // Build the rows from the selected stock, or use demo history rows
    const rows = useMemo(() => {
        if (!selectedStock) return demoHistory;
        const sample = demoHistory[0];
        const asString = (key: string, fallback: string) => String(selectedStock[key] ?? fallback);
        const asNumber = (key: string, fallback: number) => Number(selectedStock[key] ?? fallback);
        return [{
            ...sample,
            id: asNumber("id", sample.id),
            arrivalDate: asString("arrival_date", sample.arrivalDate),
            station: asString("station", sample.station),
            stockId: asString("stock_id", sample.stockId),
            vessel: asString("vessel", sample.vessel),
            client: asString("client", sample.client),
            poNumber: asString("po_no", sample.poNumber),
            supplier: asString("supplier", sample.supplier),
            pkgs: asNumber("pkgs", sample.pkgs),
            weight: asNumber("weight", sample.weight),
            cbm: asNumber("cbm", sample.cbm),
            value: asNumber("value", sample.value),
            transitNumber: asString("transit_no", sample.transitNumber),
            stockStatus: asString("stock_status", sample.stockStatus) as HistoryRow["stockStatus"],
            pickup: Boolean(selectedStock.pickup ?? sample.pickup),
            docs: Array.isArray(selectedStock.docs) ? selectedStock.docs as HistoryRow["docs"] : sample.docs,
            images: Array.isArray(selectedStock.images) ? selectedStock.images as HistoryRow["images"] : sample.images,
        }];
    }, [selectedStock]);

    // Filtering
    const filteredRows = useMemo(() => rows.filter((row) => {
        const search = filters.search.trim().toLowerCase();
        const searchable = [row.arrivalDate, row.station, row.stockId, row.vessel, row.client, row.poNumber, row.supplier, row.transitNumber, row.stockStatus].join(" ").toLowerCase();
        return searchable.includes(search)
            && (!filters.client || row.client === filters.client)
            && (!filters.vessel || row.vessel === filters.vessel)
            && (!filters.station || row.station === filters.station)
            && (!filters.supplier || row.supplier === filters.supplier)
            && (!filters.po_no || row.poNumber.toLowerCase().includes(filters.po_no.toLowerCase()))
            && (!filters.transit_no || row.transitNumber.toLowerCase().includes(filters.transit_no.toLowerCase()))
            && (!filters.status || row.stockStatus === filters.status)
            && (!filters.fromDate || row.arrivalDate >= filters.fromDate)
            && (!filters.toDate || row.arrivalDate <= filters.toDate);
    }), [filters, rows]);

    // Pagination and selection state
    const pageCount = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
    const safePage = Math.min(page, pageCount - 1);
    const pageRows = filteredRows.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage);
    const pageIds = pageRows.map((row) => row.id);
    const allOnPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.includes(id));
    const someOnPageSelected = pageIds.some((id) => selected.includes(id)) && !allOnPageSelected;
    const totalWidth = CHECKBOX_COL_WIDTH + ACTIONS_COL_WIDTH + columns.reduce((sum, column) => sum + widths[column.key], 0);

    const handleSelectAll = () => setSelected((current) => allOnPageSelected
        ? current.filter((id) => !pageIds.includes(id))
        : [...new Set([...current, ...pageIds])]);

    const handleSelectRow = (id: number) => setSelected((current) => current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id]);

    // Resizable table columns
    const startResize = (key: HistoryColumn["key"], event: ReactMouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        const startX = event.clientX;
        const startWidth = widths[key];
        const onMove = (moveEvent: MouseEvent) => setWidths((current) => ({ ...current, [key]: Math.max(MIN_COL_WIDTH, startWidth + moveEvent.clientX - startX) }));
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

    // Pagination controls
    const handlePageChange = (_event: unknown, nextPage: number) => setPage(nextPage);
    const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(Number.parseInt(event.target.value, 10));
        setPage(0);
    };

    // Selection toolbar and file exports
    const selectedRows = filteredRows.filter((row) => selected.includes(row.id));
    const exportColumns = columns;
    const exportValue = (row: HistoryRow, key: HistoryColumn["key"]): string | number => {
        if (key === "arrivalDate") return row.arrivalDate;
        if (key === "weight") return row.weight;
        if (key === "value") return row.value;
        if (key === "cbm") return row.cbm;
        if (key === "pkgs") return row.pkgs;
        if (key === "pickup") return row.pickup ? "Yes" : "No";
        if (key === "docs" || key === "images") return row[key].map((file) => file.name).join(", ");
        return String(row[key]);
    };
    const handleExportExcel = () => {
        const csvCell = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
        const csv = [
            exportColumns.map((column) => csvCell(column.label)).join(","),
            ...selectedRows.map((row) => exportColumns.map((column) => csvCell(exportValue(row, column.key))).join(",")),
        ].join("\r\n");
        const link = document.createElement("a");
        link.href = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
        link.download = "stock-history.csv";
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(link.href), 0);
    };
    const handleExportPdf = () => {
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;
        const headings = exportColumns.map((column) => `<th>${column.label}</th>`).join("");
        const body = selectedRows.map((row) => `<tr>${exportColumns.map((column) => `<td>${String(exportValue(row, column.key)).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</td>`).join("")}</tr>`).join("");
        printWindow.document.write(`<html><head><title>Stock History</title><style>body{font-family:Arial,sans-serif}table{border-collapse:collapse;width:100%;font-size:10px}th,td{border:1px solid #bbb;padding:6px;text-align:left}th{background:#eee}</style></head><body><h2>Stock History</h2><table><thead><tr>${headings}</tr></thead><tbody>${body}</tbody></table><script>window.onload=()=>{window.print();window.close()}</script></body></html>`);
        printWindow.document.close();
    };

    // Table and pagination rendering
    return (
        <>
        {selectedRows.length > 0 && <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1, mb: 1, bgcolor: "action.hover", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
            <Box component="span" sx={{ color: "primary.main", fontWeight: 600, fontSize: "0.875rem" }}>{selectedRows.length} items selected</Box>
            <Box sx={{ display: "flex", gap: 1 }}>
                <Button variant="contained" size="small" color="success" startIcon={<FileDownloadOutlinedIcon />} onClick={handleExportExcel} sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 2.5 }}>Export Excel</Button>
                <Button variant="contained" size="small" color="secondary" startIcon={<FileDownloadOutlinedIcon />} onClick={handleExportPdf} sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 2.5 }}>Export PDF</Button>
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
                    "& .MuiTableCell-body": { fontSize: "0.7rem", lineHeight: 1.3, py: 0, height: ROW_HEIGHT },
                    "& .MuiTableBody-root .MuiTableRow-root:hover": { bgcolor: theme.palette.action.hover },
                    "& .MuiTableBody-root .MuiTableRow-root.Mui-selected": { bgcolor: alpha(theme.palette.primary.main, 0.08) },
                    "& .col-actions": { position: "sticky", right: 0, bgcolor: "background.paper", boxShadow: "-6px 0 8px -6px rgba(0,0,0,0.25)", overflow: "visible", zIndex: 2 },
                    "& .MuiTableCell-head.col-actions": { zIndex: 4 },
                    "& .MuiTableBody-root .MuiTableRow-root:hover .col-actions": { backgroundImage: `linear-gradient(${theme.palette.action.hover}, ${theme.palette.action.hover})` },
                    "& .MuiTableBody-root .MuiTableRow-root.Mui-selected .col-actions": { backgroundImage: `linear-gradient(${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.primary.main, 0.08)})` },
                    "& .col-resizer": { position: "absolute", top: 0, right: 0, height: "100%", width: 10, cursor: "col-resize", display: "flex", justifyContent: "flex-end", userSelect: "none", touchAction: "none", "&::after": { content: '""', width: 2, height: "60%", alignSelf: "center", borderRadius: 1, bgcolor: "divider", transition: "background-color .15s" }, "&:hover::after": { bgcolor: "primary.main" } },
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
                                <Box className="col-resizer" onMouseDown={(event) => startResize(column.key, event)} onDoubleClick={() => setWidths((current) => ({ ...current, [column.key]: defaultWidths[column.key] }))} />
                            </TableCell>)}
                            <TableCell align="center" className="col-actions">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pageRows.length === 0 ? <TableRow><TableCell colSpan={columns.length + 2} align="center" sx={{ py: 5, color: "text.secondary" }}>No stocks found</TableCell></TableRow> : pageRows.map((row) => (
                            <TableRow key={row.id} hover selected={selected.includes(row.id)}>
                                <TableCell padding="checkbox"><Checkbox size="small" checked={selected.includes(row.id)} onChange={() => handleSelectRow(row.id)} /></TableCell>
                                {columns.map((column) => {
                                    const value = row[column.key];
                                    if (column.key === "stockStatus") {
                                        const color = statusColor(row.stockStatus);
                                        return <TableCell key={column.key}><Chip size="small" label={row.stockStatus} color={color} variant="outlined" sx={(theme) => ({ height: 20, fontSize: "0.65rem", fontWeight: 600, bgcolor: alpha(theme.palette[color].main, 0.08) })} /></TableCell>;
                                    }
                                    if (column.key === "pickup") return <TableCell key={column.key} align="center"><Tooltip title={row.pickup ? "Pickup required" : "No pickup"}><span>{row.pickup ? <CheckCircleOutlinedIcon fontSize="small" color="success" /> : <HighlightOffIcon fontSize="small" color="error" />}</span></Tooltip></TableCell>;
                                    if (column.key === "docs") return <TableCell key={column.key} align="center"><FileCell files={row.docs} type="doc" /></TableCell>;
                                    if (column.key === "images") return <TableCell key={column.key} align="center"><FileCell files={row.images} type="image" /></TableCell>;
                                    if (column.key === "arrivalDate") return <TableCell key={column.key} title={row.arrivalDate}>{formatDate(row.arrivalDate)}</TableCell>;
                                    if (column.key === "weight") return <TableCell key={column.key} align={column.align} title={`${row.weight.toLocaleString()} kg`}>{row.weight.toLocaleString()} kg</TableCell>;
                                    if (column.key === "cbm") return <TableCell key={column.key} align={column.align} title={row.cbm.toFixed(2)}>{row.cbm.toFixed(2)}</TableCell>;
                                    if (column.key === "value") return <TableCell key={column.key} align={column.align} title={`$${row.value.toLocaleString()}`}>${row.value.toLocaleString()}</TableCell>;
                                    return <TableCell key={column.key} align={column.align} title={String(value)}>{value}</TableCell>;
                                })}
                                <TableCell align="center" className="col-actions">
                                    <Box sx={{ display: "flex", justifyContent: "center", gap: 0.25 }}>
                                        <Tooltip title="View stock">
                                            <IconButton size="small" color="primary" aria-label="View stock" onClick={() => navigate(`/stocks/view/${row.id}`, { state: { stock: selectedStock ?? row } })} sx={{ p: 0.4 }}>
                                                <VisibilityIcon sx={{ fontSize: 16 }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Stock logs">
                                            <IconButton size="small" color="secondary" aria-label="Stock logs" onClick={() => navigate("/stocks/history", { state: { stock: selectedStock ?? row } })} sx={{ p: 0.4 }}>
                                                <HistoryOutlinedIcon sx={{ fontSize: 16 }} />
                                            </IconButton>
                                        </Tooltip>
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
        </Paper>
        </>
    );
}
