import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import {
  Autocomplete,Box,Button,Chip,IconButton,MenuItem,Paper,Stack,Table,TableBody,TableCell,TableContainer,
  TableHead,TableRow,TextField,Tooltip,Typography,useMediaQuery,} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { PreAlertDetails } from "../jobs/types/preAlert.types";
import type {
  InvoiceLineRow,
  InvoiceStatus,
  MainInvoiceForm,
  SubInvoiceRow,
  VendorCostRow,
  VendorInvoiceSummary,
} from "./types/mainInvoice.types";
import { saveExtraInvoice, type SavedMainInvoice } from "./mainInvoiceStorage";

type ExtraInvoiceLocationState = {
  preAlert?: PreAlertDetails;
  invoice?: SavedMainInvoice;
};

/* ------------------------------------------------------------------ */
/* Shared styling                                                      */
/* ------------------------------------------------------------------ */

const tinted = (amount: number) => (t: Theme) => alpha(t.palette.primary.main, amount);

/** Page-level card: flat, outlined, consistent radius */
const cardSx = {
  p: { xs: 1, sm: 1.5 },
  borderRadius: 1,
  display: "flex",
  flexDirection: "column",
  gap: 0.5,
  minWidth: 0,
} as const;

/** Calculated / locked fields: soft fill + dashed border, still readable */
const readOnlySx = {
  "& .MuiOutlinedInput-root": { bgcolor: "action.hover" },
  "& .MuiOutlinedInput-root.Mui-disabled fieldset": { borderStyle: "dashed" },
  "& .MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: (t: Theme) => t.palette.text.primary,
  },
};

const numericSx = { "& input": { textAlign: "right", fontVariantNumeric: "tabular-nums" } };
const readOnlyNumericSx = { ...readOnlySx, ...numericSx };

const headCellSx = {
  fontWeight: 600,
  whiteSpace: "nowrap",
  px: 1,
  py: 1,
  color: "text.secondary",
  bgcolor: tinted(0.05),
} as const;

