import FileCopyIcon from '@mui/icons-material/FileCopy';import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CancelIcon from '@mui/icons-material/Cancel';import EditIcon from "@mui/icons-material/Edit";
import MailOutlineIcon from "@mui/icons-material/Mail";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useMemo, useState, type MouseEvent as ReactMouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { PreAlertDetails } from "../types/preAlert.types";
import type { PreAlertStage1Filters } from "./PreAlertStage1Filter";
import { FileCell } from "../../stocks/components/StockFollowupTable";
import type { FileItem } from "../../stocks/types/Stocks.types";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";


const PRE_ALERT_STORAGE_KEY = "tts-demo-pre-alerts";
const STAGE2_STORAGE_KEY = "tts-demo-pre-alert-stage-2";
const ROW_HEIGHT = 36;
const HEADER_HEIGHT = 44;
const ACTIONS_COL_WIDTH = 220;
const CHECKBOX_COL_WIDTH = 44;
const MIN_COL_WIDTH = 60;
const TRANSIT_COLUMNS = ["Vessel", "Stock Id", "Station", "Date", "Supplier", "PO No", "PKGS", "Weight (KGS)", "Value", "Status"];
const TRANSIT_DEFAULT_WIDTHS = [130, 110, 110, 70, 150, 150, 60, 100, 100, 80];

const columns = [
  { label: "Date", width: 80 }, { label: "Manifest", width: 135 }, { label: "Vessel", width: 150 },
  { label: "Hub", width: 100 }, { label: "Mode", width: 90 }, { label: "Origin", width: 95 },
  { label: "Destination", width: 105 }, { label: "No. of Packages", width: 115 }, { label: "Total Weight (KGS)", width: 125 },
  { label: "AWN No", width: 120 }, { label: "Carrier / Airline Details", width: 155 }, { label: "ETD", width: 80 },
  { label: "ETA", width: 80 }, { label: "Pre-Alert Docs", width: 125 }, { label: "AWB", width: 50 },
  // { label: "POD", width: 105 }, 
  { label: "Distance", width: 90 },
];

const demoRows: PreAlertTableRow[] = [
  { id: "demo-prealert-1", manifestId: "MAN-26001", manifestNumber: "MAN-26001", createdAt: "2026-10-10T09:30:00.000Z", client: "Northstar Marine", vessel: "Ocean Pioneer", hub: "Singapore", mode: "Air", origin: "SIN", destination: "LHR", packageCount: 12, totalWeight: 845, masterAwbNumber: "618-12345675", houseAwbNumber: "NSM-001", airlineName: "Singapore Airlines", etd: "2026-10-18", eta: "2026-10-19", documentNames: ["invoice.pdf", "packing-list.pdf"], awbDocumentNames: ["master-awb-61812345675.pdf", "house-awb-NSM001.pdf"], distance: "10,870 km", consigneeAddress: "London consignee", consignee: "Northstar UK", remarks: "Priority shipment", status: "Pending", stage: 1 },
  { id: "demo-prealert-2", manifestId: "MAN-26002", manifestNumber: "MAN-26002", createdAt: "2026-10-11T13:15:00.000Z", client: "Bluewater Logistics", vessel: "Atlantic Star", hub: "Dubai", mode: "Air", origin: "DXB", destination: "FRA", packageCount: 8, totalWeight: 520, masterAwbNumber: "176-98765432", houseAwbNumber: "BW-208", airlineName: "Emirates SkyCargo", etd: "2026-10-20", eta: "2026-10-21", documentNames: ["pre-alert.pdf"], awbDocumentNames: ["awb-17698765432.pdf"], distance: "4,845 km", consigneeAddress: "Frankfurt consignee", consignee: "Bluewater GmbH", remarks: "", status: "Pending", stage: 1 },
  { id: "demo-prealert-3", manifestId: "MAN-26003", manifestNumber: "MAN-26003", createdAt: "2026-10-12T07:45:00.000Z", client: "Apex Industrial", vessel: "Pacific Meridian", hub: "Hong Kong", mode: "Air", origin: "HKG", destination: "LAX", packageCount: 24, totalWeight: 1630, masterAwbNumber: "160-34567891", houseAwbNumber: "APX-778", airlineName: "Cathay Cargo", etd: "2026-10-22", eta: "2026-10-22", documentNames: ["commercial-invoice.pdf", "packing-list-APX778.pdf"], awbDocumentNames: ["master-awb-16034567891.pdf"], distance: "11,650 km", consigneeAddress: "Los Angeles consignee", consignee: "Apex USA", remarks: "", status: "Pending", stage: 1 },
];

