import CancelIcon from '@mui/icons-material/Cancel';
import MailOutlineIcon from "@mui/icons-material/Mail";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, IconButton, InputLabel, MenuItem, OutlinedInput, Paper, Radio, RadioGroup, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useMemo, useState, type MouseEvent as ReactMouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { PreAlertDetails } from "../types/preAlert.types";
import type { PreAlertStage3Filters } from "./PreAlertStage3Filter";
import { FileCell } from "../../stocks/components/StockFollowupTable";
import type { FileItem } from "../../stocks/types/Stocks.types";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

const STAGE3_STORAGE_KEY = "tts-demo-pre-alert-stage-3";
const STAGE4_STORAGE_KEY = "tts-demo-pre-alert-stage-4";
const ROW_HEIGHT = 36;
const HEADER_HEIGHT = 44;
const ACTIONS_COL_WIDTH = 290;
const CHECKBOX_COL_WIDTH = 44;
const MIN_COL_WIDTH = 60;

const columns = [
  { label: "Date", width: 90 }, { label: "Manifest", width: 140 }, 
  { label: "Vessel", width: 150 },{ label: "Hub", width: 150 },
  { label: "Mode", width: 90 }, { label: "Origin", width: 135 },
  { label: "Destination", width: 135 },{ label: "AWN No", width: 135 },
  { label: "Carrier / Airline Details", width: 120 },{ label: "No. of Packages", width: 115 }, 
  { label: "Total Weight (KGS)", width: 125 },{ label: "ETD", width: 100 },
  { label: "ETA", width: 100 },{ label: "Status", width: 105 }, 
  { label: "POD", width: 60 },
];

const demoRows: PreAlertTableRow[] = [
  { id: "demo-prealert-1", manifestId: "MAN-26001", manifestNumber: "MAN-26001", createdAt: "2026-10-10T09:30:00.000Z", client: "Northstar Marine", vessel: "Ocean Pioneer", hub: "Singapore", mode: "Air", origin: "SIN", destination: "LHR", packageCount: 12, totalWeight: 845, masterAwbNumber: "618-12345675", houseAwbNumber: "NSM-001", airlineName: "Singapore Airlines", etd: "2026-10-18", eta: "2026-10-19", documentNames: ["invoice.pdf", "packing-list.pdf"], podDocumentNames: ["master-awb-61812345675.pdf", "house-awb-NSM001.pdf"], distance: "10,870 km", consigneeAddress: "London consignee", consignee: "Northstar UK", remarks: "Priority shipment", status: "Completed", stage: 3, stocks: [{ id: 1, stock_id: "STK-2609001", charges: [{ id: "demo-charge-1a", description: "Pickup fee", agent: "Singapore Ground Services", invoiceNo: "INV-SIN-1042", charges: "85.00", currency: "USD" }, { id: "demo-charge-1b", description: "Handling", agent: "Singapore Ground Services", invoiceNo: "INV-SIN-1042", charges: "32.50", currency: "USD" }] }] },
  { id: "demo-prealert-2", manifestId: "MAN-26002", manifestNumber: "MAN-26002", createdAt: "2026-10-11T13:15:00.000Z", client: "Bluewater Logistics", vessel: "Atlantic Star", hub: "Dubai", mode: "Air", origin: "DXB", destination: "FRA", packageCount: 8, totalWeight: 520, masterAwbNumber: "176-98765432", houseAwbNumber: "BW-208", airlineName: "Emirates SkyCargo", etd: "2026-10-20", eta: "2026-10-21", documentNames: ["pre-alert.pdf"], podDocumentNames: ["awb-17698765432.pdf"], distance: "4,845 km", consigneeAddress: "Frankfurt consignee", consignee: "Bluewater GmbH", remarks: "", status: "Completed", stage: 3, stocks: [{ id: 2, stock_id: "STK-2609002", charges: [{ id: "demo-charge-2a", description: "Pickup fee", agent: "Dubai Cargo Handling", invoiceNo: "INV-DXB-2081", charges: "145.00", currency: "AED" }] }] },
  { id: "demo-prealert-3", manifestId: "MAN-26003", manifestNumber: "MAN-26003", createdAt: "2026-10-12T07:45:00.000Z", client: "Apex Industrial", vessel: "Pacific Meridian", hub: "Hong Kong", mode: "Air", origin: "HKG", destination: "LAX", packageCount: 24, totalWeight: 1630, masterAwbNumber: "160-34567891", houseAwbNumber: "APX-778", airlineName: "Cathay Cargo", etd: "2026-10-22", eta: "2026-10-22", documentNames: ["commercial-invoice.pdf", "packing-list-APX778.pdf"], podDocumentNames: ["master-awb-16034567891.pdf"], distance: "11,650 km", consigneeAddress: "Los Angeles consignee", consignee: "Apex USA", remarks: "", status: "Completed", stage: 3, stocks: [{ id: 3, stock_id: "STK-2609003", charges: [{ id: "demo-charge-3a", description: "Pickup fee", agent: "Hong Kong Freight Services", invoiceNo: "INV-HKG-778", charges: "920.00", currency: "HKD" }] }] },
  { id: "demo-prealert-4", manifestId: "MAN-26004", manifestNumber: "MAN-26004", createdAt: "2026-10-12T07:45:00.000Z", client: "Apex Industrial", vessel: "Pacific Meridian", hub: "Hong Kong", mode: "Air", origin: "HKG", destination: "LAX", packageCount: 24, totalWeight: 1630, masterAwbNumber: "160-34567891", houseAwbNumber: "APX-778", airlineName: "Cathay Cargo", etd: "2026-10-22", eta: "2026-10-22", documentNames: ["commercial-invoice.pdf", "packing-list-APX778.pdf"], podDocumentNames: ["master-awb-16034567891.pdf"], distance: "11,650 km", consigneeAddress: "Los Angeles consignee", consignee: "Apex USA", remarks: "", status: "Completed", stage: 3, stocks: [{ id: 3, stock_id: "STK-2609003", charges: [{ id: "demo-charge-3a", description: "Pickup fee", agent: "Hong Kong Freight Services", invoiceNo: "INV-HKG-778", charges: "920.00", currency: "HKD" }] }] },
];

