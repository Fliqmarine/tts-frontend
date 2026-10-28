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
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useMemo, useState, type ChangeEvent, type MouseEvent as ReactMouseEvent } from "react";
import { redirect, useNavigate } from "react-router-dom";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlined";
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import ContentPasteSearchOutlinedIcon from '@mui/icons-material/ContentPasteSearchOutlined';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MailIcon from "@mui/icons-material/Mail";
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import TextsmsIcon from '@mui/icons-material/Textsms';

import { FileCell } from "../../stocks/components/StockFollowupTable";
import type { Manifest, ManifestIndexFilters, ManifestStockRow } from "../types/manifest.types";

export const DEMO_MANIFEST_STOCKS: ManifestStockRow[] = [
  { id: 1, vessel: "Vessel 1", stock_id: "STK-2609001", station: "ICN-TTS-E 1", arrival_date: "2026-09-12", supplier: "Supplier 1", po_no: "PO-26002779", pkgs: 10, weight: 100, cbm: 1.25, value: 1000, stock_status: "Pending" },
  { id: 2, vessel: "Vessel 2", stock_id: "STK-2609002", station: "DXB-TTS-02", arrival_date: "2026-08-18", supplier: "Supplier 2", po_no: "PO-26003403", pkgs: 24, weight: 840, cbm: 4.8, value: 7200, stock_status: "In Progress" },
  { id: 3, vessel: "Vessel 3", stock_id: "STK-2609003", station: "SIN-TTS-03", arrival_date: "2026-09-26", supplier: "Supplier 3", po_no: "PO-26004111", pkgs: 6, weight: 52, cbm: 0.72, value: 2150, stock_status: "Completed" },
];

export const DEMO_MANIFESTS: Manifest[] = [
  {
    id: "MAN-DEMO-001",
    manifestNumber: "MAN-DEMO-001",
    client: "Demo Client",
    vessel: "Vessel 1",
    stationCode: "ICN-TTS-E 1",
    mode: "Air",
    activation: "2026-09-12",
    deadline: "2026-09-30",
    originAirportCode: "ICN",
    customerPoRef: "PO-26002779",
    stockOrigin: false,
    consignee: "Demo Consignee",
    country: "KR",
    destinationAirportCode: "DXB",
    email: "demo@example.com",
    telephone: "",
    consigneeAddress: "",
    notifyParty: "",
    status: "Pending",
    InternalStatus: "Pending",
    stocks: [DEMO_MANIFEST_STOCKS[0]],
  },
];

type ManifestTableColumn = {
  key: string;
  label: string;
  width: number;
  align?: "left" | "right";
};

const columns: ManifestTableColumn[] = [
  { key: "date", label: "Date", width: 110 },
  { key: "status", label: "Status", width: 125 },
  { key: "manifestNo", label: "Manifest No", width: 145 },
  { key: "client", label: "Client", width: 145 },
  { key: "vessel", label: "Vessel", width: 140 },
  { key: "mode", label: "Mode", width: 100 },
  { key: "origin", label: "Origin", width: 120 },
  { key: "destination", label: "Destination", width: 150 },
  { key: "packages", label: "Packages", width: 90, align: "right" },
  { key: "weight", label: "Weight (KGS)", width: 115, align: "right" },
  { key: "activation", label: "Activation", width: 115 },
  { key: "deadline", label: "Deadline", width: 115 },
  { key: "pic", label: "PIC", width: 130 },
  { key: "internalStatus", label: "Internal Status", width: 135 },
  { key: "docs", label: "Docs", width: 75 },
];

const CHECKBOX_WIDTH = 44;
const HEADER_HEIGHT = 42;
const ROW_HEIGHT = 34;
const MIN_COLUMN_WIDTH = 60;
const ACTIONS_WIDTH = 320;
const defaultWidths = Object.fromEntries(columns.map(({ key, width }) => [key, width])) as Record<string, number>;
const INTERNAL_COMMENTS_STORAGE_KEY = "manifest-internal-comments";

const formatDate = (value: string) => value ? new Date(`${value}T00:00:00`).toLocaleDateString() : "—";

