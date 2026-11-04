import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Table,
  IconButton,
  TableBody,
  TableCell,
  TableContainer,
  TableHead, 
  TablePagination,
  TableRow,
  TextField,
  Typography,
  InputAdornment,
  Popover,
  Tooltip,
} from "@mui/material";
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import type {
  ClientReceiptFilters,
  ClientReceiptRow,
  ReceiptUpdate,
} from "../types/clientReceipt.types";
import { alpha } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

type Props = {
  filters: ClientReceiptFilters;
  rows: ClientReceiptRow[];
  onUpdateReceipt?: (row: ClientReceiptRow, update: ReceiptUpdate) => void | Promise<void>;
  onReopenReceipt: (row: ClientReceiptRow) => void;
  onApproveReceipt: (row: ClientReceiptRow) => void;
  
};

const ACTIONS_COL_WIDTH = 150;
const MIN_COL_WIDTH = 72;
const columns: { label: string; width: number; align?: "left" | "center" | "right" }[] = [
  { label: "Main Invoice No", width: 160 },
  { label: "Invoice Type", width: 100 },
  { label: "Invoice Date", width: 125 },
  { label: "Receipt Date", width: 125 },
  { label: "Status", width: 135 },
  { label: "Client", width: 220 },
  { label: "Client PO No", width: 150 },
  { label: "Vessel", width: 155 },
  { label: "Manifest No", width: 160 },
  { label: "Mode", width: 90 },
  { label: "Origin", width: 100 },
  { label: "Destination", width: 115 },
  { label: "Departure Date", width: 135 },
  { label: "Arrival Date", width: 135 },
  { label: "Total Amount", width: 150, align: "right" },
  { label: "Received Amount", width: 150, align: "right" },
  { label: "Outstanding Amount", width: 165, align: "right" },
  { label: "Final Profit", width: 145, align: "right" },
  { label: "Final Profit Percentage", width: 170, align: "right" },
  { label: "Bank Ref No", width: 150 },
  { label: "Client Bank Ref", width: 150 },
  { label: "Docs", width: 80, align: "center" },
  { label: "Actions", width: ACTIONS_COL_WIDTH, align: "center" },
];

const formatDate = (value: string) =>
  value ? new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString() : "—";

const formatAmount = (value: number, currency: string) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency || "AED",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const receiptStatusColors: Record<string, "default" | "primary" | "success" | "warning" | "error" | "info"> = {
  "Invoice Generated": "primary",
  "Received": "success",
  "Partially Received": "warning",
  "Reopened": "warning",
  "Approved": "success",
  "Reopen Request": "info",
  "Overdue": "error",
};

function ReceiptDocumentCell({ name, dataUrl }: { name?: string; dataUrl?: string }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  if (!name || !dataUrl) {
    return <Typography variant="body2" color="text.disabled">—</Typography>;
  }

  const downloadDocument = () => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = name;
    link.click();
  };

  return (
    <>
      <Tooltip title="1 document" arrow>
        <IconButton
          size="small"
          color="error"
          aria-label="Show receipt documents"
          onClick={(event) => setAnchor(event.currentTarget)}
          sx={{ p: 0.5 }}
        >
          <Badge badgeContent={1} color="error">
            <PictureAsPdfIcon sx={{ fontSize: "1.2rem" }} />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        slotProps={{ paper: { sx: { width: 340, borderRadius: 2 } } }}
      >
        <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="subtitle2">Receipt Document</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 2, py: 1 }}>
          <PictureAsPdfIcon color="error" fontSize="small" />
          <Typography variant="body2" noWrap title={name} sx={{ flex: 1 }}>
            {name}
          </Typography>
          <Tooltip title="Open" arrow>
            <IconButton
              size="small"
              aria-label={`Open ${name}`}
              onClick={() => window.open(dataUrl, "_blank", "noopener,noreferrer")}
            >
              <OpenInNewIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download" arrow>
            <IconButton size="small" aria-label={`Download ${name}`} onClick={downloadDocument}>
              <FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Popover>
    </>
  );
}