const autoGrid = (min: number) =>
  ({
    display: "grid",
    gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`,
    gap: 1.5,
  }) as const;

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

type SectionHeaderLocalProps = {
  title: string;
  icon?: ReactNode;
  description?: string;
  required?: boolean;
  action?: ReactNode;
};

function SectionHeader({ title, icon, description, required = false, action }: SectionHeaderLocalProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
      {icon && (
        <Box
          sx={{
            display: "grid",
            placeItems: "center",
            width: 38,
            height: 38,
            borderRadius: 1.5,
            color: "primary.main",
            bgcolor: tinted(0.1),
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      )}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
          {title}
          {required && <Box component="span" sx={{ color: "error.main" }}> *</Box>}
        </Typography>
        {description && (
          <Typography variant="caption" color="text.secondary">
            {description}
          </Typography>
        )}
      </Box>
      {action}
    </Box>
  );
}

/** Inner group inside a sub invoice (vendor cost, invoice lines) */
function Panel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <Paper variant="outlined" sx={{ borderRadius: 1.5, overflow: "hidden", minWidth: 0 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          px: 2,
          py: 1,
          minHeight: 48,
          bgcolor: tinted(0.04),
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{title}</Typography>
        {action}
      </Box>
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5, minWidth: 0 }}>{children}</Box>
    </Paper>
  );
}

function EmptyState({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <Box sx={{ py: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 1, color: "text.secondary" }}>
      <Typography variant="body2">{message}</Typography>
      {action}
    </Box>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "error" | "success" }) {
  return (
    <Box sx={{ textAlign: "right" }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.2 }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{ fontWeight: 700, fontVariantNumeric: "tabular-nums", color: tone ? `${tone}.main` : "text.primary" }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function SummaryTile({ label, value, tone }: { label: string; value: string; tone?: "error" | "success" }) {
  return (
    <Box
      sx={(t) => ({
        p: 2,
        borderRadius: 1.5,
        border: "1px solid",
        borderColor: tone ? alpha(t.palette[tone].main, 0.4) : t.palette.divider,
        bgcolor: tone ? alpha(t.palette[tone].main, 0.08) : "background.paper",
      })}
    >
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography
        variant={tone ? "h5" : "h6"}
        sx={{ fontWeight: 700, fontVariantNumeric: "tabular-nums", color: tone ? `${tone}.main` : "text.primary" }}
      >
        {value}
      </Typography>
    </Box>
  );
}

//TODO: replace with API data
const currencyOptions = ["AED", "USD", "GBP", "EUR", "SGD"];
const manifestOptions = ["TTS-SS-26-05-1221","TTS-SS-26-05-1222","TTS-SS-26-05-1223"];
const vesselOptions = ["DYFEN (ex DAI PHU)","joy Cargo","Vessel Rose"];
const proformaOptions = [
  { value: "", label: "Select an option" },
  { value: "none", label: "None" },
];
//TODO: replace with CurrencyRate table values (rate to AED)
const RATES_TO_AED: Record<string, number> = { AED: 1, USD: 3.6725, GBP: 4.9, EUR: 4.3, SGD: 2.75 };

const toNum = (v: string | number) => {
  const n = typeof v === "number" ? v : parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};
const toAed = (amount: number, currency: string) => amount * (RATES_TO_AED[currency] ?? 1);
const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ------------------------------------------------------------------ */
/* Row factories                                                       */
/* ------------------------------------------------------------------ */

const emptyLine = (): InvoiceLineRow => ({
  id: crypto.randomUUID(),
  description: "", additionalDescription: "", currency: "AED", unitPrice: "", qty: "", vat: "",
});

const emptyVendorCost = (): VendorCostRow => ({
  id: crypto.randomUUID(),
  vendorName: "", vendorInvoice: "", purchaseAmount: "", currency: "AED",
  vatPercent: "0", vatAmount: "0", finalAmountAed: "0",
});

const emptySubInvoice = (manifestNo = ""): SubInvoiceRow => ({
  id: crypto.randomUUID(),
  manifestNo, vessels: [], shipmentRef: "", clientRef: "", services: "",
  transportDocRef: "", origin: "", destination: "", eta: "", etd: "",
  jobCompletionDate: "", packages: "", totalWeight: "",
  vendorCosts: [emptyVendorCost()],
  lines: [],
});

const lineColumns: { key: keyof InvoiceLineRow; label: string; width?: number }[] = [
  { key: "description", label: "Description", width: 180 },
  { key: "additionalDescription", label: "Additional Description", width: 200 },
  { key: "currency", label: "Currency", width: 100 },
  { key: "unitPrice", label: "Unit Price", width: 110 },
  { key: "qty", label: "Qty", width: 80 },
  // Total Price + Gross Value are calculated, rendered separately
  { key: "vat", label: "VAT (%)", width: 90 },
];

const numericKeys: (keyof InvoiceLineRow)[] = ["unitPrice", "qty", "vat"];

const lineTotal = (l: InvoiceLineRow) => toNum(l.unitPrice) * toNum(l.qty);
const lineGross = (l: InvoiceLineRow) => lineTotal(l) * (1 + toNum(l.vat) / 100);

const subTotals = (s: SubInvoiceRow) => {
  const price = s.lines.reduce((sum, l) => sum + toAed(lineGross(l), l.currency), 0);
  const cost = s.vendorCosts.reduce((sum, c) => sum + toNum(c.finalAmountAed), 0);
  return { price, cost, profit: price - cost };
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

type MainInvoicePageProps = { mode?: "create" | "edit" | "view" };

export default function ExtraInvoiceCreate({ mode = "create" }: MainInvoicePageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  //* Below 900px (md) tables are replaced with stacked cards
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { preAlert, invoice } = (location.state as ExtraInvoiceLocationState | null) ?? {};
  const invoiceToEdit = mode === "create" ? undefined : invoice;
  const isViewMode = mode === "view";

  const [form, setForm] = useState<MainInvoiceForm>(() => invoiceToEdit?.form ?? ({
    recipient: "",
    invoiceDate: "",
    dueDate: "",
    paymentTerms: "15",
    invoiceCurrency: "AED",
    proformaInvoice: "",
    clientPoNumber: "",
    notes: "",
  }));
  const [status] = useState<InvoiceStatus>(invoiceToEdit?.status ?? "Draft");

  // Demo vendor invoices for reference; replace with data attached to the pre-alert.
  const [vendorInvoices] = useState<VendorInvoiceSummary[]>([
    {
      id: "demo-vendor-1",
      vendorName: "Gulf Logistics",
      invoiceNo: "GL-2026-1042",
      invoiceDate: "2026-10-12",
      dueDate: "2026-10-27",
      purchaseAmount: 2500,
      currency: "AED",
      vat: 5,
      vatAmount: 125,
      totalAmount: 2625,
    },
    {
      id: "demo-vendor-2",
      vendorName: "Ocean Freight Services",
      invoiceNo: "OFS-2026-0876",
      invoiceDate: "2026-10-15",
      dueDate: "2026-11-14",
      purchaseAmount: 1800,
      currency: "USD",
      vat: 0,
      vatAmount: 0,
      totalAmount: 1800,
    },
    {
      id: "demo-vendor-3",
      vendorName: "Al Noor Cargo",
      invoiceNo: "ANC-2026-0318",
      invoiceDate: "2026-10-18",
      dueDate: "2026-11-17",
      purchaseAmount: 3200,
      currency: "AED",
      vat: 5,
      vatAmount: 160,
      totalAmount: 3360,
    },
  ]);

  const [subInvoices, setSubInvoices] = useState<SubInvoiceRow[]>(() =>
    invoiceToEdit?.subInvoices ?? [emptySubInvoice(preAlert?.manifestNumber ?? "")]
  );

  const setField = <K extends keyof MainInvoiceForm>(key: K, value: MainInvoiceForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /* ---------- sub invoice handlers ---------- */
  const updateSub = (id: string, patch: Partial<SubInvoiceRow>) =>
    setSubInvoices((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const handleAddSub = () => setSubInvoices((prev) => [...prev, emptySubInvoice()]);
  const handleRemoveSub = (id: string) => setSubInvoices((prev) => prev.filter((s) => s.id !== id));

  /* ---------- vendor cost handlers ---------- */
  const handleCostChange = (subId: string, costId: string, key: keyof VendorCostRow, value: string) =>
    setSubInvoices((prev) =>
      prev.map((s) => {
        if (s.id !== subId) return s;
        return {
          ...s,
          vendorCosts: s.vendorCosts.map((c) => {
            if (c.id !== costId) return c;
            const next = { ...c, [key]: value };
            // keep calculated columns in sync
            const purchase = toNum(next.purchaseAmount);
            const vatAmt = purchase * (toNum(next.vatPercent) / 100);
            next.vatAmount = String(Number(vatAmt.toFixed(2)));
            next.finalAmountAed = String(Number(toAed(purchase + vatAmt, next.currency).toFixed(2)));
            return next;
          }),
        };
      })
    );

  /* ---------- line handlers ---------- */
  const handleAddLine = (subId: string) =>
    setSubInvoices((prev) => prev.map((s) => (s.id === subId ? { ...s, lines: [...s.lines, emptyLine()] } : s)));

  const handleRemoveLine = (subId: string, lineId: string) =>
    setSubInvoices((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, lines: s.lines.filter((l) => l.id !== lineId) } : s))
    );

  const handleLineChange = (subId: string, lineId: string, key: keyof InvoiceLineRow, value: string) =>
    setSubInvoices((prev) =>
      prev.map((s) =>
        s.id === subId ? { ...s, lines: s.lines.map((l) => (l.id === lineId ? { ...l, [key]: value } : l)) } : s
      )
    );

  /* ---------- totals (AED) ---------- */
  const totals = useMemo(() => {
    const sum = subInvoices.reduce(
      (acc, s) => {
        const t = subTotals(s);
        return { price: acc.price + t.price, cost: acc.cost + t.cost };
      },
      { price: 0, cost: 0 }
    );
    return { ...sum, profit: sum.price - sum.cost };
  }, [subInvoices]);

  const profitTone = totals.profit < 0 ? "error" : "success";

  /* ---------- renderers ---------- */
  const renderLineCell = (sub: SubInvoiceRow, line: InvoiceLineRow, key: keyof InvoiceLineRow, withLabel = false) => {
    const col = lineColumns.find((c) => c.key === key)!;
    if (key === "currency") {
      return (
        <TextField
          select size="small" fullWidth
          label={withLabel ? col.label : undefined}
          value={line.currency}
          onChange={(e) => handleLineChange(sub.id, line.id, key, e.target.value)}
        >
          {currencyOptions.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </TextField>
      );
    }
    return (
      <TextField
        size="small" fullWidth
        label={withLabel ? col.label : undefined}
        value={line[key]}
        sx={numericKeys.includes(key) ? numericSx : undefined}
        onChange={(e) => handleLineChange(sub.id, line.id, key, e.target.value)}
      />
    );
  };

  const renderLineCard = (sub: SubInvoiceRow, line: InvoiceLineRow, index: number) => (
    <Paper key={line.id} variant="outlined" sx={{ p: 1.5, borderRadius: 1.5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Line #{index + 1}</Typography>
        <IconButton color="error" size="small" onClick={() => handleRemoveLine(sub.id, line.id)} aria-label="Remove line">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
        {lineColumns.map((col) => (
          <Box
            key={col.key}
            sx={{
              gridColumn: col.key === "description" || col.key === "additionalDescription" ? "span 2" : "span 1",
              minWidth: 0,
            }}
          >
            {renderLineCell(sub, line, col.key, true)}
          </Box>
        ))}
        <TextField size="small" fullWidth label="Total Price" value={fmt(lineTotal(line))} disabled sx={readOnlyNumericSx} />
        <TextField size="small" fullWidth label="Gross Value" value={fmt(lineGross(line))} disabled sx={readOnlyNumericSx} />
      </Box>
    </Paper>
  );

  const renderVendorCostFields = (sub: SubInvoiceRow, cost: VendorCostRow) => {
    const set = (key: keyof VendorCostRow) => (e: React.ChangeEvent<HTMLInputElement>) =>
      handleCostChange(sub.id, cost.id, key, e.target.value);
    return (
      <Box sx={autoGrid(170)}>
        <TextField size="small" fullWidth label="Vendor Name" value={cost.vendorName} disabled sx={readOnlySx} />
        <TextField size="small" fullWidth label="Vendor Invoice" value={cost.vendorInvoice} disabled sx={readOnlySx} />
        <TextField size="small" fullWidth label="Purchase Amount" value={cost.purchaseAmount} onChange={set("purchaseAmount")} sx={numericSx} />
        <TextField select size="small" fullWidth label="Currency" value={cost.currency} onChange={set("currency")}>
          {currencyOptions.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </TextField>
        <TextField size="small" fullWidth label="VAT (%)" value={cost.vatPercent} onChange={set("vatPercent")} sx={numericSx} />
        <TextField size="small" fullWidth label="VAT Amount" value={cost.vatAmount} disabled sx={readOnlyNumericSx} />
        <TextField size="small" fullWidth label="Final Amount (AED)" value={cost.finalAmountAed} disabled sx={readOnlyNumericSx} />
      </Box>
    );
  };

  //   vendor table space 
  const COLUMNS = [
    { label: "Vendor Name",     width: 250, align: "left"  },
    { label: "Invoice No",      width: 200, align: "left"  },
    { label: "Invoice Date",    width: 150, align: "center"  },
    { label: "Due Date",        width: 150, align: "center"  },
    { label: "Purchase Amount", width: 130, align: "right" },
    { label: "Currency",        width: 80, align: "right"  },
    { label: "VAT",             width: 40, align: "right" },
    { label: "VAT Amount",      width: 90, align: "right" },
    { label: "Total Amount",    width: 100, align: "left" },
  ] as const;

  const TABLE_MIN_WIDTH = COLUMNS.reduce((sum, c) => sum + c.width, 0); // 1230

  // Shared by header + body so spacing is identical
  const cellSx = {
    px: 2,
    py: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  } as const;



  const renderSubInvoice = (sub: SubInvoiceRow, index: number) => {
    const st = subTotals(sub);
    return (
      <Paper
        key={sub.id}
        variant="outlined"
        sx={{
          borderRadius: 1,
          borderTop: "4px solid",
          borderColor: "primary.main",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        {/* Sub invoice header: identity on the left, live figures on the right */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1.5,
            px: { xs: 1.5, sm: 2 },
            py: 1.25,
            bgcolor: tinted(0.05),
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0, flexWrap: "wrap" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Sub Invoice #{index + 1}</Typography>
            {sub.manifestNo && <Chip size="small" variant="outlined" label={sub.manifestNo} />}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 2, sm: 3 } }}>
            <Stat label="Price (AED)" value={fmt(st.price)} />
            <Stat label="Cost (AED)" value={fmt(st.cost)} />
            <Stat label="Profit (AED)" value={fmt(st.profit)} tone={st.profit < 0 ? "error" : "success"} />
            <Tooltip title={subInvoices.length === 1 ? "At least one sub invoice is required" : "Remove sub invoice"}>
              <span>
                <IconButton
                  color="error" size="small"
                  onClick={() => handleRemoveSub(sub.id)}
                  disabled={subInvoices.length === 1}
                  aria-label="Remove sub invoice"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ p: { xs: 1.5, sm: 2 }, display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
          {/* Manifest + vessels */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(2, minmax(0, 1fr))" }, gap: 1, alignItems: "start" }}>
            <Autocomplete
              sx={{ minWidth: 0 }}
              size="small"
              options={manifestOptions}
              value={sub.manifestNo || null}
              onChange={(_, v) => updateSub(sub.id, { manifestNo: v ?? "" })}
              renderInput={(params) => <TextField {...params} fullWidth label="Manifest No" required />}
            />
            <Autocomplete
              sx={{ minWidth: 0, "& .MuiAutocomplete-inputRoot": { flexWrap: "wrap" } }}
              multiple size="small"
              options={vesselOptions}
              value={sub.vessels}
              onChange={(_, v) => updateSub(sub.id, { vessels: v })}
              renderTags={(value, getTagProps) =>
                value.map((option, i) => {
                  const { key, ...tagProps } = getTagProps({ index: i });
                  return <Chip key={key} size="small" label={option} {...tagProps} />;
                })
              }
              renderInput={(params) => <TextField {...params} fullWidth label="Vessels" />}
            />
          </Box>

          {/* Shipment details – fields wrap by available width instead of a fixed 10 columns */}
            <Box sx={autoGrid(180)}>
              <TextField size="small" fullWidth label="Shipment Ref" value={sub.shipmentRef} disabled sx={readOnlySx} />
              <TextField size="small" fullWidth label="Client Ref" value={sub.clientRef} onChange={(e) => updateSub(sub.id, { clientRef: e.target.value })} />
              <TextField size="small" fullWidth label="Services" value={sub.services} disabled sx={readOnlySx} />
              <TextField size="small" fullWidth label="Transport Doc Ref" value={sub.transportDocRef} onChange={(e) => updateSub(sub.id, { transportDocRef: e.target.value })} />
              <TextField size="small" fullWidth label="Origin" value={sub.origin} disabled sx={readOnlySx} />
              <TextField size="small" fullWidth label="Destination" value={sub.destination} disabled sx={readOnlySx} />
              <TextField size="small" fullWidth label="ETA" type="date" value={sub.eta} disabled sx={readOnlySx} slotProps={{ inputLabel: { shrink: true } }} />
              <TextField size="small" fullWidth label="ETD" type="date" value={sub.etd} disabled sx={readOnlySx} slotProps={{ inputLabel: { shrink: true } }} />
              <TextField
                size="small" fullWidth label="Job Completion Date" type="date"
                value={sub.jobCompletionDate}
                onChange={(e) => updateSub(sub.id, { jobCompletionDate: e.target.value })}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField size="small" fullWidth required label="Packages" value={sub.packages} onChange={(e) => updateSub(sub.id, { packages: e.target.value })} sx={numericSx} />
              <TextField size="small" fullWidth required label="Total Weight" value={sub.totalWeight} onChange={(e) => updateSub(sub.id, { totalWeight: e.target.value })} sx={numericSx} />
            </Box>

          {/* Vendor cost */}
          <Panel title="Vendor Cost">
            {sub.vendorCosts.map((cost) => (
              <Box key={cost.id}>{renderVendorCostFields(sub, cost)}</Box>
            ))}
          </Panel>

          {/* Billable lines */}
          <Panel
            title="Invoice Lines"
            action={
              <Button size="small" startIcon={<AddIcon />} variant="contained" disableElevation onClick={() => handleAddLine(sub.id)}>
                Add line
              </Button>
            }
          >
            {isMobile ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {sub.lines.length === 0 ? (
                  <EmptyState message="No invoice lines yet" />
                ) : (
                  sub.lines.map((l, i) => renderLineCard(sub, l, i))
                )}
              </Box>
            ) : (
              <TableContainer sx={{ overflowX: "auto",mx: -2,mt:-2, width: "auto" }}>
                <Table size="small" sx={{ minWidth: 950 }}>
                  <TableHead>
                    <TableRow>
                      {lineColumns.slice(0, 5).map((col) => (
                        <TableCell key={col.key} align={numericKeys.includes(col.key) ? "right" : "left"} sx={headCellSx}>
                          {col.label}
                        </TableCell>
                      ))}
                      <TableCell align="right" sx={headCellSx}>Total Price</TableCell>
                      <TableCell align="right" sx={headCellSx}>VAT (%)</TableCell>
                      <TableCell align="right" sx={headCellSx}>Gross Value</TableCell>
                      <TableCell sx={{ ...headCellSx, position: "sticky", right: 0, zIndex: 1 }} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sub.lines.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} sx={{ borderBottom: 0, py: 1, textAlign: "center" }}>
                          <Typography variant="caption" color="text.secondary">
                            No invoice lines yet
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      sub.lines.map((l) => (
                        <TableRow key={l.id} hover>
                          {lineColumns.slice(0, 5).map((col) => (
                            <TableCell key={col.key} sx={{ minWidth: col.width, px: 1, py: 0.75 }}>
                              {renderLineCell(sub, l, col.key)}
                            </TableCell>
                          ))}
                          <TableCell sx={{ minWidth: 100, px: 1, py: 0.75 }}>
                            <TextField size="small" fullWidth value={fmt(lineTotal(l))} disabled sx={readOnlyNumericSx} />
                          </TableCell>
                          <TableCell sx={{ minWidth: 80, px: 1, py: 0.75 }}>{renderLineCell(sub, l, "vat")}</TableCell>
                          <TableCell sx={{ minWidth: 110, px: 1, py: 0.75 }}>
                            <TextField size="small" fullWidth value={fmt(lineGross(l))} disabled sx={readOnlyNumericSx} />
                          </TableCell>
                          <TableCell sx={{ position: "sticky", right: 0, bgcolor: "background.paper", zIndex: 1, p: 1, textAlign: "center" }}>
                            <IconButton color="error" size="small" onClick={() => handleRemoveLine(sub.id, l.id)} aria-label="Remove line">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Panel>
        </Box>
      </Paper>
    );
  };

  const handleSave = () => {
    if (preAlert?.id) {
      const amount = subInvoices.reduce(
        (sum, sub) => sum + sub.lines.reduce((lineSum, line) => lineSum + toAed(lineTotal(line), line.currency), 0),
        0
      );
      const savedInvoice: SavedMainInvoice = {
        invoiceId: invoiceToEdit?.invoiceId ?? crypto.randomUUID(),
        invoiceNo: invoiceToEdit?.invoiceNo ?? `EX-INV-${Date.now()}`,
        form,
        status,
        subInvoices,
        amount,
        totalCost: totals.cost,
        totalPrice: totals.price,
        totalProfit: totals.profit,
        savedAt: new Date().toISOString(),
      };
      saveExtraInvoice(preAlert.id, savedInvoice);
      navigate(-1);
      return;
    }

    //TODO: POST { ...form, status, subInvoices } to the NestJS endpoint
    console.log({ ...form, status, subInvoices });
  };

  return (
    <Stack sx={{ width: "100%", minWidth: 0 }} spacing={1}>
      {/* Page header */}
      <Box
        sx={{
          display: "flex", flexWrap: "wrap",
          justifyContent: "space-between", alignItems: "center", gap: 1.5,
        }}
      >
        <Box sx={{ display:"flex" ,gap:3}}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {mode === "view"
              ? "View Extra Invoice"
              : mode === "edit"
                ? "Edit Extra Invoice"
                : "Create Extra Invoice"}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 ,color:"primary.main" }}>
            {preAlert?.manifestNumber
              ? `Manifest ${preAlert.manifestNumber}`
              : "Bill the client and track cost against price"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Chip label={status} variant="outlined" sx={{ fontWeight: 600 }} />
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
            Back
          </Button>
          {isViewMode && invoice && (
            <Button
              variant="contained"
              onClick={() => navigate("/invoices/extra-invoice-edit", {
                state: { preAlert, invoice },
              })}
            >
              Edit
            </Button>
          )}
        </Box>
      </Box>

      <Box
        component="fieldset"
        disabled={isViewMode}
        sx={{ m: 0, p: 0, border: 0, minWidth: 0, display: "flex", flexDirection: "column", gap: 0.5 }}
      >
      {/* Extra Invoice Details */}
      <Paper variant="outlined" sx={cardSx}>
        <SectionHeader
          title="Extra Invoice Details"
          icon={<ReceiptLongOutlinedIcon fontSize="small" />}
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) minmax(0, 2fr) minmax(0, 1fr)" },
            gap: 0.5,
          }}
        >
          <TextField
            size="small" fullWidth required multiline minRows={3} maxRows={3}
            label="Recipient"
            value={form.recipient}
            onChange={(e) => setField("recipient", e.target.value)}
          />
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(3, minmax(0, 1fr))" }, gap: 1, alignContent: "start" }}>
            <TextField
              size="small" fullWidth required type="date" label="Invoice Date"
              value={form.invoiceDate}
              onChange={(e) => setField("invoiceDate", e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              select size="small" fullWidth label="Payment Terms"
              value={form.paymentTerms}
              onChange={(e) => setField("paymentTerms", e.target.value)}
              sx={numericSx}
            >
              {["COD", "15", "30", "60", "90"].map((term) => (
                <MenuItem key={term} value={term}>{term}</MenuItem>
              ))}
            </TextField>
            <TextField
              size="small" fullWidth required type="date" label="Due Date"
              value={form.dueDate}
              onChange={(e) => setField("dueDate", e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              select size="small" fullWidth required label="Invoice Currency"
              value={form.invoiceCurrency}
              onChange={(e) => setField("invoiceCurrency", e.target.value)}
            >
              {currencyOptions.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
            <TextField
              select size="small" fullWidth label="Proforma Invoice"
              value={form.proformaInvoice}
              onChange={(e) => setField("proformaInvoice", e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              SelectProps={{ displayEmpty: true }}
            >
              {proformaOptions.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
            </TextField>
            <TextField
              size="small" fullWidth label="Client PO Number"
              value={form.clientPoNumber}
              onChange={(e) => setField("clientPoNumber", e.target.value)}
            />
          </Box>
          <TextField
            size="small" fullWidth multiline minRows={3} maxRows={3} label="Notes"
            value={form.notes}
            onChange={(e) => setField("notes", e.target.value)}
          />
        </Box>
      </Paper>

      {/* Vendor invoices attached (this block had no card or heading before) */}
      {/* <Paper variant="outlined" sx={cardSx}> */}
        {/* <SectionHeader
          title="Vendor Invoices"
          description="Attached to this pre-alert"
          icon={<ReceiptOutlinedIcon fontSize="small" />}
        /> */}

        {isMobile ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {vendorInvoices.length === 0 ? (
              <EmptyState message="No vendor invoices attached" />
            ) : (
              vendorInvoices.map((v) => (
                <Paper key={v.id} variant="outlined" sx={{ p: 1.5, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0.5, borderRadius: 1.5 }}>
                  <Typography variant="body2" sx={{ gridColumn: "span 2", fontWeight: 700 }}>{v.vendorName}</Typography>
                  <Typography variant="caption">Invoice No: {v.invoiceNo}</Typography>
                  <Typography variant="caption">Currency: {v.currency}</Typography>
                  <Typography variant="caption">Invoice Date: {v.invoiceDate}</Typography>
                  <Typography variant="caption">Due Date: {v.dueDate}</Typography>
                  <Typography variant="caption">Purchase: {fmt(v.purchaseAmount)}</Typography>
                  <Typography variant="caption">VAT: {v.vat}% ({fmt(v.vatAmount)})</Typography>
                  <Typography variant="caption" sx={{ gridColumn: "span 2", fontWeight: 700 }}>Total: {fmt(v.totalAmount)}</Typography>
                </Paper>
              ))
            )}
          </Box>
        ) : (
          <TableContainer component={Paper} variant="outlined" sx={{ overflowX: "auto", borderRadius: 1 }}>
            <Table size="small" sx={{ minWidth: TABLE_MIN_WIDTH, tableLayout: "fixed" }}>
              <colgroup>
                {COLUMNS.map((c) => (
                  <col key={c.label} style={{ width: c.width }} />
                ))}
              </colgroup>

              <TableHead>
                <TableRow>
                  {COLUMNS.map((c) => (
                    <TableCell key={c.label} align={c.align} sx={{ ...headCellSx, ...cellSx }}>
                      {c.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {vendorInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={COLUMNS.length} sx={{ borderBottom: 0 }}>
                      <EmptyState message="No vendor invoices attached" />
                    </TableCell>
                  </TableRow>
                ) : (
                  vendorInvoices.map((v) => (
                    <TableRow key={v.id} hover>
                      <TableCell align="left"sx={{ ...cellSx, fontWeight: 600 }} title={v.vendorName}>{v.vendorName}</TableCell>
                      <TableCell align="left"sx={cellSx} title={v.invoiceNo}>{v.invoiceNo}</TableCell>
                      <TableCell align="center"sx={cellSx}>{v.invoiceDate}</TableCell>
                      <TableCell align="center"sx={cellSx}>{v.dueDate}</TableCell>
                      <TableCell align="center" sx={{ ...cellSx, fontVariantNumeric: "tabular-nums" }}>{fmt(v.purchaseAmount)}</TableCell>
                      <TableCell align="center" sx={cellSx}>{v.currency}</TableCell>
                      <TableCell align="center" sx={{ ...cellSx, fontVariantNumeric: "tabular-nums" }}>{v.vat}</TableCell>
                      <TableCell align="center" sx={{ ...cellSx, fontVariantNumeric: "tabular-nums" }}>{fmt(v.vatAmount)}</TableCell>
                      <TableCell align="left" sx={{ ...cellSx, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{fmt(v.totalAmount)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      {/* </Paper> */}

      {/* Sub Invoice Details */}
      <Paper variant="outlined" sx={cardSx}>
        <SectionHeader
          title="Sub Invoice Details"
          // description="One sub invoice per manifest, with its own cost and billable lines"
          icon={<DescriptionOutlinedIcon fontSize="small" />}
          action={
            <Button size="small" startIcon={<AddIcon />} variant="outlined" onClick={handleAddSub}>
              Add Sub Invoice
            </Button>
          }
        />

        {subInvoices.map((s, i) => renderSubInvoice(s, i))}

        {/* Totals */}
      </Paper>
        <Box sx={{ display: "flex", justifyContent: "flex-end",mt:1 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
              gap: 1.5,
              width: { xs: "100%", md: "70%", lg: "55%" },
            }}
          >
            <SummaryTile label="Total Price (AED)" value={fmt(totals.price)} />
            <SummaryTile label="Total Cost (AED)" value={fmt(totals.cost)} />
            <SummaryTile label="Total Profit (AED)" value={fmt(totals.profit)} tone={profitTone} />
          </Box>
        </Box>
      </Box>

      {/* Sticky action bar so Save is always reachable on long invoices */}
      {!isViewMode && <Paper
        elevation={0}
        sx={(t) => ({
          position: "sticky",
          bottom: 8,
          zIndex: t.zIndex.appBar - 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          p: 1.5,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: alpha(t.palette.background.paper, 0.92),
          backdropFilter: "blur(6px)",
          boxShadow: t.shadows[6],
        })}
      >
        <Box sx={{ display: { xs: "none", sm: "block" }, pl: 1 }}>
          <Stat label="Total Profit (AED)" value={fmt(totals.profit)} tone={profitTone} />
        </Box>
        <Box sx={{ display: "flex", gap: { xs: 1, sm: 1.5 }, width: { xs: "100%", sm: "auto" } }}>
          <Button size="small" startIcon={<AddIcon />} variant="outlined" onClick={handleAddSub}>
              Add Sub Invoice
            </Button>
          <Button variant="outlined" color="error" sx={{ flex: { xs: 1, sm: "none" } }} onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button variant="contained" disableElevation sx={{ flex: { xs: 1, sm: "none" }, minWidth: 120 }} onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Paper>}
    </Stack>
  );
}