function readInternalComments(): Record<string, string> {
  const stored = localStorage.getItem(INTERNAL_COMMENTS_STORAGE_KEY);
  if (!stored) return {};

  const parsed: unknown = JSON.parse(stored);
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Stored manifest comments must be an object.");
  }

  const comments: Record<string, string> = {};
  for (const [manifestId, comment] of Object.entries(parsed)) {
    if (typeof comment !== "string") {
      throw new Error(`Stored comment for manifest ${manifestId} is invalid.`);
    }
    comments[manifestId] = comment;
  }
  return comments;
}

function getManifestValue(manifest: Manifest, key: string): string | number {
  const extra = manifest as unknown as Record<string, unknown>;
  const packages = manifest.stocks.reduce((total, stock) => total + stock.pkgs, 0);
  const weight = manifest.stocks.reduce((total, stock) => total + stock.weight, 0);
  const values: Record<string, string | number> = {
    date: String(extra.updated_at ?? extra.created_at ?? manifest.activation),
    status: String(extra.status ?? "—"),
    manifestNo: String(extra.manifestNumber ?? manifest.id),
    client: manifest.client,
    vessel: manifest.vessel,
    mode: manifest.mode,
    origin: manifest.originAirportCode,
    destination: manifest.destinationAirportCode,
    packages,
    weight,
    activation: manifest.activation,
    deadline: manifest.deadline,
    pic: String(extra.keyAccountManager ?? extra.pic ?? "—"),
    internalStatus: String(extra.InternalStatus ?? extra.internalStatus ?? "—"),
  };
  return values[key] ?? "—";
}

type ManifestIndexTableProps = {
  filters: ManifestIndexFilters;
};

