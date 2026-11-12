import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import {
  Alert,
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {alpha, type SxProps, type Theme } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  createEmptyProformaLine,
  PROFORMA_CLIENTS,
  PROFORMA_CURRENCIES,
  PROFORMA_INVOICE_STORAGE_KEY,
  PROFORMA_PAYMENT_TERMS,
  PROFORMA_VESSELS,
  ProformaInvoiceSchema,
  type ProformaInvoice,
  type ProformaInvoiceLine,
} from "./types/proformaInvoice.types";


type Props = {
  lines: ProformaInvoiceLine[];
  onChange: (lines: ProformaInvoiceLine[]) => void;
};

const fieldSx: SxProps<Theme> = {
  minWidth: 0,
  "& .MuiOutlinedInput-root": { borderRadius: 1, backgroundColor: "background.paper" },
};

const itemFieldSx: SxProps<Theme> = {
  ...fieldSx,
  width: "100%",
};

const itemNumberFieldSx: SxProps<Theme> = {
  ...itemFieldSx,
  "& input": { textAlign: "right", fontVariantNumeric: "tabular-nums" },
  "& input[type=number]": { MozAppearance: "textfield" },
  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
    margin: 0,
  },
};

const sectionSx: SxProps<Theme> = {
  p: { xs: 1.5, sm: 2 },
  display: "flex",
  flexDirection: "column",
  gap: 0.5,
  minWidth: 0,
};

const sectionHeaderSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  borderBottom: "2px solid",
  borderColor: "divider",
  pb: 0.75,
  mb: 0.5,
};

const numericValue = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const lineTotal = (line: ProformaInvoiceLine) =>
  numericValue(line.unitPrice) * numericValue(line.quantity);

const lineGross = (line: ProformaInvoiceLine) =>
  lineTotal(line) * (1 + numericValue(line.vat) / 100);

const formatAmount = (value: number, currency: string) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency || "AED",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

type CurrencyTotals = { subtotal: number; vat: number; gross: number };