const additionalDemoRows: PreAlertTableRow[] = [
  { ...demoRows[0], id: "demo-prealert-5", manifestId: "MAN-26005", manifestNumber: "MAN-26005", createdAt: "2026-10-14T08:40:00.000Z", client: "Cedar Medical Supplies", vessel: "Skybridge", hub: "Dubai", mode: "Air", origin: "DXB", destination: "NBO", packageCount: 32, totalWeight: 710, masterAwbNumber: "176-22334455", houseAwbNumber: "CMS-905", airlineName: "Emirates SkyCargo", etd: "2026-10-25", eta: "2026-10-26", documentNames: ["cedar-invoice.pdf"], podDocumentNames: ["pod-CMS905.pdf"], distance: "3,550 km", consigneeAddress: "Nairobi consignee", consignee: "Cedar Kenya", remarks: "Temperature sensitive", mailSent: "No", stocks: [{ id: 5, stock_id: "STK-2609005", charges: [{ id: "demo-charge-5a", description: "Air freight", agent: "Desert Air Cargo", invoiceNo: "INV-DXB-905", charges: "640.00", currency: "USD" }] }] },
  { ...demoRows[1], id: "demo-prealert-6", manifestId: "MAN-26006", manifestNumber: "MAN-26006", createdAt: "2026-10-15T11:10:00.000Z", client: "Redwood Automotive", vessel: "Northern Star", hub: "Hong Kong", mode: "Sea", origin: "HKG", destination: "RTM", packageCount: 6, totalWeight: 3920, masterAwbNumber: "HKG-26006", houseAwbNumber: "RA-761", airlineName: "BlueWave Lines", etd: "2026-10-26", eta: "2026-11-04", documentNames: ["redwood-invoice.pdf"], podDocumentNames: ["pod-RA761.pdf"], distance: "9,280 km", consigneeAddress: "Rotterdam consignee", consignee: "Redwood Europe", remarks: "Oversized cargo", mailSent: "Yes", stocks: [{ id: 6, stock_id: "STK-2609006", charges: [{ id: "demo-charge-6a", description: "Customs handling", agent: "Rotterdam Freight BV", invoiceNo: "INV-RTM-761", charges: "510.00", currency: "EUR" }] }] },
  { ...demoRows[2], id: "demo-prealert-7", manifestId: "MAN-26007", manifestNumber: "MAN-26007", createdAt: "2026-10-16T06:55:00.000Z", client: "Summit Telecom", vessel: "Pacific Connect", hub: "Singapore", mode: "Air", origin: "SIN", destination: "SYD", packageCount: 14, totalWeight: 286, masterAwbNumber: "618-55667788", houseAwbNumber: "ST-118", airlineName: "Singapore Airlines", etd: "2026-10-27", eta: "2026-10-28", documentNames: ["summit-invoice.pdf", "summit-packing-list.pdf"], podDocumentNames: ["pod-ST118.pdf"], distance: "6,300 km", consigneeAddress: "Sydney consignee", consignee: "Summit Australia", remarks: "Deliver during business hours", mailSent: "Yes", stocks: [{ id: 7, stock_id: "STK-2609007", charges: [{ id: "demo-charge-7a", description: "Airport handling", agent: "Southern Cross Cargo", invoiceNo: "INV-SYD-118", charges: "215.00", currency: "AUD" }] }] },
  { ...demoRows[0], id: "demo-prealert-8", manifestId: "MAN-26008", manifestNumber: "MAN-26008", createdAt: "2026-10-17T14:25:00.000Z", client: "Atlas Construction", vessel: "Atlas Runner", hub: "Dubai", mode: "Sea", origin: "JEA", destination: "MCT", packageCount: 42, totalWeight: 8150, masterAwbNumber: "JEA-26008", houseAwbNumber: "AC-330", airlineName: "Gulf Marine Cargo", etd: "2026-10-28", eta: "2026-10-31", documentNames: ["atlas-invoice.pdf"], podDocumentNames: ["pod-AC330.pdf"], distance: "423 km", consigneeAddress: "Muscat consignee", consignee: "Atlas Oman", remarks: "Project cargo", mailSent: "No", stocks: [{ id: 8, stock_id: "STK-2609008", charges: [{ id: "demo-charge-8a", description: "Heavy lift", agent: "Oman Cargo Handling", invoiceNo: "INV-MCT-330", charges: "1,250.00", currency: "OMR" }] }] },
  { ...demoRows[1], id: "demo-prealert-9", manifestId: "MAN-26009", manifestNumber: "MAN-26009", createdAt: "2026-10-18T09:05:00.000Z", client: "Willow Foods", vessel: "Fresh Route", hub: "Singapore", mode: "Air", origin: "SIN", destination: "KUL", packageCount: 20, totalWeight: 1180, masterAwbNumber: "618-99887766", houseAwbNumber: "WF-204", airlineName: "Malaysia Airlines Cargo", etd: "2026-10-29", eta: "2026-10-29", documentNames: ["willow-invoice.pdf", "food-certificate.pdf"], podDocumentNames: ["pod-WF204.pdf"], distance: "296 km", consigneeAddress: "Kuala Lumpur consignee", consignee: "Willow Malaysia", remarks: "Food grade shipment", mailSent: "Yes", stocks: [{ id: 9, stock_id: "STK-2609009", charges: [{ id: "demo-charge-9a", description: "Cold-chain service", agent: "Freshway Logistics", invoiceNo: "INV-KUL-204", charges: "430.00", currency: "MYR" }] }] },
  { ...demoRows[2], id: "demo-prealert-10", manifestId: "MAN-26010", manifestNumber: "MAN-26010", createdAt: "2026-10-19T12:35:00.000Z", client: "Pioneer Robotics", vessel: "Digital Express", hub: "Hong Kong", mode: "Air", origin: "HKG", destination: "SFO", packageCount: 5, totalWeight: 164, masterAwbNumber: "160-11223344", houseAwbNumber: "PR-501", airlineName: "Cathay Cargo", etd: "2026-10-30", eta: "2026-10-30", documentNames: ["pioneer-invoice.pdf", "export-declaration.pdf"], podDocumentNames: ["pod-PR501.pdf"], distance: "11,150 km", consigneeAddress: "San Francisco consignee", consignee: "Pioneer USA", remarks: "Fragile equipment", mailSent: "No", stocks: [{ id: 10, stock_id: "STK-2609010", charges: [{ id: "demo-charge-10a", description: "Export processing", agent: "Harbor Bridge Logistics", invoiceNo: "INV-SFO-501", charges: "185.00", currency: "USD" }] }] },
];

