import AddIcon from "@mui/icons-material/Add";
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
import { alpha, type SxProps, type Theme } from "@mui/material/styles"; 
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createEmptyProformaLine,
  PROFORMA_CLIENTS,
  PROFORMA_CURRENCIES,
  PROFORMA_INVOICE_STORAGE_KEY,
  PROFORMA_PAYMENT_TERMS,
  PROFORMA_VESSELS,
  ProformaInvoiceSchema,
  type ProformaInvoice,
  type ProformaInvoiceForm as ProformaInvoiceFields,
  type ProformaInvoiceLine,
} from "./types/proformaInvoice.types";

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
  // hide the spinners so they don't eat into the narrow inputs
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

const initialForm: ProformaInvoiceFields = {
  client: "",
  clientAddress: "",
  clientPoNumber: "",
  vesselName: "",
  manifestNumber: "",
  invoiceDate: new Date().toISOString().slice(0, 10),
  paymentTerms: "COD",
  currency: "AED",
  notes: "",
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

export default function ProformaInvoiceCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<ProformaInvoiceFields>(initialForm);
  const [lines, setLines] = useState<ProformaInvoiceLine[]>(
    () => [createEmptyProformaLine()],
  );
  const [error, setError] = useState("");

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

  const updateForm = <K extends keyof ProformaInvoiceFields>(
    key: K,
    value: ProformaInvoiceFields[K],
  ) => setForm((current) => ({ ...current, [key]: value }));

  const updateLine = (id: string, key: keyof ProformaInvoiceLine, value: string) => {
    setLines((current) =>
      current.map((line) => (line.id === id ? { ...line, [key]: value } : line)),
    );
  };

  const handleSave = () => {
    setError("");
    if (!form.client || !form.clientAddress.trim() || !form.invoiceDate) {
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
      const record = ProformaInvoiceSchema.parse({
        ...form,
        id: crypto.randomUUID(),
        lines,
        createdAt: new Date().toISOString(),
      });
      window.localStorage.setItem(
        PROFORMA_INVOICE_STORAGE_KEY,
        JSON.stringify([...existingInvoices, record]),
      );
      navigate("/finance/proforma-invoices", {
        state: { createdProformaInvoice: true },
      });
    } catch (saveError) {
      console.error("Could not save proforma invoice.", saveError);
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not save proforma invoice.",
      );
    }
  };

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
          Proforma Invoice Create
        </Typography>
        <Box sx={{ display: "flex", gap: 1, width: { xs: "100%", sm: "auto" } }}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => navigate(-1)}
            sx={{ flex: { xs: 1, sm: "none" } }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ flex: { xs: 1, sm: "none" } }}
          >
            Save
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
              value={form.client}
              onChange={(event) => updateForm("client", event.target.value)}
              sx={fieldSx}
            >
              {form.client && !PROFORMA_CLIENTS.some((clientOption) => clientOption.name === form.client) && (
                <MenuItem value={form.client}>{form.client}</MenuItem>
              )}
              {PROFORMA_CLIENTS.map((clientOption) => (
                <MenuItem key={clientOption.name} value={clientOption.name}>
                  {clientOption.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              size="small"
              label="Client PO number"
              value={form.clientPoNumber}
              onChange={(event) => updateForm("clientPoNumber", event.target.value)}
              sx={fieldSx}
            />
            <TextField
              select
              size="small"
              label="Vessel name"
              value={form.vesselName}
              onChange={(event) => updateForm("vesselName", event.target.value)}
              sx={fieldSx}
            >
              {form.vesselName && !PROFORMA_VESSELS.includes(form.vesselName) && (
                <MenuItem value={form.vesselName}>{form.vesselName}</MenuItem>
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
              value={form.manifestNumber}
              onChange={(event) => updateForm("manifestNumber", event.target.value)}
              sx={fieldSx}
            />
            <TextField
              required
              type="date"
              size="small"
              label="Invoice date"
              value={form.invoiceDate}
              onChange={(event) => updateForm("invoiceDate", event.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={fieldSx}
            />
            <TextField
              select
              size="small"
              label="Payment terms"
              value={form.paymentTerms}
              onChange={(event) => updateForm("paymentTerms", event.target.value)}
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
              value={form.currency}
              onChange={(event) => updateForm("currency", event.target.value)}
              sx={fieldSx}
            >
              {form.currency && !PROFORMA_CURRENCIES.includes(form.currency) && (
                <MenuItem value={form.currency}>{form.currency}</MenuItem>
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
              value={form.notes}
              onChange={(event) => updateForm("notes", event.target.value)}
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
            value={form.clientAddress}
            onChange={(event) => updateForm("clientAddress", event.target.value)}
            sx={{ ...fieldSx, flex: 1 }}
          />
        </Paper>
      </Box>

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
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setLines((current) => [...current, createEmptyProformaLine()])}
          >
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
                      onChange={(event) => updateLine(line.id, "additionalDescription", event.target.value)}
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
                          onClick={() =>
                            setLines((current) => current.filter((item) => item.id !== line.id))
                          }
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
              }}
            >
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
    </Box>
  );
}