export function ProformaInvoiceItemsCard({ lines, onChange }: Props) {
  const totalsByCurrency = useMemo(
    () =>
      lines.reduce<Record<string, CurrencyTotals>>((totals, line) => {
        const current = totals[line.currency] ?? { subtotal: 0, vat: 0, gross: 0 };
        const net = lineTotal(line);
        const gross = lineGross(line);
        totals[line.currency] = {
          subtotal: current.subtotal + net,
          vat: current.vat + (gross - net),
          gross: current.gross + gross,
        };
        return totals;
      }, {}),
    [lines],
  );

  const updateLine = (id: string, key: keyof ProformaInvoiceLine, value: string) =>
    onChange(lines.map((line) => (line.id === id ? { ...line, [key]: value } : line)));

  const removeLine = (id: string) => onChange(lines.filter((line) => line.id !== id));
  const addLine = () => onChange([...lines, createEmptyProformaLine()]);

  return (
    <Paper elevation={3} sx={sectionSx}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 0.5,
          pb: 0.75,
          borderBottom: "2px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ReceiptLongOutlinedIcon color="primary" />
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Invoice Items
          </Typography>
        </Box>
        <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={addLine}>
          Add item
        </Button>
      </Box>

      <TableContainer>
        <Table
          size="small"
          sx={{
            minWidth: 1218,
            tableLayout: "fixed",
            "& .MuiTableCell-root": { px: 0.2, py: 1 },
          }}
        >
          <colgroup>
            <col style={{ width: 320 }} /> {/* Description */}
            <col style={{ width: 320 }} /> {/* Additional Description */}
            <col style={{ width: 100 }} /> {/* Currency */}
            <col style={{ width: 100 }} /> {/* Unit Price */}
            <col style={{ width: 80 }} />  {/* Qty */}
            <col style={{ width: 110 }} /> {/* Total Price */}
            <col style={{ width: 80 }} />  {/* VAT */}
            <col style={{ width: 110 }} /> {/* Gross Value */}
            <col style={{ width: 48 }} />  {/* Remove */}
          </colgroup>
          <TableHead>
            <TableRow>
              {[
                "Description",
                "Additional Description",
                "Currency",
                "Unit Price",
                "Qty",
                "Total Price",
                "VAT (%)",
                "Gross Value",
                "",
              ].map((label, index) => (
                <TableCell
                  key={`${label}-${index}`}
                  align={[3, 4, 6].includes(index) ? "center" : index > 2 && index < 8 ? "right" : "left"}
                  sx={{ fontWeight: 600, whiteSpace: "nowrap", bgcolor: "action.hover" }}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {lines.map((line) => (
              <TableRow key={line.id}>
                <TableCell>
                  <TextField
                    size="small"
                    value={line.description}
                    onChange={(event) => updateLine(line.id, "description", event.target.value)}
                    placeholder="Description"
                    sx={itemFieldSx}
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    size="small"
                    value={line.additionalDescription}
                    onChange={(event) =>
                      updateLine(line.id, "additionalDescription", event.target.value)
                    }
                    placeholder="Additional description"
                    sx={itemFieldSx}
                  />
                </TableCell>

                <TableCell align="center">
                  <TextField
                    select
                    size="small"
                    value={line.currency}
                    onChange={(event) => updateLine(line.id, "currency", event.target.value)}
                    sx={{
                      ...itemFieldSx,
                      "& .MuiSelect-select": { textAlign: "center" },
                    }}
                  >
                    {line.currency && !PROFORMA_CURRENCIES.includes(line.currency) && (
                      <MenuItem value={line.currency}>{line.currency}</MenuItem>
                    )}
                    {PROFORMA_CURRENCIES.map((currency) => (
                      <MenuItem key={currency} value={currency}>
                        {currency}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>

                {(["unitPrice", "quantity"] as const).map((field) => (
                  <TableCell key={field}>
                    <TextField
                      size="small"
                      type="number"
                      value={line[field]}
                      onChange={(event) => updateLine(line.id, field, event.target.value)}
                      slotProps={{
                        htmlInput: { min: field === "quantity" ? 0 : undefined, step: "any" },
                      }}
                      sx={itemNumberFieldSx}
                    />
                  </TableCell>
                ))}

                <TableCell
                  align="right"
                  sx={{ whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}
                >
                  {formatAmount(lineTotal(line), line.currency)}
                </TableCell>

                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={line.vat}
                    onChange={(event) => updateLine(line.id, "vat", event.target.value)}
                    slotProps={{ htmlInput: { min: 0, step: "any" } }}
                    sx={itemNumberFieldSx}
                  />
                </TableCell>

                <TableCell
                  align="right"
                  sx={{ whiteSpace: "nowrap", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}
                >
                  {formatAmount(lineGross(line), line.currency)}
                </TableCell>

                <TableCell>
                  <Tooltip
                    title={lines.length === 1 ? "At least one item is required" : "Remove item"}
                  >
                    <span>
                      <IconButton
                        size="small"
                        color="error"
                        aria-label="Remove item"
                        disabled={lines.length === 1}
                        onClick={() => removeLine(line.id)}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Totals (per currency) */}
      <Box
        sx={{
            display: "flex",
            justifyContent: "flex-end",
            flexWrap: "wrap",
            gap: 4,
            pt: 1.5,
            mt: 0.5,
            borderTop: "5px solid",
            borderColor: "divider",
          }}
      >
        {Object.entries(totalsByCurrency).map(([currency, totals]) => (
          <Box 
            key={currency} 
            sx={{
              minWidth: 240,
              flex: { xs: "1 1 100%", sm: "0 1 auto" },
              border: "2px solid",
              borderColor: "success.main",
              p: 1,
              borderRadius: 2,
              backgroundColor: (theme) => alpha(theme.palette.success.main, 0.25),
            }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Subtotal ({currency})
              </Typography>
              <Typography variant="body2" sx={{ fontVariantNumeric: "tabular-nums" }}>
                {formatAmount(totals.subtotal, currency)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 3, mt: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                VAT
              </Typography>
              <Typography variant="body2" sx={{ fontVariantNumeric: "tabular-nums" }}>
                {formatAmount(totals.vat, currency)}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Total ({currency})
              </Typography>
              <Typography
                variant="subtitle1"
                color="primary"
                sx={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}
              >
                {formatAmount(totals.gross, currency)}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

type EditLocationState = {
  invoice?: ProformaInvoice;
};

type LoadResult = {
  invoice: ProformaInvoice | null;
  error: string;
};

const loadProformaInvoice = (
  invoiceId: string | undefined,
  locationInvoice: ProformaInvoice | undefined,
): LoadResult => {
  if (!invoiceId) {
    return { invoice: null, error: "Proforma invoice was not found." };
  }

  try {
    if (locationInvoice?.id === invoiceId) {
      const stateResult = ProformaInvoiceSchema.safeParse(locationInvoice);
      if (stateResult.success) return { invoice: stateResult.data, error: "" };
    }

    const stored: unknown = JSON.parse(
      window.localStorage.getItem(PROFORMA_INVOICE_STORAGE_KEY) ?? "[]",
    );
    if (!Array.isArray(stored)) {
      throw new Error("Saved proforma invoice data has an invalid format.");
    }

    const invoice = stored
      .map((item) => ProformaInvoiceSchema.parse(item))
      .find((item) => item.id === invoiceId);
    return invoice
      ? { invoice, error: "" }
      : { invoice: null, error: "Proforma invoice was not found." };
  } catch (error) {
    console.error("Could not load proforma invoice.", error);
    return {
      invoice: null,
      error: error instanceof Error ? error.message : "Could not load proforma invoice.",
    };
  }
};

export default function ProformaInvoiceEditPage() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const locationInvoice = (location.state as EditLocationState | null)?.invoice;
  const loadResult = useMemo(
    () => loadProformaInvoice(invoiceId, locationInvoice),
    [invoiceId, locationInvoice],
  );
  const [invoice, setInvoice] = useState<ProformaInvoice | null>(loadResult.invoice);
  const [error, setError] = useState(loadResult.error);

  useEffect(() => {
    setInvoice(loadResult.invoice);
    setError(loadResult.error);
  }, [loadResult]);

  const updateField = (field: keyof ProformaInvoice, value: string) => {
    setInvoice((current) => (current ? { ...current, [field]: value } : current));
  };

  const handleSave = () => {
    if (!invoice) return;
    setError("");

    if (!invoice.client || !invoice.clientAddress.trim() || !invoice.invoiceDate) {
      setError("Select a client, enter the client address, and choose an invoice date.");
      return;
    }

    try {
      const stored: unknown = JSON.parse(
        window.localStorage.getItem(PROFORMA_INVOICE_STORAGE_KEY) ?? "[]",
      );
      if (!Array.isArray(stored)) {
        throw new Error("Saved proforma invoice data has an invalid format.");
      }

      const existingInvoices: ProformaInvoice[] = stored.map((item) =>
        ProformaInvoiceSchema.parse(item),
      );
      const updatedInvoice = ProformaInvoiceSchema.parse(invoice);
      const invoiceIndex = existingInvoices.findIndex((item) => item.id === updatedInvoice.id);
      if (invoiceIndex === -1) {
        existingInvoices.push(updatedInvoice);
      } else {
        existingInvoices[invoiceIndex] = updatedInvoice;
      }

      window.localStorage.setItem(
        PROFORMA_INVOICE_STORAGE_KEY,
        JSON.stringify(existingInvoices),
      );
      navigate("/finance/proforma-invoices");
    } catch (saveError) {
      console.error("Could not update proforma invoice.", saveError);
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not update proforma invoice.",
      );
    }
  };

  if (!invoice) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/finance/proforma-invoices")}
          sx={{ alignSelf: "flex-start" }}
        >
          Back to Proforma Invoices
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "100%", minWidth: 0 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          flexWrap: "wrap",
          mb: 1,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Edit Proforma Invoice
        </Typography>
        <Box sx={{ display: "flex", gap: 1, width: { xs: "100%", sm: "auto" } }}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => navigate("/finance/proforma-invoices")}
            sx={{ flex: { xs: 1, sm: "none" } }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ flex: { xs: 1, sm: "none" } }}
          >
            Save Changes
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 1.7fr) minmax(280px, 1fr)" },
          gap: 1,
          alignItems: "stretch",
        }}
      >
        <Paper elevation={3} sx={sectionSx}>
          <Box sx={sectionHeaderSx}>
            <DescriptionOutlinedIcon color="primary" />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Client & Invoice Details
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(3, minmax(0, 1fr))" },
              gap: 1,
            }}
          >
            <TextField
              select
              required
              size="small"
              label="Client"
              value={invoice.client}
              onChange={(event) => updateField("client", event.target.value)}
              sx={fieldSx}
            >
              {invoice.client && !PROFORMA_CLIENTS.some((client) => client.name === invoice.client) && (
                <MenuItem value={invoice.client}>{invoice.client}</MenuItem>
              )}
              {PROFORMA_CLIENTS.map((client) => (
                <MenuItem key={client.name} value={client.name}>
                  {client.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              size="small"
              label="Client PO number"
              value={invoice.clientPoNumber}
              onChange={(event) => updateField("clientPoNumber", event.target.value)}
              sx={fieldSx}
            />
            <TextField
              select
              size="small"
              label="Vessel name"
              value={invoice.vesselName}
              onChange={(event) => updateField("vesselName", event.target.value)}
              sx={fieldSx}
            >
              {invoice.vesselName && !PROFORMA_VESSELS.includes(invoice.vesselName) && (
                <MenuItem value={invoice.vesselName}>{invoice.vesselName}</MenuItem>
              )}
              {PROFORMA_VESSELS.map((vessel) => (
                <MenuItem key={vessel} value={vessel}>
                  {vessel}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              size="small"
              label="Manifest no."
              value={invoice.manifestNumber}
              onChange={(event) => updateField("manifestNumber", event.target.value)}
              sx={fieldSx}
            />
            <TextField
              required
              type="date"
              size="small"
              label="Invoice date"
              value={invoice.invoiceDate}
              onChange={(event) => updateField("invoiceDate", event.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={fieldSx}
            />
            <TextField
              select
              size="small"
              label="Payment terms"
              value={invoice.paymentTerms}
              onChange={(event) => updateField("paymentTerms", event.target.value)}
              sx={fieldSx}
            >
              {PROFORMA_PAYMENT_TERMS.map((term) => (
                <MenuItem key={term} value={term}>
                  {term === "COD" ? term : `${term} days`}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              size="small"
              label="Currency"
              value={invoice.currency}
              onChange={(event) => updateField("currency", event.target.value)}
              sx={fieldSx}
            >
              {invoice.currency && !PROFORMA_CURRENCIES.includes(invoice.currency) && (
                <MenuItem value={invoice.currency}>{invoice.currency}</MenuItem>
              )}
              {PROFORMA_CURRENCIES.map((currency) => (
                <MenuItem key={currency} value={currency}>
                  {currency}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              multiline
              minRows={2}
              size="small"
              label="Notes"
              value={invoice.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              sx={{ ...fieldSx, gridColumn: { sm: "span 2" } }}
            />
          </Box>
        </Paper>

        <Paper elevation={3} sx={sectionSx}>
          <Box sx={sectionHeaderSx}>
            <DescriptionOutlinedIcon color="primary" />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Client Address
            </Typography>
          </Box>
          <TextField
            required
            multiline
            minRows={6}
            fullWidth
            size="small"
            label="Client address"
            value={invoice.clientAddress}
            onChange={(event) => updateField("clientAddress", event.target.value)}
            sx={{ ...fieldSx, flex: 1 }}
          />
        </Paper>
      </Box>

      <ProformaInvoiceItemsCard
        lines={invoice.lines}
        onChange={(lines) => setInvoice((current) => (current ? { ...current, lines } : current))}
      />
    </Box>
  );
}