type PreAlertTableRow = PreAlertDetails & {
  destinationPort?: string;
  awnNumber?: string;
  mailSent?: "Yes" | "No";
  clubManifestNos?: string[];
  // pod?: string;
};

type PreAlertStage3TableProps = {
  filters?: PreAlertStage3Filters;
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

export default function PreAlertStage3Table({ filters, rows: suppliedRows }: PreAlertStage3TableProps) {
  const navigate = useNavigate();
  const [rows, setRows] = useState<PreAlertTableRow[]>(() => {
    if (suppliedRows) return suppliedRows;
    const storedRows = readRows(STAGE3_STORAGE_KEY).filter((row) => (row.stage ?? 3) === 3);
    const storedIds = new Set(storedRows.map((row) => row.id));
    const stage4Ids = new Set(readRows(STAGE4_STORAGE_KEY).map((row) => row.id));
    const missingDemoRows = [...demoRows, ...additionalDemoRows].filter((row) => !storedIds.has(row.id) && !stage4Ids.has(row.id));
    return [...storedRows, ...missingDemoRows];
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [cancelTarget, setCancelTarget] = useState<PreAlertTableRow | null>(null);
  const [pickupChargesTarget, setPickupChargesTarget] = useState<PreAlertTableRow | null>(null);
  const [clubManifestTarget, setClubManifestTarget] = useState<PreAlertTableRow | null>(null);
  const [clubManifestJobs, setClubManifestJobs] = useState<string[]>([]);
  const [mailSentTarget, setMailSentTarget] = useState<PreAlertTableRow | null>(null);
  const [mailSentValue, setMailSentValue] = useState<"Yes" | "No" | "">("");
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

  const visibleRows = useMemo(() => {
    const query = filters?.search.trim().toLowerCase() ?? "";
    return rows.filter((row) => {
      if ((row.stage ?? 3) !== 3) return false;
      if (filters?.client && row.client !== filters.client) return false;
      if (filters?.vessel && row.vessel !== filters.vessel) return false;
      if (filters?.hub && row.hub !== filters.hub) return false;
      if (filters?.status && row.status !== filters.status) return false;
      if (filters?.vesselPo && !row.vesselPo?.toLowerCase().includes(filters.vesselPo.toLowerCase())) return false;
      if (filters?.keyAccountManager && row.keyAccountManager !== filters.keyAccountManager) return false;
      if (filters?.consignee && row.consignee !== filters.consignee) return false;
      if (filters?.destinationPort && (row.destinationPort ?? row.destination) !== filters.destinationPort) return false;
      if (filters?.stage && filters.stage !== "Stage 3") return false;
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
    if (!suppliedRows) localStorage.setItem(STAGE3_STORAGE_KEY, JSON.stringify(nextRows));
  };

  const confirmCancelPreAlert = () => {
    if (!cancelTarget) return;
    persist(rows.filter((item) => item.id !== cancelTarget.id));
    setSelected((current) => current.filter((id) => id !== cancelTarget.id));
    setCancelTarget(null);
  };
  const submitMailSent = () => {
    if (!mailSentTarget || !mailSentValue) return;
    persist(rows.map((item) => item.id === mailSentTarget.id ? { ...item, mailSent: mailSentValue } : item));
    setMailSentTarget(null);
    setMailSentValue("");
  };
  const closeMailSentDialog = () => {
    setMailSentTarget(null);
    setMailSentValue("");
  };
  const closeClubManifestDialog = () => {
    setClubManifestTarget(null);
    setClubManifestJobs([]);
  };
  const submitClubManifest = () => {
    if (!clubManifestTarget || clubManifestJobs.length === 0) return;
    persist(rows.map((row) => row.id === clubManifestTarget.id ? { ...row, clubManifestNos: clubManifestJobs } : row));
    closeClubManifestDialog();
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
      case 7: return row.awnNumber ?? row.masterAwbNumber;
      case 8: return row.airlineName;
      case 9: return row.packageCount ?? "";
      case 10: return row.totalWeight ?? "";
      case 11: return formatDate(row.etd);
      case 12: return formatDate(row.eta);
      case 13: return row.status ?? "";
      case 14: return row.podDocumentNames?.join(", ") ?? "";
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
    link.download = "pre-alert-stage-3.csv";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };
  const handleExportPdf = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const escapeHtml = (value: string | number) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    const headings = columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join("");
    const body = selectedRows.map((row) => `<tr>${columns.map((_, index) => `<td>${escapeHtml(exportValue(row, index))}</td>`).join("")}</tr>`).join("");
    printWindow.document.write(`<html><head><title>Pre-Alert Stage 3</title><style>body{font-family:Arial,sans-serif}table{border-collapse:collapse;width:100%;font-size:10px}th,td{border:1px solid #bbb;padding:6px;text-align:left}th{background:#eee}</style></head><body><h2>Pre-Alert Stage 3</h2><table><thead><tr>${headings}</tr></thead><tbody>${body}</tbody></table><script>window.onload=()=>{window.print();window.close()}</script></body></html>`);
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
          <TableHead 
            sx={{ height: HEADER_HEIGHT }}>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox size="small" checked={allOnPageSelected} indeterminate={someOnPageSelected} onChange={toggleAll} />
                </TableCell>
                {columns.map((column, index) => 
              <TableCell key={column.label} title={column.label}>{column.label}<Box className="col-resizer" onMouseDown={(event) => startResize(index, event)} onDoubleClick={() => resetWidth(index)} /></TableCell>)}<TableCell align="center" className="col-actions">Actions</TableCell></TableRow></TableHead>
          <TableBody>
            {visibleRows.length === 0 ? <TableRow><TableCell colSpan={columns.length + 2} align="center" sx={{ py: 5, color: "text.secondary" }}>No Pre-Alerts found</TableCell></TableRow> : pageRows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell padding="checkbox"><Checkbox size="small" checked={selected.includes(row.id)} onChange={() => toggleRow(row.id)} /></TableCell>
                <TableCell>{formatDate(row.createdAt)}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => navigate(`/manifest/manifest-view/${encodeURIComponent(String(row.manifestId))}`)}
                    sx={{ minWidth: 0, p: 0, textTransform: "none", fontSize: "inherit", fontWeight: 600, justifyContent: "flex-start" }}
                  >
                    {show(row.manifestNumber)}
                  </Button>
                </TableCell>
                <TableCell>
                  <Chip size="small" label={show(row.vessel)} variant="outlined"
                  sx={(theme) => ({
                    height: 22,
                    maxWidth: "100%",
                    fontWeight: 600,
                    color: theme.palette.mode === "dark" ? theme.palette.error.light : theme.palette.error.dark,
                    bgcolor: alpha(theme.palette.error.main, theme.palette.mode === "dark" ? 0.2 : 0.12),
                    borderColor: alpha(theme.palette.error.main, 0.5),
                    borderRadius: 1,
                    "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" },
                  })} />
                </TableCell>
                <TableCell>
                  <Chip size="small" label={show(row.hub)} variant="outlined"
                  sx={(theme) => ({
                    height: 22,
                    maxWidth: "100%",
                    fontWeight: 600,
                    color: theme.palette.mode === "dark" ? theme.palette.error.light : theme.palette.error.dark,
                    bgcolor: alpha(theme.palette.error.main, theme.palette.mode === "dark" ? 0.2 : 0.12),
                    borderColor: alpha(theme.palette.error.main, 0.5),
                    borderRadius: 1,
                    "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" },
                  })} />
                </TableCell>
                <TableCell>
                  <Chip size="small" label={show(row.mode)} variant="outlined" 
                    sx={(theme) => ({ height: 22, maxWidth: "100%", fontWeight: 600, 
                      color: theme.palette.mode === "dark" ? theme.palette.error.light : theme.palette.error.dark, 
                      bgcolor: alpha(theme.palette.error.main, theme.palette.mode === "dark" ? 0.2 : 0.12), 
                      borderRadius: 1, borderColor: alpha(theme.palette.error.main, 0.5), 
                      "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" } 
                    })} 
                  />
                </TableCell>
                <TableCell>{show(row.origin)}</TableCell>
                <TableCell>{show(row.destination)}</TableCell>
                <TableCell>
                  {show(row.awnNumber ?? row.masterAwbNumber)}
                </TableCell>
                <TableCell>{show(row.airlineName)}</TableCell>
                <TableCell>{show(row.packageCount)}</TableCell>
                <TableCell>{row.totalWeight == null ? "—" : row.totalWeight.toLocaleString()}</TableCell>
                <TableCell>{formatDate(row.etd)}</TableCell>
                <TableCell>{formatDate(row.eta)}</TableCell>
                <TableCell>{show(row.status)}</TableCell>
                <TableCell align="center"> <FileCell files={toFileItems(row.podDocumentNames ?? [])} type="doc" /></TableCell>

                <TableCell align="center" sx={{ position: "sticky", right: 0, bgcolor: "background.paper", zIndex: 1,boxShadow: "-6px 0 8px -6px rgba(0,0,0,0.25)" }}>
                  <Box sx={{ display: "flex", justifyContent: "center", gap: 0.25 }}>
                    <Tooltip title="Stock charges"><IconButton size="small" color="info" aria-label={`View stock charges for ${row.manifestNumber}`} onClick={() => setPickupChargesTarget(row)} sx={{ p: 0.4 }}><PaidOutlinedIcon sx={{ fontSize: 17 }} /></IconButton></Tooltip>
                    <Button
                      variant="contained"
                      size="small"
                      // disableElevation
                      onClick={() => {
                        setMailSentTarget(row);
                        setMailSentValue(row.mailSent ?? "");
                      }}
                      sx={{
                        borderRadius: 1.5,
                        minWidth: 80,
                        // whiteSpace: "nowrap",
                        textTransform: "none",
                        backgroundImage: "linear-gradient(135deg, #3FBF88 0%, #35A875 55%, #2C9366 100%)",
                        boxShadow: "0 2px 6px rgba(53,168,117,0.30)",
                        transition: "transform .15s ease, box-shadow .2s ease, background-color .2s ease",

                        "&:hover": {
                          backgroundColor: "#2C9366",
                          backgroundImage: "linear-gradient(135deg, #35A875 0%, #2C9366 55%, #27865D 100%)",
                          boxShadow: "0 4px 12px rgba(53,168,117,0.40)",
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      Mail Sent
                    </Button>                    
                    <Button 
                      variant="contained"
                      size="small"
                      onClick={() => { 
                        setClubManifestTarget(row); setClubManifestJobs(row.clubManifestNos ?? []); 
                      }}
                      sx={{
                        borderRadius: 1.3,
                        minWidth: 100,
                        textTransform: "none",
                        backgroundImage: "linear-gradient(135deg, #7B8FFF 0%, #3D5AFE 55%, #2A3ECF 100%)",
                        boxShadow: "0 3px 8px rgba(61, 90, 254, 0.24)",
                        "&:hover": {
                          backgroundImage: "linear-gradient(135deg, #6B82FF 0%, #334DE6 55%, #2538BD 100%)",
                          boxShadow: "0 5px 12px rgba(61, 90, 254, 0.32)",
                          transform: "translateY(-1px)",
                        },
                      }} 
                      
                      
                      
                      
                      
                      
                      
                      
                      
                      >Club Manifest</Button>
                    <Tooltip title="Email"><IconButton size="small" color="success" aria-label="Email Pre-Alert" onClick={() => mailRow(row)}><MailOutlineIcon fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Cancel Pre-Alert">
                      <IconButton size="small" color="error" aria-label="Cancel Pre-Alert" onClick={() => setCancelTarget(row)}>
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {row.mailSent === "Yes" && <Tooltip title="Move to Stage 4"><IconButton size="small" color="success" aria-label="Move to Pre-Alert Stage 4" onClick={() => navigate(`/jobs/pre-alert-stage-3-to-4/${encodeURIComponent(row.id)}`, { state: { preAlert: row } })}><SendIcon fontSize="small" /></IconButton></Tooltip>}
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
      aria-labelledby="cancel-stage3-pre-alert-title"
      aria-describedby="cancel-stage3-pre-alert-description"
      fullWidth
      maxWidth="xs"
      slotProps={{ paper: { sx: { borderRadius: 3, p: 1,mb:50, boxShadow: (theme) => theme.shadows[10] } } }}
    >
      <DialogTitle
        id="cancel-stage3-pre-alert-title"
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
        <Typography id="cancel-stage3-pre-alert-description" variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          Are you sure you want to cancel{" "}
          <Typography component="span" sx={{ fontWeight: 600, color: "error.main" }}>
            Pre-Alert {cancelTarget?.manifestNumber}
          </Typography>
          ?
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

    <Dialog open={pickupChargesTarget !== null} onClose={() => setPickupChargesTarget(null)} maxWidth="md" fullWidth aria-labelledby="stage3-stock-charges-title" slotProps={{ paper: { sx: { p: 3 } } }}>
      <DialogContent >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {(pickupChargesTarget?.stocks ?? []).map((stock) => (
            <Box key={`${stock.stock_id}-${stock.id}`}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Stock Charges - <Box component="span" sx={{ color: "primary.main" }}>{stock.stock_id}</Box></Typography>
              <TableContainer sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
                <Table size="small">
                  <TableHead><TableRow sx={{ bgcolor: "action.hover" }}>{["Description", "Invoice", "Charges", "Currency"].map((heading) => <TableCell key={heading} sx={{ fontWeight: 700 }}>{heading}</TableCell>)}</TableRow></TableHead>
                  <TableBody>
                    {stock.charges?.length ? stock.charges.map((charge) => <TableRow key={charge.id}><TableCell>{charge.description || "—"}</TableCell><TableCell>{charge.invoiceNo || "—"}</TableCell><TableCell>{charge.charges || "—"}</TableCell><TableCell>{charge.currency || "—"}</TableCell></TableRow>) : <TableRow><TableCell colSpan={4} align="center" sx={{ color: "text.secondary" }}>No charges recorded for this stock.</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))}
          {!pickupChargesTarget?.stocks?.length && <Typography variant="body2" color="text.secondary">No stock charge details are available for this Pre-Alert.</Typography>}
        </Box>
      </DialogContent>
    </Dialog>
    
    
    <Dialog
      open={mailSentTarget !== null}
      onClose={closeMailSentDialog}
      maxWidth="xs"
      fullWidth
      sx={{ mb: "50px" }}
      aria-labelledby="mail-sent-title"
      aria-describedby="mail-sent-radio-label"
      slotProps={{ paper: { sx: { borderRadius: 3, p: 1, boxShadow: (theme) => theme.shadows[10] } } }}
    >
      <DialogTitle id="mail-sent-title" component="div" sx={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, pt: 3, pb: 1 }}>
        <IconButton aria-label="Close" onClick={closeMailSentDialog} size="small" sx={{ position: "absolute", top: 8, right: 8, color: "text.secondary" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
        <Box sx={(theme) => ({ width: 64, height: 64, borderRadius: "50%", display: "grid", placeItems: "center", bgcolor: alpha(theme.palette.info.main, 0.12), color: "info.main", boxShadow: `0 0 0 8px ${alpha(theme.palette.info.main, 0.06)}` })}>
          <MailOutlineIcon sx={{ fontSize: 31 }} />
        </Box>
        <Typography variant="h6" component="h2" fontWeight={700}>Mail Sent</Typography>
      </DialogTitle>
      
      <DialogContent sx={{ textAlign: "center", pb: 1 }}>
        <FormControl required fullWidth>
          <FormLabel id="mail-sent-radio-label" sx={{ color: "text.secondary", mb: 1 }}>Was the mail sent for Pre-Alert <Box component="span" sx={{ color: "primary.main", fontWeight: 700 }}>{mailSentTarget?.manifestNumber}</Box>?</FormLabel>
          <RadioGroup row aria-labelledby="mail-sent-radio-label" name="mail-sent" value={mailSentValue} onChange={(event) => setMailSentValue(event.target.value as "Yes" | "No")} sx={{ justifyContent: "center", gap: 2 }}>
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" sx={{ m: 0, px: 1.5, border: "1px solid", borderColor: mailSentValue === "Yes" ? "success.main" : "divider", borderRadius: 2, bgcolor: mailSentValue === "Yes" ? "success.50" : "transparent" }} />
            <FormControlLabel value="No" control={<Radio />} label="No" sx={{ m: 0, px: 1.5, border: "1px solid", borderColor: mailSentValue === "No" ? "error.main" : "divider", borderRadius: 2, bgcolor: mailSentValue === "No" ? "error.50" : "transparent" }} />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ px: 3, pt: 2, pb: 3, gap: 1.5 }}>
        <Button onClick={closeMailSentDialog} variant="outlined" color="inherit" fullWidth sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, borderColor: "divider" }}>Cancel</Button>
        <Button onClick={submitMailSent} variant="contained" color="primary" fullWidth disabled={!mailSentValue} sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}>Submit</Button>
      </DialogActions>
    </Dialog>

    <Dialog open={clubManifestTarget !== null} onClose={closeClubManifestDialog} maxWidth="xs" fullWidth aria-labelledby="club-manifest-title">
      <DialogTitle id="club-manifest-title" sx={{ fontWeight: 700 }}>Club Manifest</DialogTitle>
      <DialogContent>
        <FormControl required fullWidth size="small" sx={{ mt: 1 }}>
          <InputLabel id="club-manifest-job-no-label">Job No</InputLabel>
          <Select
            labelId="club-manifest-job-no-label"
            multiple
            value={clubManifestJobs}
            input={<OutlinedInput label="Job No" />}
            renderValue={(selectedValues) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {(selectedValues as string[]).map((jobNo) => <Chip key={jobNo} size="small" label={jobNo} />)}
              </Box>
            )}
            onChange={(event) => {
              const value = event.target.value;
              setClubManifestJobs(typeof value === "string" ? value.split(",") : value);
            }}
            MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
          >
            {[...new Set(rows.map((item) => item.manifestNumber))].map((manifestNo) => (
              <MenuItem key={manifestNo} value={manifestNo}>
                <Checkbox size="small" checked={clubManifestJobs.includes(manifestNo)} />
                <Typography variant="body2">{manifestNo}</Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={closeClubManifestDialog} variant="outlined" color="error" sx={{ textTransform: "none" }}>Cancel</Button>
        <Button onClick={submitClubManifest} variant="contained" disabled={clubManifestJobs.length === 0} sx={{ textTransform: "none" }}>Submit</Button>
      </DialogActions>
    </Dialog>
    </>
  );
}