export default function ClientReceiptTable({
  filters,
  rows,
  onUpdateReceipt,
  onReopenReceipt,
  onApproveReceipt,

}: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeRow, setActiveRow] = useState<ClientReceiptRow | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [reopenConfirmationRow, setReopenConfirmationRow] = useState<ClientReceiptRow | null>(null);
  const [approveConfirmationRow, setApproveConfirmationRow] = useState<ClientReceiptRow | null>(null);
  const [amountReceived, setAmountReceived] = useState("");
  const [ourBankReference, setOurBankReference] = useState("");
  const [clientBankReference, setClientBankReference] = useState("");
  const [receivedDate, setReceivedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [document, setDocument] = useState<File | null>(null);
  const [removeExistingDocument, setRemoveExistingDocument] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [resizeState, setResizeState] = useState<{
    index: number;
    startX: number;
    startWidth: number;
  } | null>(null);
  const [widths, setWidths] = useState<Record<number, number>>(
    () => Object.fromEntries(columns.map((column, index) => [index, column.width])),
  );
  const totalWidth = columns.reduce((total, _, index) => total + widths[index], 0);

  useEffect(() => {
    if (!resizeState) return;

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

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [resizeState]);

  const startResize = (index: number, event: ReactMouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setResizeState({ index, startX: event.clientX, startWidth: widths[index] });
  };

  const resetWidth = (index: number) =>
    setWidths((current) => ({ ...current, [index]: columns[index].width }));

  const visibleRows = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    return rows.filter((row) => {
      if (filters.client && row.client !== filters.client) return false;
      if (filters.status && row.status !== filters.status) return false;
      if (filters.receiptNumber && !row.receiptNumber.toLowerCase().includes(filters.receiptNumber.toLowerCase())) return false;
      if (filters.invoiceNumber && !row.invoiceNumber.toLowerCase().includes(filters.invoiceNumber.toLowerCase())) return false;
      if (filters.fromDate && row.invoiceDate < filters.fromDate) return false;
      if (filters.toDate && row.invoiceDate > filters.toDate) return false;
      if (!query) return true;

      return [
        row.receiptNumber,
        row.receiptDate,
        row.invoiceNumber,
        row.invoiceDate,
        row.client,
        row.clientPoNumber,
        row.vessel,
        row.manifestNumber,
        row.mode,
        row.origin,
        row.destination,
        row.departureDate,
        row.arrivalDate,
        String(row.totalAmount),
        String(row.receivedAmount),
        String(row.outstandingAmount),
        String(row.finalProfit),
        String(row.finalProfitPercentage),
        row.bankRefNo,
        row.clientBankRefNo,
        row.status,
        String(row.amount),
        row.currency,
      ].some((value) => value.toLowerCase().includes(query));
    });
  }, [filters, rows]);

  const safePage = Math.min(page, Math.max(0, Math.ceil(visibleRows.length / rowsPerPage) - 1));
  const pageRows = visibleRows.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage);

  const openUpdateDialog = (row: ClientReceiptRow) => {
    const isEditingPayment = row.status === "Reopened";
    setActiveRow(row);
    setAmountReceived(isEditingPayment ? String(row.amount) : "");
    setOurBankReference(isEditingPayment ? row.bankRefNo : "");
    setClientBankReference(isEditingPayment ? row.referenceNumber : "");
    setReceivedDate(isEditingPayment && row.receiptDate
      ? row.receiptDate.slice(0, 10)
      : new Date().toISOString().slice(0, 10));
    setDocument(null);
    setRemoveExistingDocument(false);
    setSubmitError("");
    setUpdateDialogOpen(true);
  };

  const closeUpdateDialog = () => {
    setUpdateDialogOpen(false);
    setActiveRow(null);
    setSubmitError("");
  };

  const confirmReopenReceipt = () => {
    if (!reopenConfirmationRow) return;
    onReopenReceipt(reopenConfirmationRow);
    setReopenConfirmationRow(null);
  };

  const submitReceiptUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedAmount = Number(amountReceived);
    if (!activeRow || !onUpdateReceipt) return;
    if (!amountReceived.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setSubmitError("Enter an amount greater than zero.");
      return;
    }
    const editablePaymentAmount = activeRow.status === "Reopened" ? activeRow.amount : 0;
    const maximumAmount = activeRow.outstandingAmount + editablePaymentAmount;
    if (parsedAmount > maximumAmount) {
      setSubmitError("Amount received cannot exceed the outstanding amount.");
      return;
    }
    if (!receivedDate) {
      setSubmitError("Select the date the payment was received.");
      return;
    }

    try {
      await onUpdateReceipt(activeRow, {
        amountReceived: parsedAmount,
        ourBankReference: ourBankReference.trim(),
        clientBankReference: clientBankReference.trim(),
        receivedDate,
        removeDocument: removeExistingDocument,
        document,
      });
      closeUpdateDialog();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not save receipt update.");
    }
  };

  const receiptEditMaximum = activeRow
    ? activeRow.outstandingAmount + (activeRow.status === "Reopened" ? activeRow.amount : 0)
    : 0;

  const confirmApproveReceipt = () => {
    if (!approveConfirmationRow) return;
    onApproveReceipt(approveConfirmationRow);
    setApproveConfirmationRow(null);
  };

  return (
    <Paper variant="outlined" sx={{ overflow: "hidden", }}>
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
            {columns.map((column, index) => (
              <col key={column.label} style={{ width: widths[index] }} />
            ))}
          </colgroup>
          <TableHead sx={{ height: 44 }}> 
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={column.label}
                  title={column.label}
                  align={column.align ?? "left"}
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
            {pageRows.map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={(theme) => ({
                  "& > .MuiTableCell-root:first-of-type": {
                    borderLeft: row.invoiceType === "extra"
                      ? `4px solid ${theme.palette.warning.main}`
                      : undefined,
                  },
                  "& > .MuiTableCell-root:not(.col-actions)": {
                    backgroundColor: row.invoiceType === "extra"
                      ? theme.palette.mode === "dark"
                        ? "rgba(255, 167, 38, 0.08)"
                        : "rgba(237, 108, 2, 0.06)"
                      : undefined,
                  },
                  "&:hover > .MuiTableCell-root:not(.col-actions)": {
                    backgroundColor: row.invoiceType === "extra"
                      ? theme.palette.mode === "dark"
                        ? "rgba(255, 167, 38, 0.14)"
                        : "rgba(237, 108, 2, 0.12)"
                      : undefined,
                  },
                })}
              >
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                    {row.invoiceNumber || "—"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={row.invoiceType === "extra" ? "Extra" : "Main"}
                    color={row.invoiceType === "extra" ? "warning" : "primary"}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{formatDate(row.invoiceDate)}</TableCell>
                <TableCell>{formatDate(row.receiptDate)}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={row.status || "—"}
                    color={receiptStatusColors[row.status] ?? "default"}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{row.client || "—"}</TableCell>
                <TableCell>{row.clientPoNumber || "—"}</TableCell>
                <TableCell>{row.vessel || "—"}</TableCell>
                <TableCell>{row.manifestNumber || "—"}</TableCell>
                <TableCell>{row.mode || "—"}</TableCell>
                <TableCell>{row.origin || "—"}</TableCell>
                <TableCell>{row.destination || "—"}</TableCell>
                <TableCell>{formatDate(row.departureDate)}</TableCell>
                <TableCell>{formatDate(row.arrivalDate)}</TableCell>
                <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                  {formatAmount(row.totalAmount, row.currency)}
                </TableCell>
                <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                  {formatAmount(row.receivedAmount, row.currency)}
                </TableCell>
                <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                  {formatAmount(row.outstandingAmount, row.currency)}
                </TableCell>
                <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                  {formatAmount(row.finalProfit, row.currency)}
                </TableCell>
                <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                  {`${row.finalProfitPercentage.toFixed(2)}%`}
                </TableCell>
                <TableCell>
                  {row.bankRefNo || "—"}
                </TableCell>
                <TableCell>{row.clientBankRefNo || "—"}</TableCell>
                <TableCell align="center">
                  <ReceiptDocumentCell name={row.documentName} dataUrl={row.documentDataUrl} />
                </TableCell>
                <TableCell align="center" className="col-actions">
                  {row.status.trim().toLowerCase() === "received" ? (
                    <Button
                      size="small"
                      variant="contained"
                      color="warning"
                      disableElevation
                      onClick={() => setReopenConfirmationRow(row)}
                    >
                      Reopen Request
                    </Button>
                  ) : row.status === "Reopen Request" ? (
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      disableElevation
                      onClick={() => setApproveConfirmationRow(row)}
                    >
                      Approve
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      variant="contained"
                      disableElevation
                      onClick={() => openUpdateDialog(row)}
                    >
                      Update Receipt
                    </Button>
                  )}
                </TableCell>

              </TableRow>
            ))}
            {pageRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">No client receipts found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={visibleRows.length}
        page={safePage}
        onPageChange={(_, nextPage) => setPage(nextPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(Number(event.target.value));
          setPage(0);
        }}
        rowsPerPageOptions={[10, 25, 50]}
      />
      
        <Dialog
            open={updateDialogOpen}
            onClose={closeUpdateDialog}
            fullWidth
            maxWidth="sm"
            sx={{ mb:25 }}
            >
            <Box component="form" onSubmit={submitReceiptUpdate}>
            {/* Header */}
            <DialogTitle sx={{ p: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 3, pt: 2.5, pb: 2 }}>
                    <Avatar
                        sx={{
                        bgcolor: (t) => alpha(t.palette.primary.main, 0.12),
                        color: "primary.main",
                        width: 40,
                        height: 40,
                        }}
                    >
                        <ReceiptLongRoundedIcon fontSize="small" />
                    </Avatar>
                    <Box sx={{ display: "flex", flex: 1, minWidth: 0 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                        {activeRow?.status === "Reopened" ? "Edit Receipt" : "Update Receipt"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 5 }}>
                        {activeRow?.status === "Reopened"
                          ? "Update the existing receipt details"
                          : "Record a payment against this invoice"}
                        </Typography>
                    </Box>
                    <IconButton color="error" onClick={closeUpdateDialog} size="small" aria-label="Close">
                        <CloseRoundedIcon fontSize="small" />
                    </IconButton>
                </Box>

                {activeRow && (
                
                    <Box
                        
                        sx={{
                            mb: 1,
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 3,
                            width: "100%",
                            maxWidth: 460,      
                            mx: "auto",        
                            px: 2.5,           
                            py: 2.5,
                            borderRadius: 2,
                            border: 1,
                            borderColor: "divider",
                            bgcolor: (t) => alpha(t.palette.text.primary, 0.03),
                        }}
                        >
                        {/* Invoice */}
                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                            variant="overline"
                            color="text.secondary"
                            sx={{ display: "block", lineHeight: 1.6, letterSpacing: 0.8 }}
                            >
                            Invoice No
                            </Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.3 }} noWrap>
                            {activeRow.invoiceNumber}
                            </Typography>
                        </Box>

                        {/* Outstanding */}
                        <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                            <Typography
                            variant="overline"
                            color="text.secondary"
                            sx={{ display: "block", lineHeight: 1.6, letterSpacing: 0.8 }}
                            >
                            Outstanding
                            </Typography>
                            <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 800,
                                lineHeight: 1.3,
                                color: "error.main",
                                fontVariantNumeric: "tabular-nums",
                            }}
                            >
                            {formatAmount(activeRow.outstandingAmount, activeRow.currency)}
                            </Typography>
                        </Box>
                    </Box>
                
                )}
            </DialogTitle>

            {/* Body */}
            <DialogContent sx={{ px: 3, py: 3 }}>
                <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                    gap: 2.5,
                    pt: 0.5,
                }}
                >
                <TextField
                    autoFocus
                    required
                    fullWidth
                    size="small"
                    type="number"
                    label="Amount Received"
                    value={amountReceived}
                    onChange={(event) => {
                    setAmountReceived(event.target.value);
                    setSubmitError("");
                    }}
                    slotProps={{
                    htmlInput: { min: 0.01, max: receiptEditMaximum, step: "any" },
                    input: {
                        startAdornment: activeRow?.currency ? (
                        <InputAdornment position="start">{activeRow.currency}</InputAdornment>
                        ) : undefined,
                        endAdornment: activeRow ? (
                        <InputAdornment position="end">
                            <Chip
                            label="Full"
                            size="small"
                            clickable
                            color="primary"
                            variant="outlined"
                            onClick={() => {
                                setAmountReceived(String(receiptEditMaximum));
                                setSubmitError("");
                            }}
                            />
                        </InputAdornment>
                        ) : undefined,
                    },
                    }}
                    helperText={
                    activeRow
                        ? `Maximum ${formatAmount(receiptEditMaximum, activeRow.currency)}`
                        : undefined
                    }
                />

                <TextField
                    required
                    fullWidth
                    size="small"
                    type="date"
                    label="Received Date"
                    value={receivedDate}
                    onChange={(event) => setReceivedDate(event.target.value)}
                    slotProps={{ inputLabel: { shrink: true } }}
                />

                <TextField
                    fullWidth
                    size="small"
                    label="Our Bank Reference"
                    value={ourBankReference}
                    onChange={(event) => setOurBankReference(event.target.value)}
                />

                <TextField
                    fullWidth
                    size="small"
                    label="Client Bank Reference"
                    value={clientBankReference}
                    onChange={(event) => setClientBankReference(event.target.value)}
                />

                {/* Upload */}
                <Box sx={{ gridColumn: { sm: "1 / -1" } }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.75, display: "block" }}>
                    Supporting Document
                    </Typography>

                    {document ? (
                    <Box
                        sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        p: 1.25,
                        borderRadius: 2,
                        border: 1,
                        borderColor: "divider",
                        bgcolor: (t) => alpha(t.palette.primary.main, 0.04),
                        }}
                    >
                        <InsertDriveFileRoundedIcon color="primary" />
                        <Typography variant="body2" sx={{ flex: 1, fontWeight: 600 }} noWrap>
                        {document.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                        {(document.size / 1024).toFixed(1)} KB
                        </Typography>
                        <IconButton size="small" onClick={() => setDocument(null)} aria-label="Remove file">
                        <CloseRoundedIcon fontSize="small" />
                        </IconButton>
                    </Box>
                    ) : activeRow?.status === "Reopened" && activeRow.documentName && !removeExistingDocument ? (
                    <Box
                        sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        p: 1.25,
                        borderRadius: 2,
                        border: 1,
                        borderColor: "divider",
                        bgcolor: (t) => alpha(t.palette.primary.main, 0.04),
                        }}
                    >
                        <InsertDriveFileRoundedIcon color="primary" />
                        <Typography variant="body2" sx={{ flex: 1, fontWeight: 600 }} noWrap>
                        {activeRow.documentName}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => setRemoveExistingDocument(true)}
                          aria-label="Remove existing document"
                        >
                          <CloseRoundedIcon fontSize="small" />
                        </IconButton>
                    </Box>
                    ) : (
                    <Box
                        component="label"
                        sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 0.5,
                        py: 2.5,
                        borderRadius: 2,
                        border: 2,
                        borderStyle: "dashed",
                        borderColor: "divider",
                        color: "text.secondary",
                        cursor: "pointer",
                        transition: "all .2s",
                        "&:hover": {
                            borderColor: "primary.main",
                            color: "primary.main",
                            bgcolor: (t) => alpha(t.palette.primary.main, 0.04),
                        },
                        }}
                    >
                        <CloudUploadRoundedIcon />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Click to upload document
                        </Typography>
                        <input
                        hidden
                        type="file"
                        onChange={(event) => {
                          setDocument(event.target.files?.[0] ?? null);
                          setRemoveExistingDocument(false);
                        }}
                        />
                    </Box>
                    )}
                </Box>

                {submitError && (
                    <Alert severity="error" variant="outlined" sx={{ gridColumn: { sm: "1 / -1" }, borderRadius: 2 }}>
                    {submitError}
                    </Alert>
                )}
                </Box>
            </DialogContent>

            <Divider />

            {/* Footer */}
            <DialogActions
                sx={{
                px: 3,
                py: 2,
                gap: 1,
                bgcolor: (t) => alpha(t.palette.text.primary, 0.02),
                }}
            >
                <Button type="button" color="error" variant="outlined" onClick={closeUpdateDialog} sx={{ textTransform: "none" }}>
                Cancel
                </Button>
                <Button
                type="submit"
                variant="contained"
                disableElevation
                disabled={!onUpdateReceipt}
                sx={{ textTransform: "none", fontWeight: 600, px: 3, borderRadius: 2 }}
                >
                Submit
                </Button>
            </DialogActions>
            </Box>
        </Dialog>
        
        {/* Reopen Dialog */}
        <Dialog
          open={Boolean(reopenConfirmationRow)}
          onClose={() => setReopenConfirmationRow(null)}
          fullWidth
          maxWidth="sm"
          slotProps={{ paper: { sx: { borderRadius: 3,mb:30 } } }}
        >
          {/* Header */}
          <DialogTitle sx={{ p: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 3, pt: 2.5, pb: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: (t) => alpha(t.palette.warning.main, 0.14),
                  color: "warning.main",
                  width: 40,
                  height: 40,
                }}
              >
                <LockOpenRoundedIcon fontSize="small" />
              </Avatar>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  Reopen Receipt
                </Typography>
              </Box>

              <IconButton
                size="small"
                aria-label="Close"
                onClick={() => setReopenConfirmationRow(null)}
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </Box>
          </DialogTitle>

          {/* Body */}
          <DialogContent sx={{ px: 3, pt: 1, pb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Are you sure you want to reopen the receipt request for this invoice?
            </Typography>

            {reopenConfirmationRow && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                  px: 2,
                  py: 1.75,
                  borderRadius: 2,
                  border: 1,
                  borderColor: "divider",
                  bgcolor: (t) => alpha(t.palette.text.primary, 0.03),
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                    variant="overline"
                      color="text.secondary"
                      sx={{ display: "block", lineHeight: 1.6, letterSpacing: 0.8 }}     
                    >
                      Invoice No
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
                      {reopenConfirmationRow.invoiceNumber}
                    </Typography>
                  </Box>
                  <Typography color="primary" noWrap sx={{ fontWeight: 700 }}>
                    {reopenConfirmationRow.client}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    sx={{ display: "block", lineHeight: 1.6, letterSpacing: 0.8 }}
                  >
                    Received
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}
                  >
                    {formatAmount(
                      reopenConfirmationRow.receivedAmount,
                      reopenConfirmationRow.currency,
                    )}
                  </Typography>
                </Box>
              </Box>
            )}

            <Alert severity="warning" variant="outlined" sx={{ mt: 2, borderRadius: 2 }}>
              The receipt will be marked as <strong>Reopen Request</strong> until it is reviewed.
            </Alert>
          </DialogContent>

          <Divider />

          {/* Footer */}
          <DialogActions
            sx={{
              px: 3,
              py: 2,
              gap: 1,
              bgcolor: (t) => alpha(t.palette.text.primary, 0.02),
            }}
          >
            <Button
              variant="outlined"
              color="error"
              onClick={() => setReopenConfirmationRow(null)}
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="warning"
              disableElevation
              onClick={confirmReopenReceipt}
              sx={{ textTransform: "none", fontWeight: 600, px: 3, borderRadius: 2 }}
            >
              Confirm Reopen
            </Button>
          </DialogActions>
        </Dialog>

        {/* Approve Dialog */}
        <Dialog
          open={Boolean(approveConfirmationRow)}
          onClose={() => setApproveConfirmationRow(null)}
          fullWidth
          maxWidth="sm"
          slotProps={{ paper: { sx: { borderRadius: 3, mb: 30 } } }}
        >
          <DialogTitle sx={{ p: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 3, pt: 2.5, pb: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: (t) => alpha(t.palette.success.main, 0.14),
                  color: "success.main",
                  width: 40,
                  height: 40,
                }}
              >
                <CheckCircleRoundedIcon fontSize="small" />
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  Approve Reopen Request
                </Typography>
              </Box>
              <IconButton size="small" aria-label="Close" onClick={() => setApproveConfirmationRow(null)}>
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ px: 3, pt: 1, pb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Are you sure you want to approve the reopen request for this invoice?
            </Typography>

            {approveConfirmationRow && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                  px: 2,
                  py: 1.75,
                  borderRadius: 2,
                  border: 1,
                  borderColor: "divider",
                  bgcolor: (t) => alpha(t.palette.text.primary, 0.03),
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="overline"
                      color="text.secondary"
                      sx={{ display: "block", lineHeight: 1.6, letterSpacing: 0.8 }}
                    >
                      Invoice No
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
                      {approveConfirmationRow.invoiceNumber}
                    </Typography>
                  </Box>
                  <Typography color="primary" noWrap sx={{ fontWeight: 700 }}>
                    {approveConfirmationRow.client}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    sx={{ display: "block", lineHeight: 1.6, letterSpacing: 0.8 }}
                  >
                    Received
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                    {formatAmount(approveConfirmationRow.receivedAmount, approveConfirmationRow.currency)}
                  </Typography>
                </Box>
              </Box>
            )}

            <Alert severity="success" variant="outlined" sx={{ mt: 2, borderRadius: 2 }}>
              The receipt will be reopened and the <strong>Update Receipt</strong> action will be available again.
            </Alert>
          </DialogContent>

          <Divider />

          <DialogActions sx={{ px: 3, py: 2, gap: 1, bgcolor: (t) => alpha(t.palette.text.primary, 0.02) }}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setApproveConfirmationRow(null)}
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              disableElevation
              onClick={confirmApproveReceipt}
              sx={{ textTransform: "none", fontWeight: 600, px: 3, borderRadius: 2 }}
            >
              Confirm Approve
            </Button>
          </DialogActions>
        </Dialog>
    </Paper>
  );
}