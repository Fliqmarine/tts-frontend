import SettingsIcon from '@mui/icons-material/Settings';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  Link,
  Menu,
  MenuItem,
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
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState, type MouseEvent as ReactMouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { SaleInvoiceFilters } from "../types/saleInvoice.types";
import { getInvoiceApprovalStatus, type SaleInvoiceRow } from "../types/saleInvoice.types";
import { InvoiceStatusSchema, type InvoiceStatus } from "../../invoices/types/invoices.types";
import { alpha, type Theme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PercentIcon from "@mui/icons-material/Percent";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";


type Props = {
  filters: SaleInvoiceFilters;
  rows: SaleInvoiceRow[];
  onDownload?: (row: SaleInvoiceRow) => void;
  onDownloadCompletePdf?: (row: SaleInvoiceRow) => void;
  onGenerateInvoice?: (row: SaleInvoiceRow) => void;
  onSpecialCommission: (row: SaleInvoiceRow, amount: number) => void;
  onStatusChange: (row: SaleInvoiceRow, status: InvoiceStatus) => void;
  onApprove: (row: SaleInvoiceRow, department: "ar" | "ap", payload?: ArApprovePayload) => void;
};

const formatDate = (value?: string) =>
  value ? new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString() : "—";

const formatAmount = (value: number) =>
  new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

const fieldValue = (value?: string | number) =>
  value === undefined || value === null || value === "" ? "—" : value;

const uniqueValues = (values: string[]) => [...new Set(values.filter(Boolean))];
const joinValues = (values: string[]) => uniqueValues(values).join(", ");
const joinDates = (values: string[], fallback?: string) => {
  const dates = uniqueValues(values);
  if (!dates.length && fallback) dates.push(fallback);
  return dates.map(formatDate).join(", ") || "—";
};


const HOLD_REASONS = [
  { key: "originDestination", label: "Origin/Destination" },
  { key: "supportDocsPod", label: "Support Docs (POD)" },
  { key: "clientNameBank", label: "Client Name/ Bank Details" },
  { key: "profitCheck", label: "Profit Check" },
  { key: "others", label: "Others" },
  { key: "clientPoNumber", label: "Client PO Number" },
  { key: "supportDocsConfirmation", label: "Support Docs (Confirmation)" },
  { key: "weight", label: "Weight" },
  { key: "rebateCheck", label: "Rebate Check" },
] as const;

export type HoldReasonKey = (typeof HOLD_REASONS)[number]["key"];
export type ArDecision = "approve" | "hold";


export interface ArApprovePayload {
  decision: ArDecision;
  reasons: HoldReasonKey[];
  otherReason?: string;
}
 
interface ArApproveDialogProps {
  invoiceNumber: string;
  onClose: () => void;
  onSubmit: (payload: ArApprovePayload) => void;
}

function ArApproveDialog({ invoiceNumber, onClose, onSubmit }: ArApproveDialogProps) {
  const [decision, setDecision] = useState<ArDecision>("approve");
  const [reasons, setReasons] = useState<HoldReasonKey[]>([]);
  const [otherReason, setOtherReason] = useState("");

  const allSelected = reasons.length === HOLD_REASONS.length;
  const othersChecked = reasons.includes("others");
  const toggleReason = (key: HoldReasonKey) =>
    setReasons((current) =>
      current.includes(key) ? current.filter((reason) => reason !== key) : [...current, key],
    );
  const toggleAll = () =>
    setReasons(allSelected ? [] : HOLD_REASONS.map(({ key }) => key));
  const isValid =
    decision === "approve" ||
    (reasons.length > 0 && (!othersChecked || otherReason.trim().length > 0));

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit({
      decision,
      reasons: decision === "approve" ? [] : reasons,
      otherReason: decision === "hold" && othersChecked ? otherReason.trim() : undefined,
    });
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>AR Approval</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Review invoice <strong>{invoiceNumber}</strong> and choose an action.
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Decision</Typography>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={decision}
          onChange={(_, value: ArDecision | null) => value && setDecision(value)}
          sx={{ mb: 2, "& .MuiToggleButton-root": { textTransform: "none", fontWeight: 600 } }}
        >
          <ToggleButton value="approve">Approve</ToggleButton>
          <ToggleButton value="hold">Hold</ToggleButton>
        </ToggleButtonGroup>

        {decision === "hold" && (
          <Box sx={{ border: 1, borderColor: "divider", borderRadius: 2, p: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Reason for hold</Typography>
            <Link
              component="button"
              type="button"
              underline="hover"
              variant="body2"
              onClick={toggleAll}
              sx={{ display: "block", my: 1 }}
            >
              {allSelected ? "Clear all" : "Select all"}
            </Link>
            <Box sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              columnGap: 2,
            }}>
              {HOLD_REASONS.map(({ key, label }) => (
                <FormControlLabel
                  key={key}
                  label={label}
                  control={
                    <Checkbox
                      size="small"
                      checked={reasons.includes(key)}
                      onChange={() => toggleReason(key)}
                    />
                  }
                />
              ))}
            </Box>
            {othersChecked && (
              <TextField
                autoFocus
                fullWidth
                required
                multiline
                minRows={2}
                label="Other reason"
                value={otherReason}
                onChange={(event) => setOtherReason(event.target.value)}
                sx={{ mt: 1 }}
              />
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
        <Button variant="contained" disableElevation onClick={handleSubmit} disabled={!isValid}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const ACTIONS_COL_WIDTH = 280;
const MIN_COL_WIDTH = 72;
const columns: { label: string; width: number; align?: "left" | "center" | "right" }[] = [
  { label: "Invoice No", width: 150 },
  { label: "Invoice Date", width: 112 },
  { label: "Status", width: 100 },
  { label: "Approve Status", width:160},
  { label: "Client", width: 170 },
  { label: "Client PO No", width: 140 },
  { label: "Vessel", width: 140 },
  { label: "Manifest No", width: 140 },
  { label: "Mode", width: 90 },
  { label: "Origin", width: 95 },
  { label: "Destination", width: 110 },
  { label: "Departure Date", width: 125 },
  { label: "Arrival Date", width: 125 },
  { label: "Total Selling Amount", width: 155 },
  { label: "Received Amount", width: 140 },
  { label: "Total Cost", width: 120 },
  { label: "Total Profit", width: 120 },
  { label: "Special Commission", width: 150 },
  { label: "Final Profit", width: 120 },
  { label: "Final Profit Percentage", width: 155 },
  { label: "Actions", width: ACTIONS_COL_WIDTH, align: "center" },
];

export default function SaleInvoiceIndexTable({
  filters,
  rows,
  onDownload,
  onDownloadCompletePdf,
  onGenerateInvoice,
  onSpecialCommission,
  onStatusChange,
  onApprove,
}: Props) {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [activeRow, setActiveRow] = useState<SaleInvoiceRow | null>(null);
  const [arApprovalRow, setArApprovalRow] = useState<SaleInvoiceRow | null>(null);
  const [apApprovalRow, setApApprovalRow] = useState<SaleInvoiceRow | null>(null);
  const [commissionDialogOpen, setCommissionDialogOpen] = useState(false);
  const [commissionMode, setCommissionMode] = useState<"add" | "edit">("add");
  const [commissionAmount, setCommissionAmount] = useState("");
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusDraft, setStatusDraft] = useState<InvoiceStatus>("Draft");
  const [resizeState, setResizeState] = useState<{
    index: number;
    startX: number;
    startWidth: number;
  } | null>(null);
  const [widths, setWidths] = useState<Record<number, number>>(
    () => Object.fromEntries(columns.map((column, index) => [index, column.width])),
  );
  const totalWidth = columns.reduce((sum, _, index) => sum + widths[index], 0);

  useEffect(() => {
    if (!resizeState) return;

    const originalCursor = document.body.style.cursor;
    const originalUserSelect = document.body.style.userSelect;
    const onMove = (event: MouseEvent) => {
      setWidths((current) => ({
        ...current,
        [resizeState.index]: Math.max(
          MIN_COL_WIDTH,
          resizeState.startWidth + event.clientX - resizeState.startX,
        ),
      }));
    };
    const onUp = () => setResizeState(null);

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.body.style.cursor = originalCursor;
      document.body.style.userSelect = originalUserSelect;
    };
  }, [resizeState]);

  const startResize = (index: number, event: ReactMouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setResizeState({ index, startX: event.clientX, startWidth: widths[index] });
  };

  const resetWidth = (index: number) =>
    setWidths((current) => ({ ...current, [index]: columns[index].width }));

  const submitArApproval = (payload: ArApprovePayload) => {
    if (!arApprovalRow) return;
    onApprove(arApprovalRow, "ar", payload);
    setArApprovalRow(null);
  };

  const confirmApApproval = () => {
    if (!apApprovalRow) return;
    onApprove(apApprovalRow, "ap");
    setApApprovalRow(null);
  };

  const visibleRows = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    return rows.filter(({ preAlert, invoice }) => {
      const manifestNumbers = joinValues([
        ...invoice.subInvoices.map(({ manifestNo }) => manifestNo),
        preAlert.manifestNumber,
      ]);
      const vessels = [
        ...invoice.subInvoices.flatMap(({ vessels: subVessels }) => subVessels),
        preAlert.vessel ?? "",
      ];
      const vendorInvoiceNumbers = [
        ...(preAlert.vendorInvoices?.map(({ invoiceNo }) => invoiceNo ?? "") ?? []),
        ...invoice.subInvoices.flatMap(({ vendorCosts }) => vendorCosts.map(({ vendorInvoice }) => vendorInvoice)),
      ];
      const approvalStatus = getInvoiceApprovalStatus(invoice);
      if (filters.client && (invoice.form.recipient || preAlert.client) !== filters.client) return false;
      if (filters.vessel && !vessels.includes(filters.vessel)) return false;
      if (filters.hub && preAlert.hub !== filters.hub) return false;
      if (filters.vendorInvoiceNo && !vendorInvoiceNumbers.includes(filters.vendorInvoiceNo)) return false;
      if (filters.status && invoice.status !== filters.status) return false;
      if (filters.approvalStatus && approvalStatus !== filters.approvalStatus) return false;
      if (filters.mode && preAlert.mode !== filters.mode) return false;
      if (filters.keyAccountManager && preAlert.keyAccountManager !== filters.keyAccountManager) return false;
      if (filters.invoiceNumber && !invoice.invoiceNo.toLowerCase().includes(filters.invoiceNumber.toLowerCase())) return false;
      if (filters.jobNumber && !manifestNumbers.toLowerCase().includes(filters.jobNumber.toLowerCase())) return false;
      if (filters.fromDate && invoice.form.invoiceDate < filters.fromDate) return false;
      if (filters.toDate && invoice.form.invoiceDate > filters.toDate) return false;
      if (!query) return true;
      return [
        invoice.invoiceNo,
        invoice.status,
        approvalStatus,
        invoice.form.recipient,
        invoice.form.clientPoNumber,
        preAlert.client,
        preAlert.vessel,
        manifestNumbers,
        preAlert.mode,
        ...invoice.subInvoices.flatMap(({ vessels, origin, destination }) => [vessels.join(", "), origin, destination]),
      ].some((value) => value?.toLowerCase().includes(query));
    });
  }, [filters, rows]);

  const safePage = Math.min(page, Math.max(0, Math.ceil(visibleRows.length / rowsPerPage) - 1));
  const pageRows = visibleRows.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage);

  const openActions = (event: ReactMouseEvent<HTMLElement>, row: SaleInvoiceRow) => {
    setMenuAnchor(event.currentTarget);
    setActiveRow(row);
  };

  const closeActions = () => {
    setMenuAnchor(null);
    setActiveRow(null);
  };

  const navigateToInvoice = (mode: "edit" | "view") => {
    if (!activeRow) return;
    const { invoice, preAlert, type } = activeRow;
    navigate(
      type === "extra"
        ? `/invoices/extra-invoice-${mode}`
        : `/invoices/main-invoice-${mode}`,
      { state: { invoice, preAlert } },
    );
    closeActions();
  };

  const navigateToCreditNote = (mode: "create" | "view") => {
    if (!activeRow) return;
    navigate(`/invoices/credit-note-${mode}`, {
      state: activeRow,
    });
    closeActions();
  };

  const openStatusDialog = () => {
    if (!activeRow) return;
    setStatusDraft(activeRow.invoice.status);
    setMenuAnchor(null);
    setStatusDialogOpen(true);
  };

  const closeStatusDialog = () => {
    setStatusDialogOpen(false);
    setActiveRow(null);
  };

  const submitStatus = () => {
    if (!activeRow) return;
    onStatusChange(activeRow, statusDraft);
    closeStatusDialog();
  };

  const runAction = (action?: (row: SaleInvoiceRow) => void) => {
    if (activeRow) action?.(activeRow);
    closeActions();
  };

  const openCommissionDialog = (mode: "add" | "edit") => {
    setCommissionMode(mode);
    setCommissionAmount(
      mode === "edit" && activeRow?.invoice.specialCommission !== undefined
        ? String(activeRow.invoice.specialCommission)
        : "",
    );
    setMenuAnchor(null);
    setCommissionDialogOpen(true);
  };

  const closeCommissionDialog = () => {
    setCommissionDialogOpen(false);
    setCommissionAmount("");
    setActiveRow(null);
  };

  const submitCommission = () => {
    const amount = Number(commissionAmount);
    if (!activeRow || !commissionAmount.trim() || !Number.isFinite(amount) || amount < 0) return;
    onSpecialCommission(activeRow, amount);
    closeCommissionDialog();
  };

  const isEditingCommission = commissionMode === "edit";
  const parsedCommissionAmount = Number(commissionAmount);
  const hasCommissionAmount = commissionAmount.trim() !== "";
  const isCommissionAmountInvalid = hasCommissionAmount
    && (!Number.isFinite(parsedCommissionAmount) || parsedCommissionAmount < 0);
  const canSubmitCommission = hasCommissionAmount && !isCommissionAmountInvalid;

  return (
    <Paper variant="outlined" sx={{ overflow: "hidden" }  }>
      <TableContainer sx={{ maxHeight: "calc(100vh - 270px)", overflow: "auto" }}>
        <Table
          stickyHeader
          size="small"
          sx={{
            width: totalWidth,
            minWidth: "100%",
            tableLayout: "fixed",
            "& .MuiTableCell-root": {
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            },
            "& .col-actions": {
              position: "sticky",
              right: 0,
              bgcolor: "background.paper",
              boxShadow: "-6px 0 8px -6px rgba(0,0,0,0.25)",
              zIndex: 2,
            },
            "& .MuiTableCell-head.col-actions": { zIndex: 4 },

            // Extra invoices: tint + left accent bar (solid base keeps sticky cell opaque)
            "& .row-extra > .MuiTableCell-root": (theme: Theme) => ({
              backgroundImage: `linear-gradient(${alpha(theme.palette.warning.main, 0.1)}, ${alpha(theme.palette.warning.main, 0.1)})`,
            }),
            "& .row-extra:hover > .MuiTableCell-root": (theme: Theme) => ({
              backgroundImage: `linear-gradient(${alpha(theme.palette.warning.main, 0.18)}, ${alpha(theme.palette.warning.main, 0.18)})`,
            }),
            "& .row-extra > .MuiTableCell-root:first-of-type": (theme: Theme) => ({
              boxShadow: `inset 3px 0 0 ${theme.palette.warning.main}`,
            }),
            // Normal rows: make the sticky cell follow row hover
            "& .MuiTableRow-root:hover .col-actions": { bgcolor: "background.paper", },

            "& .col-resizer": {
              position: "absolute",
              top: 0,
              right: 0,
              zIndex: 5,
              width: 10,
              height: "100%",
              cursor: "col-resize",
              touchAction: "none",
              "&::after": {
                content: '""',
                position: "absolute",
                top: "25%",
                right: 3,
                width: 2,
                height: "50%",
                borderRadius: 1,
                bgcolor: "divider",
                transition: "background-color 0.15s, height 0.15s, top 0.15s",
              },
              "&:hover::after, &:focus-visible::after": {
                top: "15%",
                height: "70%",
                bgcolor: "primary.main",
              },
              "&:focus-visible": { outline: "none" },
            },
          }}
        >
          <colgroup>
            {columns.map((_, index) => <col key={index} style={{ width: widths[index] }} />)}
          </colgroup>
          <TableHead sx={{ height: 44 }}>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={column.label}
                  title={column.label}
                  align={column.align ?? (column.label.includes("Amount") || column.label.includes("Profit") || column.label.includes("Commission") ? "right" : "left")}
                  className={index === columns.length - 1 ? "col-actions" : undefined}
                  sx={{ position: "relative", fontWeight: 700, bgcolor: "background.paper" }}
                >
                  {column.label}
                  {index !== columns.length - 1 && (
                    <Box
                      className="col-resizer"
                      role="separator"
                      aria-orientation="vertical"
                      aria-label={`Resize ${column.label} column`}
                      title="Drag to resize; double-click to reset"
                      tabIndex={0}
                      onMouseDown={(event) => startResize(index, event)}
                      onKeyDown={(event) => {
                        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
                        event.preventDefault();
                        const delta = event.key === "ArrowRight" ? 16 : -16;
                        setWidths((current) => ({
                          ...current,
                          [index]: Math.max(MIN_COL_WIDTH, current[index] + delta),
                        }));
                      }}
                      onDoubleClick={() => resetWidth(index)}
                    />
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {pageRows.map((row) => {
              const { preAlert, invoice, type } = row;
              const subInvoices = invoice.subInvoices;
              const selling = invoice.totalPrice;
              const finalProfit = invoice.totalProfit - (invoice.specialCommission ?? 0);
              const profitPercentage = selling ? (finalProfit / selling) * 100 : 0;
              const client = invoice.form.recipient || preAlert.client || "";
              const vessels = joinValues(subInvoices.flatMap(({ vessels: subVessels }) => subVessels)) || preAlert.vessel || "";
              const manifests = joinValues([
                ...subInvoices.map(({ manifestNo }) => manifestNo),
                preAlert.manifestNumber,
              ]);
              const origins = joinValues(subInvoices.map(({ origin }) => origin)) || preAlert.origin;
              const destinations = joinValues(subInvoices.map(({ destination }) => destination)) || preAlert.destination;
              const departureDates = joinDates(subInvoices.map(({ etd }) => etd), preAlert.etd);
              const arrivalDates = joinDates(subInvoices.map(({ eta }) => eta), preAlert.eta);
              const statusColor = {
                      Paid: "success",
                      Issued: "primary",
                    } as const;
              const approvalStatus = getInvoiceApprovalStatus(invoice);
              return (
                <TableRow key={`${type}-${invoice.invoiceId}`} hover className={type === "extra" ? "row-extra" : undefined}>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>{invoice.invoiceNo}</Typography>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{formatDate(invoice.form.invoiceDate)}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <Chip
                      size="small"
                      label={invoice.status}
                      color={statusColor[invoice.status as keyof typeof statusColor] ?? "default"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <Chip
                      size="small"
                      label={approvalStatus}
                      color={approvalStatus === "Approved" ? "success" : "default"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{fieldValue(client)}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{fieldValue(invoice.form.clientPoNumber)}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{fieldValue(vessels)}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{fieldValue(manifests)}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{fieldValue(preAlert.mode)}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{fieldValue(origins)}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{fieldValue(destinations)}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{departureDates}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{arrivalDates}</TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>{formatAmount(selling)}</TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>—</TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>{formatAmount(invoice.totalCost)}</TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>{formatAmount(invoice.totalProfit)}</TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    {invoice.specialCommission === undefined ? "—" : formatAmount(invoice.specialCommission)}
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>{formatAmount(finalProfit)}</TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>{profitPercentage.toFixed(2)}%</TableCell>
                  <TableCell align="right" className="col-actions">
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
                      <Button
                        size="small"
                        color="primary"
                        variant="contained"
                        disabled={invoice.arApproved}
                        onClick={() => setArApprovalRow(row)}
                      >
                        {invoice.arApproved ? "AR Approved" : "AR approval"}
                      </Button>
                      
                      <Button
                        size="small"
                        color="warning"
                        variant="contained"
                        disabled={invoice.apApproved}
                        onClick={() => setApApprovalRow(row)}
                      >
                        {invoice.apApproved ? "AP Approved" : "AP approval"}
                      </Button>
                      <Tooltip title="Invoice actions" disableInteractive>
                        <IconButton
                          aria-label={`Actions for invoice ${invoice.invoiceNo}`}
                          size="small"
                          color="primary"
                          onClick={(event) => openActions(event, row)}
                        >
                          <SettingsIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
            {pageRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">No invoices found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={visibleRows.length}
        page={Math.min(page, Math.max(0, Math.ceil(visibleRows.length / rowsPerPage) - 1))}
        onPageChange={(_, nextPage) => setPage(nextPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(Number(event.target.value));
          setPage(0);
        }}
        rowsPerPageOptions={[10, 25, 50]}
      />
      
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeActions}
        slotProps={{ paper: { sx: { minWidth: 230 } } }}
      >
        <MenuItem onClick={() => navigateToInvoice("view")}>
          <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>
          <ListItemText>View invoice</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => navigateToInvoice("edit")}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Edit invoice</ListItemText>
        </MenuItem>
        <MenuItem onClick={openStatusDialog}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Update status</ListItemText>
        </MenuItem>
        <Divider />
        
        <MenuItem onClick={() => runAction(onGenerateInvoice)}>
          <ListItemIcon><ReceiptLongIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Generate invoice</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => runAction(onDownload)}>
          <ListItemIcon><FileDownloadIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => runAction(onDownloadCompletePdf)}>
          <ListItemIcon><PictureAsPdfIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Download complete PDF</ListItemText>
        </MenuItem>

        <Divider />
        <MenuItem onClick={() => navigateToCreditNote("create")}>
          <ListItemIcon><RequestQuoteIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Create credit note</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => navigateToCreditNote("view")}>
          <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>
          <ListItemText>View credit note</ListItemText>
        </MenuItem>
        <Divider />

        {activeRow?.invoice.specialCommission === undefined ? (
          <MenuItem onClick={() => openCommissionDialog("add")}>
            <ListItemIcon><PercentIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Add special commission</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem onClick={() => openCommissionDialog("edit")}>
            <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Edit special commission</ListItemText>
          </MenuItem>
        )}
      </Menu>

      <Dialog
        open={statusDialogOpen}
        onClose={closeStatusDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Update invoice status</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            size="small"
            label="Status"
            value={statusDraft}
            onChange={(event) => {
              const status = InvoiceStatusSchema.safeParse(event.target.value);
              if (status.success) setStatusDraft(status.data);
            }}
            sx={{ mt: 1 }}
          >
            {(["Draft", "Issued", "Paid"] as const).map((status) => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button variant="outlined" onClick={closeStatusDialog}>Cancel</Button>
          <Button variant="contained" disableElevation onClick={submitStatus}>Save status</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={commissionDialogOpen}
        onClose={closeCommissionDialog}
        fullWidth
        maxWidth="xs"
        slotProps={{ paper: { sx: { borderRadius: 2, mb: "20%" } } }}
        
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pr: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              display: "grid",
              placeItems: "center",
              color: "primary.main",
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <PercentOutlinedIcon fontSize="small" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {isEditingCommission ? "Edit special commission" : "Add special commission"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Deducted from the invoice profit
            </Typography>
          </Box>
          <IconButton size="small" aria-label="Close" onClick={closeCommissionDialog}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ py: 2.5 }}>
          <TextField
            autoFocus
            required
            fullWidth
            size="small"
            label="Special commission"
            type="number"
            value={commissionAmount}
            onChange={(event) => setCommissionAmount(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && canSubmitCommission) submitCommission();
            }}
            error={isCommissionAmountInvalid}
            helperText={isCommissionAmountInvalid ? "Enter a valid amount of 0 or more" : " "}
            slotProps={{
              htmlInput: { min: 0, step: "any" },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    {activeRow?.invoice.form.invoiceCurrency || "AED"}
                  </InputAdornment>
                ),
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 1.5, gap: 1 }}>
          <Button variant="outlined" color="error" onClick={closeCommissionDialog}>Cancel</Button>
          <Button
            variant="contained"
            disableElevation
            onClick={submitCommission}
            disabled={!canSubmitCommission}
          >
            {isEditingCommission ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>


      {arApprovalRow && (
        <ArApproveDialog
          invoiceNumber={arApprovalRow.invoice.invoiceNo}
          onClose={() => setArApprovalRow(null)}
          onSubmit={submitArApproval}
        />
      )}
      <Dialog
        open={Boolean(apApprovalRow)}
        onClose={() => setApApprovalRow(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>AP Approval</DialogTitle>
        <DialogContent>
          <Typography>
            Approve accounts payable for invoice{" "}
            <strong>{apApprovalRow?.invoice.invoiceNo}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button variant="outlined" onClick={() => setApApprovalRow(null)}>Cancel</Button>
          <Button variant="contained" color="warning" disableElevation onClick={confirmApApproval}>
            Confirm Approval
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}