export default function ManifestIndexTable({ filters }: ManifestIndexTableProps) {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Manifest[]>(DEMO_MANIFESTS);
  const [selectedIds, setSelectedIds] = useState<Array<string | number>>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [widths, setWidths] = useState(defaultWidths);
  const [deleteTarget, setDeleteTarget] = useState<Manifest | null>(null);
  const [pickupChargesTarget, setPickupChargesTarget] = useState<Manifest | null>(null);
  const [internalComments, setInternalComments] = useState<Record<string, string>>(readInternalComments);
  const [commentsTarget, setCommentsTarget] = useState<Manifest | null>(null);
  const [commentsDraft, setCommentsDraft] = useState("");

  const filteredManifests = useMemo(() => {
    const getField = (manifest: Manifest, field: keyof ManifestIndexFilters) => {
      const value = (manifest as unknown as Record<string, unknown>)[field];
      if (value !== undefined && value !== null) return String(value);
      if (field === "manifestNo") return String(manifest.manifestNumber ?? manifest.id);
      if (field === "vesselPo") return manifest.stocks.map((stock) => stock.po_no).join(" ");
      if (field === "arrival") return manifest.stocks.map((stock) => stock.arrival_date).join(" ");
      return "";
    };

    return rows.filter((manifest) => {
      const search = filters.search.trim().toLowerCase();
      const searchable = [manifest.id, manifest.manifestNumber, manifest.client, manifest.vessel, manifest.stationCode, manifest.consignee, ...manifest.stocks.map((stock) => stock.stock_id)].join(" ").toLowerCase();
      if (!searchable.includes(search)) return false;

      return Object.entries(filters).every(([key, filterValue]) => {
        if (!filterValue) return true;
        const field = key as keyof ManifestIndexFilters;
        if (field === "search") return true;
        if (field === "fromDate") return manifest.stocks.some((stock) => stock.arrival_date >= filterValue);
        if (field === "toDate") return manifest.stocks.some((stock) => stock.arrival_date <= filterValue);
        return getField(manifest, field).toLowerCase().includes(filterValue.toLowerCase());
      });
    });
  }, [rows, filters]);

  const pageCount = Math.max(1, Math.ceil(filteredManifests.length / rowsPerPage));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = useMemo(() => filteredManifests.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage), [filteredManifests, safePage, rowsPerPage]);
  const pageIds = pageRows.map((manifest) => manifest.id);
  const allOnPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
  const someOnPageSelected = pageIds.some((id) => selectedIds.includes(id)) && !allOnPageSelected;
  const selectedCount = filteredManifests.filter((manifest) => selectedIds.includes(manifest.id)).length;
  const selectedRows = filteredManifests.filter((manifest) => selectedIds.includes(manifest.id));
  const totalWidth = CHECKBOX_WIDTH + ACTIONS_WIDTH + columns.reduce((total, column) => total + widths[column.key], 0);

  const exportValue = (manifest: Manifest, key: string): string | number => {
    if (key === "docs") return manifest.stocks.flatMap((stock) => stock.docs ?? []).map((file) => file.name).join(", ");
    return getManifestValue(manifest, key);
  };
  const handleExportExcel = () => {
    const csvCell = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
    const csv = [
      columns.map((column) => csvCell(column.label)).join(","),
      ...selectedRows.map((manifest) => columns.map((column) => csvCell(exportValue(manifest, column.key))).join(",")),
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob(["\\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "manifest-list.csv";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };
  const handleExportPdf = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const escapeHtml = (value: string | number) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    const headings = columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join("");
    const body = selectedRows.map((manifest) => `<tr>${columns.map((column) => `<td>${escapeHtml(exportValue(manifest, column.key))}</td>`).join("")}</tr>`).join("");
    printWindow.document.write(`<html><head><title>Manifest List</title><style>body{font-family:Arial,sans-serif}table{border-collapse:collapse;width:100%;font-size:10px}th,td{border:1px solid #bbb;padding:6px;text-align:left}th{background:#eee}</style></head><body><h2>Manifest List</h2><table><thead><tr>${headings}</tr></thead><tbody>${body}</tbody></table><script>window.onload=()=>{window.print();window.close()}</script></body></html>`);
    printWindow.document.close();
  };

  const toggleAll = () => setSelectedIds((current) => allOnPageSelected
    ? current.filter((id) => !pageIds.includes(id))
    : [...new Set([...current, ...pageIds])]);
  const toggleRow = (id: string | number) => setSelectedIds((current) => current.includes(id)
    ? current.filter((selectedId) => selectedId !== id)
    : [...current, id]);

  const openInternalComments = (manifest: Manifest) => {
    setCommentsDraft(internalComments[String(manifest.id)] ?? "");
    setCommentsTarget(manifest);
  };

  const saveInternalComments = () => {
    if (!commentsTarget) return;
    const manifestId = String(commentsTarget.id);
    const nextComments = { ...internalComments };
    if (commentsDraft.trim()) {
      nextComments[manifestId] = commentsDraft;
    } else {
      delete nextComments[manifestId];
    }
    localStorage.setItem(INTERNAL_COMMENTS_STORAGE_KEY, JSON.stringify(nextComments));
    setInternalComments(nextComments);
    setCommentsTarget(null);
  };

  const startResize = (key: string, event: ReactMouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const startX = event.clientX;
    const startWidth = widths[key];
    const onMove = (moveEvent: MouseEvent) => setWidths((current) => ({
      ...current,
      [key]: Math.max(MIN_COLUMN_WIDTH, startWidth + moveEvent.clientX - startX),
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

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const openEmail = (manifest: Manifest, kind: "manifest" | "reminder" | "prealert") => {
    const number = manifest.manifestNumber ?? String(manifest.id);
    const subject = kind === "reminder" ? `Reminder: Manifest ${number}` : kind === "prealert" ? `Pre-alert: Manifest ${number}` : `Manifest ${number}`;
    const body = kind === "prealert"
      ? `Dear ${manifest.consignee},\n\nPlease find the pre-alert details for manifest ${number}.\nVessel: ${manifest.vessel}\nOrigin: ${manifest.originAirportCode}\nDestination: ${manifest.destinationAirportCode}\nActivation: ${manifest.activation}\nDeadline: ${manifest.deadline}\n\nRegards`
      : `Dear ${manifest.consignee},\n\nThis is regarding manifest ${number}.\n\nRegards`;
    window.location.href = `mailto:${encodeURIComponent(manifest.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const openEditor = (manifest: Manifest, revised = false) => navigate(
    revised ? "/manifest/manifest-create" : `/manifest/manifest-edit/${manifest.id}`,
    {
    state: {
      initialValues: {
        manifestNumber: manifest.manifestNumber ?? String(manifest.id),
        client: manifest.client,
        vessel: manifest.vessel,
        stationCode: manifest.stationCode,
        mode: manifest.mode,
        activation: manifest.activation,
        deadline: manifest.deadline,
        originAirportCode: manifest.originAirportCode,
        customerPoRef: manifest.customerPoRef,
        stockOrigin: manifest.stockOrigin,
        consignee: manifest.consignee,
        country: manifest.country,
        destinationAirportCode: manifest.destinationAirportCode,
        email: manifest.email,
        telephone: manifest.telephone,
        consigneeAddress: manifest.consigneeAddress,
        notifyParty: manifest.notifyParty,
      },
      stocks: manifest.stocks,
      manifest,
      revised,
    },
    }
  );

  return (
    <>
      {selectedCount > 0 && (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1, mt: 1, bgcolor: "action.hover", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
          <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>{selectedCount} manifests selected</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="contained" size="small" color="success" startIcon={<FileDownloadOutlinedIcon />} onClick={handleExportExcel} sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 2.5 }}>Export Excel</Button>
            <Button variant="contained" size="small" color="secondary" startIcon={<FileDownloadOutlinedIcon />} onClick={handleExportPdf} sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 2.5 }}>Export PDF</Button>
          </Box>
        </Box>
      )}
      <Paper elevation={2} sx={{ mt: 2, borderRadius: "8px 8px 16px 16px", border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: HEADER_HEIGHT + ROW_HEIGHT * 15, overflow: "auto" }}>
          <Table size="small" stickyHeader sx={(theme) => ({
            width: totalWidth,
            minWidth: "100%",
            tableLayout: "fixed",
            "& .MuiTableCell-root": { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", px: 1, borderColor: theme.palette.divider },
            "& .MuiTableCell-head": { position: "relative", zIndex: 1, fontWeight: 700, fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: 0.4, lineHeight: 1.2, py: 0.75, bgcolor: "background.paper", borderBottom: `2px solid ${theme.palette.divider}` },
            "& .MuiTableCell-body": { fontSize: "0.68rem", lineHeight: 1.3, py: 0, height: ROW_HEIGHT },
            "& .col-resizer": { position: "absolute", top: 0, right: 0, height: "100%", width: 10, cursor: "col-resize", display: "flex", justifyContent: "flex-end", userSelect: "none", touchAction: "none", "&::after": { content: '""', width: 2, height: "60%", alignSelf: "center", borderRadius: 1, bgcolor: "divider" }, "&:hover::after": { bgcolor: "primary.main" } },
            "& .MuiTableBody-root .MuiTableRow-root:hover": { bgcolor: theme.palette.action.hover },
            "& .MuiTableBody-root .MuiTableRow-root.Mui-selected": { bgcolor: alpha(theme.palette.primary.main, 0.08) },

           // Sticky actions column: always opaque
            "& .col-actions": {
              position: "sticky",
              right: 0,
              backgroundColor: theme.palette.background.paper, // solid base so scrolled cells never show through
              backgroundClip: "padding-box",
              boxShadow: "-6px 0 8px -6px rgba(0,0,0,0.25)",
              overflow: "visible",
            },
            "& .MuiTableCell-head.col-actions": { zIndex: 5 },
            "& .MuiTableBody-root .col-actions": { zIndex: 2 },

            // Layer the hover / selected tint ON TOP of the solid background
            "& .MuiTableBody-root .MuiTableRow-root:hover .col-actions": {
              backgroundImage: `linear-gradient(${theme.palette.action.hover}, ${theme.palette.action.hover})`,
            },
            "& .MuiTableBody-root .MuiTableRow-root.Mui-selected .col-actions": {
              backgroundImage: `linear-gradient(${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.primary.main, 0.08)})`,
            },
            "& .MuiTableBody-root .MuiTableRow-root.Mui-selected:hover .col-actions": {
              backgroundImage: `linear-gradient(${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.primary.main, 0.12)})`,
            },
            
          })}>
            <colgroup>
              <col style={{ width: CHECKBOX_WIDTH }} />
              {columns.map((column) => <col key={column.key} style={{ width: widths[column.key] }} />)}
              <col style={{ width: ACTIONS_WIDTH }} />
            </colgroup>
            <TableHead sx={{ height: HEADER_HEIGHT }}>
              <TableRow>
                <TableCell padding="checkbox"><Checkbox size="small" checked={allOnPageSelected} indeterminate={someOnPageSelected} onChange={toggleAll} /></TableCell>
                {columns.map((column) => (
                  <TableCell key={column.key} align={column.align} title={column.label}>
                    {column.label}
                    <Box className="col-resizer" onMouseDown={(event) => startResize(column.key, event)} onDoubleClick={() => setWidths((current) => ({ ...current, [column.key]: defaultWidths[column.key] }))} />
                  </TableCell>
                ))}
                <TableCell align="center" className="col-actions">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRows.length === 0 ? (
                <TableRow><TableCell colSpan={columns.length + 2} align="center" sx={{ py: 5, color: "text.secondary" }}>No manifests found</TableCell></TableRow>
              ) : pageRows.map((manifest) => (
                <TableRow key={manifest.id} hover selected={selectedIds.includes(manifest.id)}>
                  <TableCell padding="checkbox"><Checkbox size="small" checked={selectedIds.includes(manifest.id)} onChange={() => toggleRow(manifest.id)} /></TableCell>
                  {columns.map((column) => {
                    if (column.key === "docs") {
                      const docs = manifest.stocks.flatMap((stock) => stock.docs ?? []);
                      return <TableCell key={column.key} align="center" className="no-clip"><FileCell files={docs} type="doc" /></TableCell>;
                    }
                    const value = getManifestValue(manifest, column.key);
                    if (column.key === "status") {
                      const status = String(value);
                      const color = status === "Completed" ? "success" : status === "Pending" ? "warning" : "info";
                      return <TableCell key={column.key}><Chip size="small" color={color} variant="outlined" icon={<FiberManualRecordIcon sx={{ fontSize: "8px !important" }} />} label={status} sx={(theme) => ({ height: 20, fontSize: "0.65rem", fontWeight: 600, borderRadius: "18px", bgcolor: alpha(theme.palette[color].main, 0.08), "& .MuiChip-label": { px: 0.75 } })} /></TableCell>;
                    }
                    if (["date", "activation", "deadline"].includes(column.key)) return <TableCell key={column.key} title={String(value)}>{formatDate(String(value))}</TableCell>;
                    if (column.key === "weight") return <TableCell key={column.key} align={column.align} title={`${Number(value).toLocaleString()} kg`}>{Number(value).toLocaleString()} kg</TableCell>;
                    return <TableCell key={column.key} align={column.align} title={String(value)}>{column.key === "packages" ? Number(value).toLocaleString() : value}</TableCell>;
                  })}
                  <TableCell align="center" className="col-actions">
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.25 }}>
                      
                      <IconButton size="small" aria-label={`Internal comments for ${manifest.manifestNumber ?? manifest.id}`} onClick={() => openInternalComments(manifest)} sx={{ p: 0.4, color: internalComments[String(manifest.id)]?.trim() ? "primary.main" : "text.disabled" }}><TextsmsIcon sx={{ fontSize: 17 }} /></IconButton>
                      <Tooltip title="Is Pickup"><IconButton size="small" color="info" aria-label={`View stock charges for ${manifest.manifestNumber ?? manifest.id}`} onClick={() => setPickupChargesTarget(manifest)} sx={{ p: 0.4 }}><PaidOutlinedIcon sx={{ fontSize: 17 }} /></IconButton></Tooltip>
                      <Tooltip title="Revised manifest" arrow><IconButton size="small" color="primary" aria-label="Revised manifest" onClick={() => openEditor(manifest, true)} sx={{ p: 0.4 }}><ContentPasteSearchOutlinedIcon sx={{ fontSize: 17 }} /></IconButton></Tooltip>
                      <Tooltip title="Send manifest email" arrow><IconButton size="small" color="success" aria-label="Send manifest email" onClick={() => openEmail(manifest, "manifest")} sx={{ p: 0.4 }}><MailIcon sx={{ fontSize: 17 }} /></IconButton></Tooltip>
                      <Tooltip title="Send reminder email" arrow><IconButton size="small" color="warning" aria-label="Send reminder email" onClick={() => openEmail(manifest, "reminder")} sx={{ p: 0.4,}}><MarkEmailUnreadOutlinedIcon sx={{ fontSize: 17 }} /></IconButton></Tooltip>
                      <Button size="small" variant="contained" 
                        onClick={() => navigate("/jobs/pre-alert-create", { state: { manifest } })} 
                        // startIcon={<AddIcon />}
                        sx={{ 
                          minWidth: 0, px: 1, py: 0.25, ml: 0.25, 
                          textTransform: "none", fontSize: "0.65rem", 
                          whiteSpace: "nowrap",borderRadius:"15px"
                        }}
                      >
                        Create Pre-Alert
                      </Button>
                      <Tooltip title="View manifest" arrow><IconButton size="small" color="info" aria-label="View manifest" onClick={() => navigate(`/manifest/manifest-view/${manifest.id}`)} sx={{ p: 0.4 }}><VisibilityIcon sx={{ fontSize: 17 }} /></IconButton></Tooltip>
                      <Tooltip title="Edit manifest" arrow><IconButton size="small" color="primary" aria-label="Edit manifest" onClick={() => openEditor(manifest)} sx={{ p: 0.4 }}><EditIcon sx={{ fontSize: 17 }} /></IconButton></Tooltip>
                      <IconButton size="small" color="error" aria-label="Delete manifest" onClick={() => setDeleteTarget(manifest)} sx={{ p: 0.4 }}><DeleteIcon sx={{ fontSize: 16 }} /></IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination component="div" count={filteredManifests.length} page={safePage} rowsPerPage={rowsPerPage} onPageChange={(_, nextPage) => setPage(nextPage)} onRowsPerPageChange={handleRowsPerPageChange} rowsPerPageOptions={[15, 30, 50, 100]} sx={{ borderTop: "1px solid", borderColor: "divider" }} />
      </Paper>
      
      <Dialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        aria-labelledby="delete-manifest-title"
        aria-describedby="delete-manifest-description"
        fullWidth
        maxWidth="xs"
        slotProps={{ paper: { sx: { borderRadius: 3, p: 1,mb:50,boxShadow: (theme) => theme.shadows[10] } } }}
      >
        <DialogTitle
          id="delete-manifest-title"
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
          <Typography variant="h6" component="h2" fontWeight={700}>Delete manifest?</Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", pb: 1 }}>
          <Typography id="delete-manifest-description" variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            Are you sure you want to delete{" "}
            <Box component="span" sx={{ fontWeight: 600, color: "error.main" }}>
              {deleteTarget?.manifestNumber ?? deleteTarget?.id}
            </Box>
            ? This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pt: 2, pb: 3, gap: 1.5 }}>
          <Button onClick={() => setDeleteTarget(null)} variant="outlined" color="inherit" fullWidth sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, borderColor: "divider" }}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (deleteTarget) {
                setRows((current) => current.filter((manifest) => manifest.id !== deleteTarget.id));
              }
              setSelectedIds((current) => current.filter((id) => id !== deleteTarget?.id));
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

      <Dialog open={commentsTarget !== null} onClose={() => setCommentsTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Internal Comments</DialogTitle>
        <DialogContent>
          <TextField
            aria-label="Internal comments"
            value={commentsDraft}
            onChange={(event) => setCommentsDraft(event.target.value)}
            multiline
            minRows={4}
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={saveInternalComments} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={pickupChargesTarget !== null} 
        onClose={() => setPickupChargesTarget(null)} 
        maxWidth="md" fullWidth aria-labelledby="stock-charges-title"
        slotProps={{ paper: { sx: { p: 3,mb:50 } } }}
        >        
        <DialogContent >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {(pickupChargesTarget?.stocks ?? []).map((stock) => (
              <Box key={`${stock.stock_id}-${stock.id}`}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Stock Charges - <Box component="span" sx={{ color: "primary.main" }}> {stock.stock_id} </Box></Typography>
                <TableContainer sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: "action.hover" }}>
                        {["Description", "Invoice", "Charges", "Currency"].map((heading) => <TableCell key={heading} sx={{ fontWeight: 700 }}>{heading}</TableCell>)}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stock.charges?.length ? stock.charges.map((charge) => (
                        <TableRow key={charge.id}>
                          <TableCell>{charge.description || "—"}</TableCell>
                          <TableCell>{charge.invoiceNo || "—"}</TableCell>
                          <TableCell>{charge.charges || "—"}</TableCell>
                          <TableCell>{charge.currency || "—"}</TableCell>
                        </TableRow>
                      )) : <TableRow><TableCell colSpan={4} align="center" sx={{ color: "text.secondary" }}>No charges recorded for this stock.</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ))}
          </Box>
        </DialogContent>
        
      </Dialog>
    </>
  );
}
