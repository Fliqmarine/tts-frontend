import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import {
  Box,
  Button,
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
  Typography,
} from "@mui/material";
import {
  useEffect,
  useMemo,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import type {
  InvoiceReportFilters,
  InvoiceReportRow,
} from "../types/invoiceReport.types";

type Props = {
  filters: InvoiceReportFilters;
  rows: InvoiceReportRow[];
  showDemoRows?: boolean;
  onRowsChange?: (rows: InvoiceReportRow[]) => void;
};

const demoRows: InvoiceReportRow[] = [
  {
    invoiceNo: "INV-2026-021",
    invoiceDate: "2026-10-20",
    status: "Draft",
    client: "Northstar Marine",
    clientPoNo: "NSM-PO-26021",
    vessel: "Ocean Pioneer",
    manifestNo: "MAN-26021",
    mode: "Air",
    origin: "SIN",
    destination: "LHR",
    departureDate: "2026-10-21",
    arrivalDate: "2026-10-22",
    totalAmount: 5800,
    receivedAmount: 2000,
    currency: "AED",
    totalCost: 4200,
    totalProfit: 1600,
    specialCommission: 200,
    finalProfit: 1400,
    finalProfitPercentage: 24.14,
  },
  {
    invoiceNo: "INV-2026-022",
    invoiceDate: "2026-10-21",
    status: "Received",
    client: "Bluewater Logistics",
    clientPoNo: "BWL-PO-26022",
    vessel: "Atlantic Star",
    manifestNo: "MAN-26022",
    mode: "Sea",
    origin: "JEA",
    destination: "FRA",
    departureDate: "2026-10-22",
    arrivalDate: "2026-10-25",
    totalAmount: 7600,
    receivedAmount: 7600,
    currency: "AED",
    totalCost: 5100,
    totalProfit: 2500,
    specialCommission: 300,
    finalProfit: 2200,
    finalProfitPercentage: 28.95,
  },
  {
    invoiceNo: "INV-2026-023",
    invoiceDate: "2026-10-22",
    status: "Partially Received",
    client: "Apex Industrial",
    clientPoNo: "APX-PO-26023",
    vessel: "Pacific Meridian",
    manifestNo: "MAN-26023",
    mode: "Air",
    origin: "HKG",
    destination: "LAX",
    departureDate: "2026-10-23",
    arrivalDate: "2026-10-24",
    totalAmount: 9200,
    receivedAmount: 3500,
    currency: "AED",
    totalCost: 6400,
    totalProfit: 2800,
    specialCommission: 400,
    finalProfit: 2400,
    finalProfitPercentage: 26.09,
  },
];

const columns: {
  key: keyof InvoiceReportRow;
  label: string;
  width: number;
  align?: "left" | "right";
  numeric?: boolean;
}[] = [
  { key: "invoiceNo", label: "Main Invoice No", width: 160 },
  { key: "invoiceDate", label: "Invoice Date", width: 125 },
  { key: "status", label: "Status", width: 150 },
  { key: "client", label: "Client", width: 200 },
  { key: "clientPoNo", label: "Client PO No", width: 150 },
  { key: "vessel", label: "Vessel", width: 155 },
  { key: "manifestNo", label: "Manifest No", width: 160 },
  { key: "mode", label: "Mode", width: 90 },
  { key: "origin", label: "Origin", width: 100 },
  { key: "destination", label: "Destination", width: 115 },
  { key: "departureDate", label: "Departure Date", width: 135 },
  { key: "arrivalDate", label: "Arrival Date", width: 135 },
  { key: "totalAmount", label: "Total Amount", width: 150, align: "right", numeric: true },
  { key: "receivedAmount", label: "Received Amount", width: 150, align: "right", numeric: true },
  { key: "totalCost", label: "Total Cost", width: 150, align: "right", numeric: true },
  { key: "totalProfit", label: "Total Profit", width: 150, align: "right", numeric: true },
  { key: "specialCommission", label: "Special Commission", width: 170, align: "right", numeric: true },
  { key: "finalProfit", label: "Final Profit", width: 145, align: "right", numeric: true },
  { key: "finalProfitPercentage", label: "Final Profit Percentage", width: 185, align: "right", numeric: true },
];

const MIN_COL_WIDTH = 72;

const invoiceStatusColors: Record<
  string,
  "default" | "info" | "success" | "warning"
> = {
  "Invoice Generated": "info",
  Received: "success",
  "Partially Received": "warning",
};

const formatDate = (value: string) =>
  value
    ? value
        .split(", ")
        .map((date) => new Date(`${date.slice(0, 10)}T00:00:00`).toLocaleDateString())
        .join(", ")
    : "—";

const formatAmount = (value: number, currency: string) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency || "AED",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export default function InvoiceReportTable({
  filters,
  rows,
  showDemoRows = false,
  onRowsChange,
}: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [widths, setWidths] = useState<Record<number, number>>(
    () => Object.fromEntries(columns.map((column, index) => [index, column.width])),
  );
  const [resizeState, setResizeState] = useState<{
    index: number;
    startX: number;
    startWidth: number;
  } | null>(null);
  const displayedRows = showDemoRows ? demoRows : rows;
  const totalWidth = columns.reduce((total, _, index) => total + widths[index], 44);

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

  useEffect(() => {
    onRowsChange?.(displayedRows);
  }, [displayedRows, onRowsChange]);

  const filteredRows = useMemo(() => {
    const textMatches = (value: string, filter: string) =>
      !filter || value.toLowerCase().includes(filter.toLowerCase());
    const dateMatches = (value: string, from: string, to: string) => {
      const date = value.slice(0, 10);
      return (!from || date >= from) && (!to || date <= to);
    };

    return displayedRows.filter((row) =>
      textMatches(row.client, filters.client) &&
      textMatches(row.vessel, filters.vessel) &&
      textMatches(row.status, filters.status) &&
      textMatches(row.manifestNo, filters.manifestNo) &&
      textMatches(row.invoiceNo, filters.invoiceNo) &&
      textMatches(row.mode, filters.mode) &&
      dateMatches(row.invoiceDate, filters.dateFrom, filters.dateTo),
    );
  }, [filters, displayedRows]);

  const currentPage = Math.min(
    page,
    Math.max(0, Math.ceil(filteredRows.length / rowsPerPage) - 1),
  );
  const pageRows = filteredRows.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage,
  );
  const pageIds = pageRows.map(({ invoiceNo }) => invoiceNo);
  const allOnPageSelected =
    pageIds.length > 0 && pageIds.every((invoiceNo) => selected.includes(invoiceNo));
  const someOnPageSelected =
    pageIds.some((invoiceNo) => selected.includes(invoiceNo)) && !allOnPageSelected;
  const selectedRows = filteredRows.filter(({ invoiceNo }) => selected.includes(invoiceNo));

  const exportColumns = columns;
  const exportValue = (row: InvoiceReportRow, key: keyof InvoiceReportRow) => {
    if (key === "invoiceDate" || key === "departureDate" || key === "arrivalDate") {
      return formatDate(row[key]);
    }
    if (key === "finalProfitPercentage") return `${row.finalProfitPercentage.toFixed(2)}%`;
    if (key === "totalAmount" || key === "receivedAmount" || key === "totalCost" ||
      key === "totalProfit" || key === "specialCommission" || key === "finalProfit") {
      return formatAmount(row[key], row.currency);
    }
    return row[key];
  };

  const handleExportExcel = () => {
    const csvCell = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
    const csv = [
      exportColumns.map(({ label }) => csvCell(label)).join(","),
      ...selectedRows.map((row) =>
        exportColumns.map(({ key }) => csvCell(exportValue(row, key))).join(","),
      ),
    ].join("\r\n");
    const url = URL.createObjectURL(
      new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "invoice-report.csv";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  const handleExportPdf = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const escapeHtml = (value: string | number) =>
      String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
    const headings = exportColumns
      .map(({ label }) => `<th>${escapeHtml(label)}</th>`)
      .join("");
    const body = selectedRows
      .map((row) =>
        `<tr>${exportColumns
          .map(({ key }) => `<td>${escapeHtml(exportValue(row, key))}</td>`)
          .join("")}</tr>`,
      )
      .join("");
    printWindow.document.write(
      `<html><head><title>Invoice Report</title><style>body{font-family:Arial,sans-serif}table{border-collapse:collapse;width:100%;font-size:9px}th,td{border:1px solid #bbb;padding:5px;text-align:left;white-space:nowrap}th{background:#eee}</style></head><body><h2>Invoice Report</h2><table><thead><tr>${headings}</tr></thead><tbody>${body}</tbody></table><script>window.onload=()=>{window.print();window.close()}</script></body></html>`,
    );
    printWindow.document.close();
  };

  const handleSelectAll = () => {
    setSelected((current) =>
      allOnPageSelected
        ? current.filter((invoiceNo) => !pageIds.includes(invoiceNo))
        : [...new Set([...current, ...pageIds])],
    );
  };

  return (
    <>
    {selectedRows.length > 0 && (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
          px: 2,
          py: 1,
          mb: 1,
          bgcolor: "action.hover",
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
          {selectedRows.length} items selected
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            size="small"
            color="success"
            startIcon={<FileDownloadOutlinedIcon />}
            onClick={handleExportExcel}
            sx={{ textTransform: "none" , borderRadius: 20,}}
          >
            Export Excel
          </Button>
          <Button
            variant="contained"
            size="small"
            color="secondary"
            startIcon={<FileDownloadOutlinedIcon />}
            onClick={handleExportPdf}
            sx={{ textTransform: "none" , borderRadius: 20,}}
          >
            Export PDF
          </Button>
        </Box>
      </Box>
    )}
    <Paper variant="outlined" sx={{ overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: "calc(100vh - 300px)" }}>
        <Table
          stickyHeader
          size="small"
          sx={(theme) => ({
            width: totalWidth,
            minWidth: "100%",
            tableLayout: "fixed",
            "& .MuiTableCell-root": {
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              borderColor: theme.palette.divider,
            },
            "& .MuiTableCell-head": {
              position: "relative",
              zIndex: 1,
              fontWeight: 700,
              bgcolor: "background.paper",
              borderBottom: `2px solid ${theme.palette.divider}`,
            },
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
          })}
        >
          <colgroup>
            <col style={{ width: 44 }} />
            {columns.map((column, index) => (
              <col key={column.key} style={{ width: widths[index] }} />
            ))}
          </colgroup>
          <TableHead sx={{ height: 44 }}>
            <TableRow>
              <TableCell padding="checkbox" sx={{ backgroundColor: "background.paper" }}>
                <Checkbox
                  size="small"
                  checked={allOnPageSelected}
                  indeterminate={someOnPageSelected}
                  onChange={handleSelectAll}
                  slotProps={{
                    input: { "aria-label": "Select all invoice report rows on this page" },
                  }}
                />
              </TableCell>
              {columns.map(({ key, label, align }, index) => (
                <TableCell
                  key={key}
                  align={align}
                  title={label}
                  sx={{ fontWeight: 700, whiteSpace: "nowrap", backgroundColor: "background.paper" }}
                >
                  {label}
                  <Box
                    className="col-resizer"
                    role="separator"
                    aria-orientation="vertical"
                    aria-label={`Resize ${label} column`}
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
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {pageRows.map((row) => (
              <TableRow
                key={row.invoiceNo}
                hover
                selected={selected.includes(row.invoiceNo)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    size="small"
                    checked={selected.includes(row.invoiceNo)}
                    onChange={() =>
                      setSelected((current) =>
                        current.includes(row.invoiceNo)
                          ? current.filter((invoiceNo) => invoiceNo !== row.invoiceNo)
                          : [...current, row.invoiceNo],
                      )
                    }
                    slotProps={{
                      input: { "aria-label": `Select invoice ${row.invoiceNo}` },
                    }}
                  />
                </TableCell>
                {columns.map(({ key, align, numeric }) => {
                  const value = row[key];
                  let display: string;

                  if (numeric) {
                    display = typeof value !== "number"
                      ? "—"
                      : key === "finalProfitPercentage"
                        ? `${value.toFixed(2)}%`
                        : formatAmount(value, row.currency);
                  } else if (key === "invoiceDate" || key === "departureDate" || key === "arrivalDate") {
                    display = typeof value === "string" ? formatDate(value) : "—";
                  } else {
                    display = String(value || "—");
                  }

                  return (
                    <TableCell
                      key={key}
                      align={align}
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      {key === "status" ? (
                        <Chip
                          size="small"
                          label={row.status}
                          color={invoiceStatusColors[row.status] ?? "default"}
                          variant="outlined"
                          sx={row.status === "Draft" ? {
                            color: "var(--mui-palette-secondary-dark, #ad1457)",
                            borderColor: "var(--mui-palette-secondary-light, #f48fb1)",
                            backgroundColor: "var(--mui-palette-secondary-light, #fce4ec)",
                          } : undefined}
                        />
                      ) : key === "vessel" && row.vessel ? (
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          {row.vessel.split(", ").map((vessel) => (
                            <Chip
                              key={vessel}
                              size="small"
                              label={vessel}
                              color={invoiceStatusColors[row.status] ?? "default"}
                              variant="outlined"
                              sx={row.status === "Draft" ? {
                                color: "var(--mui-palette-secondary-dark, #ad1457)",
                                borderColor: "var(--mui-palette-secondary-light, #f48fb1)",
                                backgroundColor: "var(--mui-palette-secondary-light, #fce4ec)",
                              } : undefined}
                            />
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" component="span">
                          {display}
                        </Typography>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
            {!pageRows.length && (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 4 }}>
                  No invoice report records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredRows.length}
        page={currentPage}
        onPageChange={(_, nextPage) => setPage(nextPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(Number(event.target.value));
          setPage(0);
        }}
        rowsPerPageOptions={[10, 25, 50]}
      />
    </Paper>
    </>
  );
}