type PreAlertTableRow = PreAlertDetails & {
  destinationPort?: string;
  awnNumber?: string;
  podDocumentNames?: string[];
  // pod?: string;
};

type PreAlertStage1TableProps = {
  filters?: PreAlertStage1Filters;
  rows?: PreAlertTableRow[];
};

const readRows = (key: string): PreAlertTableRow[] => {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value as PreAlertTableRow[] : [];
  } catch {
    return [];
  }
};

const formatDate = (value: string) => value ? new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString() : "—";
const show = (value?: string | number) => value === undefined || value === "" ? "—" : value;
const toFileItems = (names: string[]): FileItem[] => names.map((name) => ({ name, url: `/files/${encodeURIComponent(name)}` }));

export default function PreAlertStage1Table({ filters, rows: suppliedRows }: PreAlertStage1TableProps) {
  const navigate = useNavigate();
  const [rows, setRows] = useState<PreAlertTableRow[]>(() => suppliedRows ?? (readRows(PRE_ALERT_STORAGE_KEY).length ? readRows(PRE_ALERT_STORAGE_KEY) : demoRows));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [cancelTarget, setCancelTarget] = useState<PreAlertTableRow | null>(null);
  const [transitTarget, setTransitTarget] = useState<PreAlertTableRow | null>(null);
  const [completeTarget, setCompleteTarget] = useState<PreAlertTableRow | null>(null);
  const [podFiles, setPodFiles] = useState<File[]>([]);
  const [completePodFiles, setCompletePodFiles] = useState<File[]>([]);
  const [transitWidths, setTransitWidths] = useState(TRANSIT_DEFAULT_WIDTHS);
  const [widths, setWidths] = useState<Record<number, number>>(() => Object.fromEntries(columns.map((column, index) => [index, column.width])));
  const totalWidth = CHECKBOX_COL_WIDTH + columns.reduce((sum, _, index) => sum + widths[index], 0) + ACTIONS_COL_WIDTH;

  const startResize = (index: number, event: ReactMouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const startX = event.clientX;
    const startWidth = widths[index];
    const onMove = (moveEvent: MouseEvent) => setWidths((current) => ({ ...current, [index]: Math.max(MIN_COL_WIDTH, startWidth + moveEvent.clientX - startX) }));
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

  const resetWidth = (index: number) => setWidths((current) => ({ ...current, [index]: columns[index].width }));

  const startTransitResize = (index: number, event: ReactMouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const startX = event.clientX;
    const startWidth = transitWidths[index];
    const onMove = (moveEvent: MouseEvent) => setTransitWidths((current) => current.map((width, columnIndex) => columnIndex === index ? Math.max(MIN_COL_WIDTH, startWidth + moveEvent.clientX - startX) : width));
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

  const visibleRows = useMemo(() => {
    const query = filters?.search.trim().toLowerCase() ?? "";
    return rows.filter((row) => {
      if ((row.stage ?? 1) !== 1) return false;
      if (filters?.client && row.client !== filters.client) return false;
      if (filters?.vessel && row.vessel !== filters.vessel) return false;
      if (filters?.hub && row.hub !== filters.hub) return false;
      if (filters?.status && row.status !== filters.status) return false;
      if (filters?.vesselPo && !row.vesselPo?.toLowerCase().includes(filters.vesselPo.toLowerCase())) return false;
      if (filters?.keyAccountManager && row.keyAccountManager !== filters.keyAccountManager) return false;
      if (filters?.consignee && row.consignee !== filters.consignee) return false;
      if (filters?.destinationPort && (row.destinationPort ?? row.destination) !== filters.destinationPort) return false;
      if (filters?.stage && filters.stage !== "Stage 1") return false;
      if (filters?.manifestNo && !row.manifestNumber.toLowerCase().includes(filters.manifestNo.toLowerCase())) return false;
      if (filters?.awbNumber && !`${row.awnNumber ?? row.masterAwbNumber} ${row.houseAwbNumber}`.toLowerCase().includes(filters.awbNumber.toLowerCase())) return false;
      if (filters?.fromDate && row.createdAt.slice(0, 10) < filters.fromDate) return false;
      if (filters?.toDate && row.createdAt.slice(0, 10) > filters.toDate) return false;
      return !query || [row.manifestNumber, row.client, row.vessel, row.origin, row.destination, row.masterAwbNumber, row.houseAwbNumber].some((value) => value?.toLowerCase().includes(query));
    });
  }, [filters, rows]);

  const safePage = Math.min(page, Math.max(0, Math.ceil(visibleRows.length / rowsPerPage) - 1));
  const pageRows = visibleRows.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage);
  const pageIds = pageRows.map((row) => row.id);
  const allOnPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.includes(id));
  const someOnPageSelected = pageIds.some((id) => selected.includes(id)) && !allOnPageSelected;
  const selectedRows = visibleRows.filter((row) => selected.includes(row.id));
  const toggleAll = () => setSelected((current) => allOnPageSelected
    ? current.filter((id) => !pageIds.includes(id))
    : [...new Set([...current, ...pageIds])]);
  const toggleRow = (id: string) => setSelected((current) => current.includes(id)
    ? current.filter((selectedId) => selectedId !== id)
    : [...current, id]);

  const persist = (nextRows: PreAlertTableRow[]) => {
    setRows(nextRows);
    if (!suppliedRows) localStorage.setItem(PRE_ALERT_STORAGE_KEY, JSON.stringify(nextRows));
  };

  const copyRow = async (row: PreAlertTableRow) => {
    const text = `Manifest: ${row.manifestNumber}\nVessel: ${row.vessel ?? ""}\nOrigin: ${row.origin}\nDestination: ${row.destination}\nAWB: ${row.masterAwbNumber} ${row.houseAwbNumber}`;
    try { await navigator.clipboard.writeText(text); } catch { /* Clipboard can be unavailable outside a secure browser context. */ }
  };

  const openCompleteDialog = (row: PreAlertTableRow) => {
    setCompletePodFiles([]);
    setCompleteTarget(row);
  };

  const confirmComplete = () => {
    if (!completeTarget || completePodFiles.length === 0) return;
    const completedRow = {
      ...completeTarget,
      stage: 3,
      podDocumentNames: completePodFiles.length ? [...(completeTarget.podDocumentNames ?? []), ...completePodFiles.map((file) => file.name)] : completeTarget.podDocumentNames ?? [],
    };
    persist(rows.filter((item) => item.id !== completeTarget.id));
    localStorage.setItem(STAGE3_STORAGE_KEY, JSON.stringify([...readRows(STAGE3_STORAGE_KEY), completedRow]));
    setCompleteTarget(null);
    setCompletePodFiles([]);
  };

  const moveTransit = (row: PreAlertTableRow) => {
    setPodFiles([]);
    setTransitTarget(row);
  };

  const confirmTransit = () => {
    if (!transitTarget) return;
    const transitRow = {
      ...transitTarget,
      stage: 2,
      status: "In Transit",
      podDocumentNames: podFiles.length ? [...(transitTarget.podDocumentNames ?? []), ...podFiles.map((file) => file.name)] : transitTarget.podDocumentNames ?? [],
    };
    persist(rows.filter((item) => item.id !== transitTarget.id));
    localStorage.setItem(STAGE2_STORAGE_KEY, JSON.stringify([...readRows(STAGE2_STORAGE_KEY), transitRow]));
    setTransitTarget(null);
    setPodFiles([]);
  };

  const confirmCancelPreAlert = () => {
    if (!cancelTarget) return;
    persist(rows.filter((item) => item.id !== cancelTarget.id));
    setSelected((current) => current.filter((id) => id !== cancelTarget.id));
    setCancelTarget(null);
  };
  const mailRow = (row: PreAlertTableRow) => {
    const subject = encodeURIComponent(`Pre-Alert: Manifest ${row.manifestNumber}`);
    const body = encodeURIComponent(`Please find the pre-alert details for manifest ${row.manifestNumber}.\nOrigin: ${row.origin}\nDestination: ${row.destination}\nAWB: ${row.masterAwbNumber} ${row.houseAwbNumber}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };
  

  const exportValue = (row: PreAlertTableRow, index: number): string | number => {
    switch (index) {
      case 0: return formatDate(row.createdAt);
      case 1: return row.manifestNumber;
      case 2: return row.vessel ?? "";
      case 3: return row.hub ?? "";
      case 4: return row.mode ?? "";
      case 5: return row.origin;
      case 6: return row.destination;
      case 7: return row.packageCount ?? "";
      case 8: return row.totalWeight ?? "";
      case 9: return row.awnNumber ?? row.masterAwbNumber;
      case 10: return row.airlineName;
      case 11: return formatDate(row.etd);
      case 12: return formatDate(row.eta);
      case 13: return row.documentNames.join(", ");
      case 14: return row.awbDocumentNames?.join(", ") ?? "";
      // case 15: return row.pod ?? row.destinationPort ?? row.destination;
      case 16: return row.distance;
      default: return "";
    }
  };
  const handleExportExcel = () => {
    const csvCell = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
    const csv = [
      columns.map((column) => csvCell(column.label)).join(","),
      ...selectedRows.map((row) => columns.map((_, index) => csvCell(exportValue(row, index))).join(",")),
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "pre-alert-stage-1.csv";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };
  const handleExportPdf = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const escapeHtml = (value: string | number) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    const headings = columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join("");
    const body = selectedRows.map((row) => `<tr>${columns.map((_, index) => `<td>${escapeHtml(exportValue(row, index))}</td>`).join("")}</tr>`).join("");
    printWindow.document.write(`<html><head><title>Pre-Alert Stage 1</title><style>body{font-family:Arial,sans-serif}table{border-collapse:collapse;width:100%;font-size:10px}th,td{border:1px solid #bbb;padding:6px;text-align:left}th{background:#eee}</style></head><body><h2>Pre-Alert Stage 1</h2><table><thead><tr>${headings}</tr></thead><tbody>${body}</tbody></table><script>window.onload=()=>{window.print();window.close()}</script></body></html>`);
    printWindow.document.close();
  };

  return (
    <>
    {selectedRows.length > 0 && <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1, px: 2, py: 1, mb: 1, bgcolor: "action.hover", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
      <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>{selectedRows.length} items selected</Typography>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="contained" size="small" color="success" startIcon={<FileDownloadOutlinedIcon />} onClick={handleExportExcel}>Export Excel</Button>
        <Button variant="contained" size="small" color="secondary" startIcon={<FileDownloadOutlinedIcon />} onClick={handleExportPdf}>Export PDF</Button>
      </Box>
    </Box>}
    <Paper elevation={2} sx={{  borderRadius: "8px 8px 16px 16px", overflow: "hidden",border: "1px solid", borderColor: "divider" }}>
      <TableContainer sx={{ maxHeight: HEADER_HEIGHT + ROW_HEIGHT * 12, overflow: "auto" }}>
        <Table 
            size="small" 
            stickyHeader sx={(theme) => ({ 
                width: totalWidth, minWidth: "100%", tableLayout: "fixed", 
                "& .MuiTableCell-root": 
                    { whiteSpace: "nowrap", overflow: "hidden", 
                    textOverflow: "ellipsis", px: 1, 
                    borderColor: theme.palette.divider }, 
                "& .MuiTableCell-head": 
                    { position: "relative", zIndex: 1, fontWeight: 700, 
                    fontSize: "0.65rem", textTransform: "uppercase", 
                    letterSpacing: 0.35, lineHeight: 1.2, py: 0.75, 
                    bgcolor: "background.paper", 
                    borderBottom: `2px solid ${theme.palette.divider}` }, 
                "& .MuiTableCell-body": { fontSize: "0.7rem", lineHeight: 1.3, py: 0, 
                    height: ROW_HEIGHT }, 
                "& .MuiTableBody-root .MuiTableRow-root:hover": 
                    { bgcolor: theme.palette.action.hover }, 
                "& .col-resizer": { position: "absolute", top: 0, right: 0, 
                    height: "100%", width: 10, cursor: "col-resize", 
                    display: "flex", justifyContent: "flex-end", userSelect: "none", 
                    touchAction: "none", 
                "&::after": { content: '\"\"', width: 2, height: "60%", 
                    alignSelf: "center", borderRadius: 1, bgcolor: "divider", 
                    transition: "background-color .15s" }, 
                "&:hover::after": { bgcolor: "primary.main" } }, 
                "& .col-actions": { position: "sticky", right: 0, 
                    bgcolor: "background.paper", boxShadow: "-6px 0 8px -6px rgba(0,0,0,0.25)", 
                    overflow: "visible" }, 
                "& .MuiTableCell-head.col-actions": { zIndex: 4 } })}>
          <colgroup><col style={{ width: CHECKBOX_COL_WIDTH }} />{columns.map((_, index) => <col key={index} style={{ width: widths[index] }} />)}<col style={{ width: ACTIONS_COL_WIDTH }} /></colgroup>
          <TableHead sx={{ height: HEADER_HEIGHT }}><TableRow><TableCell padding="checkbox"><Checkbox size="small" checked={allOnPageSelected} indeterminate={someOnPageSelected} onChange={toggleAll} /></TableCell>{columns.map((column, index) => <TableCell key={column.label} title={column.label}>{column.label}<Box className="col-resizer" onMouseDown={(event) => startResize(index, event)} onDoubleClick={() => resetWidth(index)} /></TableCell>)}<TableCell align="center" className="col-actions">Actions</TableCell></TableRow></TableHead>
          <TableBody>
            {visibleRows.length === 0 ? <TableRow><TableCell colSpan={columns.length + 2} align="center" sx={{ py: 5, color: "text.secondary" }}>No Pre-Alerts found</TableCell></TableRow> : pageRows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell padding="checkbox"><Checkbox size="small" checked={selected.includes(row.id)} onChange={() => toggleRow(row.id)} /></TableCell>
                <TableCell>{formatDate(row.createdAt)}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => navigate(`/manifest/manifest-view/${encodeURIComponent(String(row.manifestId))}`)}
                    sx={{ minWidth: 0, p: 0, textTransform: "none", fontSize: "inherit", fontWeight: 700, color: "primary.main", justifyContent: "flex-start", gap: 0.5 }}
                  >
                    {show(row.manifestNumber)}
                    <OpenInNewIcon sx={{ fontSize: 14 }} />
                  </Button>
                </TableCell>
                <TableCell>
                  <Chip size="small" label={show(row.vessel)} variant="outlined"
                  sx={(theme) => ({
                    height: 22,
                    maxWidth: "100%",
                    fontWeight: 600,
                    color: theme.palette.mode === "dark" ? theme.palette.warning.light : theme.palette.warning.dark,
                    bgcolor: alpha(theme.palette.warning.main, theme.palette.mode === "dark" ? 0.2 : 0.12),
                    borderColor: alpha(theme.palette.warning.main, 0.5),
                    borderRadius: 1,
                    "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" },
                  })} />
                </TableCell>
                <TableCell>{show(row.hub)}</TableCell>
                <TableCell>
                  <Chip size="small" label={show(row.mode)} variant="outlined" 
                    sx={(theme) => ({ height: 22, maxWidth: "100%", fontWeight: 600, 
                      color: theme.palette.mode === "dark" ? theme.palette.warning.light : theme.palette.warning.dark, 
                      bgcolor: alpha(theme.palette.warning.main, theme.palette.mode === "dark" ? 0.2 : 0.12), 
                      borderRadius: 1, borderColor: alpha(theme.palette.warning.main, 0.5), 
                      "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" } 
                    })} 
                  />
                </TableCell>
                <TableCell>{show(row.origin)}</TableCell>
                <TableCell>{show(row.destination)}</TableCell>
                <TableCell>{show(row.packageCount)}</TableCell>
                <TableCell>{row.totalWeight == null ? "—" : row.totalWeight.toLocaleString()}</TableCell>
                <TableCell
                  // title="Double-click to open Track-Trace"
                  onDoubleClick={() => window.open("https://www.track-trace.com/", "_blank", "noopener,noreferrer")}
                  sx={{ cursor: "pointer", color: "primary.main", fontWeight: 700 }}
                >
                  {show(row.awnNumber ?? row.masterAwbNumber)}
                </TableCell>
                <TableCell>{show(row.airlineName)}</TableCell>
                <TableCell>{formatDate(row.etd)}</TableCell>
                <TableCell>{formatDate(row.eta)}</TableCell>
                <TableCell align="center"><FileCell files={toFileItems(row.documentNames)} type="doc" /></TableCell>
                <TableCell align="center"><FileCell files={toFileItems(row.awbDocumentNames ?? [])} type="doc" /></TableCell>
                {/* <TableCell>{show(row.pod ?? row.destinationPort ?? row.destination)}</TableCell> */}
                <TableCell sx={{ textAlign:"center" }}>{show(row.distance)}</TableCell>
                <TableCell align="center" sx={{ position: "sticky", right: 0, bgcolor: "background.paper", zIndex: 1,boxShadow: "-6px 0 8px -6px rgba(0,0,0,0.25)" }}>
                  <Box sx={{ display: "flex", justifyContent: "center", gap: 0.25 }}>
                    <Tooltip title="Copy"><IconButton size="small" color="warning" aria-label="Copy Pre-Alert" onClick={() => void copyRow(row)}><FileCopyIcon fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="View"><IconButton size="small" color="primary" aria-label="View Pre-Alert" onClick={() => navigate(`/jobs/pre-alert-view/${encodeURIComponent(row.id)}`, { state: { preAlert: row } })}><VisibilityIcon fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Edit"><IconButton size="small" color="primary" aria-label="Edit Pre-Alert" onClick={() => navigate(`/jobs/pre-alert-edit/${encodeURIComponent(row.id)}`, { state: { preAlert: row } })}><EditIcon fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Cancel Pre-Alert"><IconButton size="small" color="error" aria-label="Cancel Pre-Alert" onClick={() => setCancelTarget(row)}><CancelIcon fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Email"><IconButton size="small" color="success" aria-label="Email Pre-Alert" onClick={() => mailRow(row)}><MailOutlineIcon fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Transit"><IconButton size="small" color="error" aria-label="Transit Pre-Alert" onClick={() => moveTransit(row)}><AirportShuttleIcon fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Complete"><IconButton size="small" color="success" aria-label="Complete Pre-Alert" onClick={() => openCompleteDialog(row)}><CheckCircleOutlineIcon fontSize="small" /></IconButton></Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination component="div" count={visibleRows.length} page={safePage} rowsPerPage={rowsPerPage} onPageChange={(_, nextPage) => setPage(nextPage)} onRowsPerPageChange={(event) => { setRowsPerPage(Number(event.target.value)); setPage(0); }} rowsPerPageOptions={[10, 25, 50]} />
    </Paper>
    
    <Dialog
      open={cancelTarget !== null}
      onClose={() => setCancelTarget(null)}
      aria-labelledby="cancel-pre-alert-title"
      aria-describedby="cancel-pre-alert-description"
      fullWidth
      maxWidth="xs"
      slotProps={{ paper: { sx: { borderRadius: 3, p: 1,mb:50, boxShadow: (theme) => theme.shadows[10] } } }}
    >
      <DialogTitle
        id="cancel-pre-alert-title"
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
        <Typography variant="h6" component="h2" fontWeight={700}>Cancel Pre-Alert?</Typography>
      </DialogTitle>
      
      <DialogContent sx={{ textAlign: "center", pb: 1 }}>
        <Typography id="cancel-pre-alert-description" variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          Are you sure you want to cancel{" "}
          <Typography component="span" sx={{ fontWeight: 600, color: "error.main" }}>
            Pre-Alert {cancelTarget?.manifestNumber}
          </Typography>
          <Typography component="span" sx={{ fontWeight: 600, }}>{""} ?</Typography>
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pt: 2, pb: 3, gap: 1.5 }}>
        <Button onClick={() => setCancelTarget(null)} variant="outlined" color="inherit" fullWidth sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, borderColor: "divider" }}>
          Cancel
        </Button>
        <Button onClick={confirmCancelPreAlert} color="error" variant="contained" fullWidth autoFocus disableElevation sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
    
    <Dialog open={completeTarget !== null} onClose={() => { setCompleteTarget(null); setCompletePodFiles([]); }} fullWidth maxWidth="md" aria-labelledby="complete-pre-alert-title" sx={{ mb:50 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, pr: 3,my:3 }}>
        <DialogTitle id="complete-pre-alert-title" sx={{ fontWeight: 700, flex: 1 }}>
        Complete - PreAlert Number - <Box component="span" sx={{ color: "primary.main" }}>({completeTarget?.manifestNumber ?? ""})</Box>

        </DialogTitle>
        <DialogActions sx={{ flexShrink: 0, p: 0 }}>
          <Button onClick={() => { setCompleteTarget(null); setCompletePodFiles([]); }} variant="outlined" color="error" sx={{ textTransform: "none", fontWeight: 600 }}>Cancel</Button>
          <Button onClick={confirmComplete} variant="contained" color="success" disabled={completePodFiles.length === 0} startIcon={<CheckCircleOutlineIcon />} sx={{ textTransform: "none", fontWeight: 600 }}>Complete</Button>
        </DialogActions>
      </Box>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 1, p: 1.5 }}>
          <Button component="label" variant={completePodFiles.length ? "outlined" : "contained"} startIcon={completePodFiles.length ? <InsertDriveFileIcon /> : <CloudUploadOutlinedIcon />} sx={{ textTransform: "none", alignSelf: "flex-start" }}>
            {completePodFiles.length ? "Add more POD files" : "Upload POD *"}
            <input hidden required type="file" multiple accept="application/pdf,image/jpeg,image/png,image/webp" onChange={(event) => { setCompletePodFiles((current) => [...current, ...Array.from(event.target.files ?? [])]); event.target.value = ""; }} />
          </Button>
          {completePodFiles.length ? <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>{completePodFiles.map((file, index) => <Box key={`${file.name}-${index}`} sx={{ display: "flex", alignItems: "center", gap: 0.5, px: 1, py: 0.25, border: "1px solid", borderColor: "success.light", borderRadius: 1 }}><InsertDriveFileIcon sx={{ fontSize: 13, color: "success.main" }} /><Typography variant="caption">{file.name}</Typography><IconButton aria-label={`Remove ${file.name}`} size="small" onClick={() => setCompletePodFiles((current) => current.filter((_, i) => i !== index))}><Typography variant="caption">×</Typography></IconButton></Box>)}</Box> : <Typography variant="caption" color="error.main">POD file is required before completing this Pre-Alert.</Typography>}
        </Box>
      </DialogContent>
    </Dialog>
   
    <Dialog
      open={transitTarget !== null}
      onClose={() => { setTransitTarget(null); setPodFiles([]); }}
      fullWidth
      maxWidth="fullWidth"
      aria-labelledby="transit-pre-alert-title"
      slotProps={{ paper: { sx: { borderRadius: 1,mb:50 } } }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, pr: 4,mt:3 }}>
        <DialogTitle id="transit-pre-alert-title" sx={{ fontWeight: 700, flex: 1 }}>
          Transit - PreAlert Number - <Box component="span" sx={{ color: "primary.main" }}>({transitTarget?.manifestNumber ?? ""})</Box>
        </DialogTitle>
        <DialogActions sx={{ flexShrink: 0, p: 0 }}>
          <Button onClick={() => { setTransitTarget(null); setPodFiles([]); }} variant="outlined" color="error" sx={{ textTransform: "none", fontWeight: 600 }}>Cancel</Button>
          <Button onClick={confirmTransit} variant="contained" color="primary" startIcon={<AirportShuttleIcon />} sx={{ textTransform: "none", fontWeight: 600 }}>Transit</Button>
        </DialogActions>
      </Box>
      
      <DialogContent>
        <TableContainer sx={{ border: "1px solid", borderColor: "divider", borderRadius: "4px 4px 8px 8px", mb: 2 }}>
          <Table size="small" sx={{ minWidth: transitWidths.reduce((total, width) => total + width, 0), tableLayout: "fixed", "& .transit-resizer": { position: "absolute", top: 0, right: 0, height: "100%", width: 10, cursor: "col-resize", userSelect: "none", touchAction: "none", "&::after": { content: '""', position: "absolute", right: 3, top: "20%", height: "60%", width: 2, bgcolor: "divider" }, "&:hover::after": { bgcolor: "primary.main" } } }}>
            <colgroup>{transitWidths.map((width, index) => <col key={TRANSIT_COLUMNS[index]} style={{ width }} />)}</colgroup>
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                {TRANSIT_COLUMNS.map((heading, index) => (
                  <TableCell key={heading} sx={{ position: "relative", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={`${heading} · drag to resize; double-click divider to reset`}>
                    {heading}<Box className="transit-resizer" onMouseDown={(event) => startTransitResize(index, event)} onDoubleClick={() => setTransitWidths((current) => current.map((width, columnIndex) => columnIndex === index ? TRANSIT_DEFAULT_WIDTHS[index] : width))} />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {transitTarget && <TableRow>
                <TableCell>{show(transitTarget.vessel)}</TableCell>
                <TableCell>{show(transitTarget.id)}</TableCell>
                <TableCell>{show(transitTarget.hub)}</TableCell>
                <TableCell>{formatDate(transitTarget.createdAt)}</TableCell>
                <TableCell>{show(transitTarget.airlineName)}</TableCell>
                <TableCell>{(transitTarget.vesselPo ?? "").split(/[,;\n]+/).map((po) => po.trim()).filter(Boolean).map((po, index) => <Box key={`${po}-${index}`}>{po}</Box>).length ? (transitTarget.vesselPo ?? "").split(/[,;\n]+/).map((po) => po.trim()).filter(Boolean).map((po, index) => <Box key={`${po}-${index}`}>{po}</Box>) : "—"}</TableCell>
                <TableCell sx={{ textAlign:"center" }}>{show(transitTarget.packageCount)}</TableCell>
                <TableCell sx={{ textAlign:"center" }}>{transitTarget.totalWeight == null ? "—" : transitTarget.totalWeight.toLocaleString()}</TableCell>
                <TableCell>—</TableCell>
                <TableCell>{show(transitTarget.status ?? "Pending")}</TableCell>
              </TableRow>}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 1, p: 1.5,  }}>
          <Button component="label" variant={podFiles.length ? "outlined" : "contained"} startIcon={podFiles.length ? <InsertDriveFileIcon /> : <CloudUploadOutlinedIcon />} sx={{ textTransform: "none", alignSelf: "flex-start" }}>
            {podFiles.length ? "Add more POD files" : "Upload POD"}
            <input hidden type="file" multiple accept="application/pdf,image/jpeg,image/png,image/webp" onChange={(event) => { setPodFiles((current) => [...current, ...Array.from(event.target.files ?? [])]); event.target.value = ""; }} />
          </Button>
          {podFiles.length ? 
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {podFiles.map((file, index) => 
            <Box key={`${file.name}-${index}`} 
                  sx={{ display: "flex", alignItems: "center", gap: 0.5, px: 1, py: 0.25, 
                  border: "1px solid", borderColor: "success.light", borderRadius: 1 }}>
                    <InsertDriveFileIcon sx={{ fontSize: 13, color: "success.main" }} />
                    <Typography variant="caption">{file.name}</Typography>
                    <IconButton aria-label={`Remove ${file.name}`} size="small" 
                      onClick={() => setPodFiles((current) => current.filter((_, i) => i !== index))}>
                      <Typography variant="caption">×</Typography>
                    </IconButton>
                    </Box>)}
            </Box> : <Typography variant="caption" color="text.secondary"></Typography>}
        </Box>
      </DialogContent>
    </Dialog>
    </>
  );
}
