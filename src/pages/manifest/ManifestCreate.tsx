import {
  Box,
  Button,
  Checkbox,
  Chip,
  MenuItem,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import type { ManifestCreatePageProps, ManifestFormValues, ManifestSectionHeaderProps } from "./types/manifest.types";
import type { ManifestStockRow } from "./types/manifest.types";
import { DEMO_MANIFEST_STOCKS } from "./components/ManifestIndexTable";
import { alpha } from "@mui/material/styles";
import { forwardRef, useState, type FormEvent } from "react";
import { useLocation } from "react-router-dom";
import PhoneInput, { getCountries } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import type { Value } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";
import type { TextFieldProps } from "@mui/material";

const TelephoneInputField = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => (
  <TextField size="small" label="Telephone" fullWidth {...props} inputRef={ref} />
));
TelephoneInputField.displayName = "TelephoneInputField";



const SECTION_HEADER_SX = {
    display: "flex",
    alignItems: "center",
    color: "primary",
    borderBottom: "2px solid",
    borderColor: "divider",
    pb: 0.75,
} as const;

function SectionHeader({ title, icon, required = false }:ManifestSectionHeaderProps ) {
    return (
        <Box sx={SECTION_HEADER_SX}>
            {icon && (
                <Box sx={{ display: 'flex', mr: 1, '& svg, & *': { color: 'primary !important' } }}>
                    {icon}
                </Box>
            )}
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {title}
                {required && <Box component="span" sx={{ color: "error.main" }}> *</Box>}
            </Typography>
        </Box>
    );
}

const STATUS_COLOR = {
  Completed: "success",
  "In Progress": "info",
  Pending: "warning",
} as const;

const footerCellSx = {
  position: "sticky",
  bottom: 0,
  Height:10,
  zIndex: 2,
  py: 1.5,
  fontWeight: 700,
  bgcolor: "background.paper",
  borderTop: "3px solid",
  borderColor: "divider",
} as const;

export default function ManifestCreatePage({ initialValues = {}, title = "Create Manifest", onSubmit }: ManifestCreatePageProps) {
  const location = useLocation();
  const navigationState = location.state as {
    stocks?: ManifestStockRow[];
    initialValues?: Partial<ManifestFormValues>;
    manifest?: { stocks: ManifestStockRow[] };
  } | null;
  // Stocks are passed from the stock list when the user chooses Create Manifest.
  const incomingStocks = navigationState?.stocks ?? navigationState?.manifest?.stocks;
  const pageStocks = incomingStocks ?? DEMO_MANIFEST_STOCKS;
  const formInitialValues = { ...navigationState?.initialValues, ...initialValues };
  const [telephone, setTelephone] = useState(formInitialValues.telephone ?? "");
  const [activation, setActivation] = useState(formInitialValues.activation ?? "");
  const [deadline, setDeadline] = useState(formInitialValues.deadline ?? "");
  const [selectedStockIds, setSelectedStockIds] = useState<string[]>(() =>
    incomingStocks?.map((stock, index) => `${stock.stock_id}-${index}`) ?? []
  );
  const [stockSelectionError, setStockSelectionError] = useState("");
  
  const rowIds = pageStocks.map((stock, index) => `${stock.stock_id}-${index}`);
  const allSelected = rowIds.length > 0 && selectedStockIds.length === rowIds.length;
  const someSelected = selectedStockIds.length > 0 && !allSelected;

  const toggleStock = (rowId: string) =>
  {
    setStockSelectionError("");
    setSelectedStockIds((current) =>
      current.includes(rowId) ? current.filter((x) => x !== rowId) : [...current, rowId]
    );
  };
  const toggleAll = () => {
    setStockSelectionError("");
    setSelectedStockIds(allSelected ? [] : rowIds);
  };

 const selectedStocks = pageStocks.filter((s, index) => selectedStockIds.includes(`${s.stock_id}-${index}`));
 const totals = selectedStocks.reduce(
    (sum, s) => ({
      pkgs: sum.pkgs + s.pkgs,
      weight: sum.weight + s.weight,
      cbm: sum.cbm + (s.cbm ?? 0),
      value: sum.value + s.value,
    }),
    { pkgs: 0, weight: 0, cbm: 0, value: 0 }
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedStocks.length === 0) {
      setStockSelectionError("Select at least one stock row before creating the manifest.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const values: ManifestFormValues = {
      manifestNumber: String(formData.get("manifestNumber") ?? formInitialValues.manifestNumber ?? ""),
      client: String(formData.get("client") ?? ""),
      vessel: String(formData.get("vessel") ?? ""),
      stationCode: String(formData.get("stationCode") ?? ""),
      mode: String(formData.get("mode") ?? ""),
      activation: String(formData.get("activation") ?? ""),
      deadline: String(formData.get("deadline") ?? ""),
      originAirportCode: String(formData.get("originAirportCode") ?? ""),
      customerPoRef: String(formData.get("customerPoRef") ?? ""),
      stockOrigin: formData.get("stockOrigin") === "on",
      consignee: String(formData.get("consignee") ?? ""),
      country: String(formData.get("country") ?? ""),
      destinationAirportCode: String(formData.get("destinationAirportCode") ?? ""),
      email: String(formData.get("email") ?? ""),
      telephone,
      consigneeAddress: String(formData.get("consigneeAddress") ?? ""),
      notifyParty: String(formData.get("notifyParty") ?? ""),
    };

    onSubmit?.({ ...values, stocks: selectedStocks });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box sx={{ display:"flex",justifyContent:"space-between"}}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
         {title}
        </Typography>
        <Box>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Box>

      </Box>
      
      
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) minmax(0, 1fr)" },
          gap: { xs: 1  , md: 1 },
          width: "100%",
        }}
      >
      {/* Column 1: Manifest details */}
      <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2 }, display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
        <Box sx={{ mb: 1 }}>
            <SectionHeader
                title="Manifest Details"
            />
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 1 }}>
          {/* Row 1: Client and Vessel */}
          <TextField name="client" size="small" label="Client" defaultValue={formInitialValues.client ?? ""} fullWidth required />
          <TextField name="vessel" size="small" label="Vessel" defaultValue={formInitialValues.vessel ?? ""} fullWidth required />
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" }, gap: 1 }}>
          {/* Row 2: Station, Mode, and Origin Airport */}
          <TextField name="stationCode" size="small" label="Station Code" defaultValue={formInitialValues.stationCode ?? ""} fullWidth required />
          <TextField name="mode" size="small" label="Mode" defaultValue={formInitialValues.mode ?? ""} fullWidth required />
          <TextField name="originAirportCode" size="small" label="Airport Code (Origin)" defaultValue={formInitialValues.originAirportCode ?? ""} fullWidth required />
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", xl: "repeat(3  , minmax(0, 1fr))" }, gap: 1, alignItems: "center" }}>
          {/* Row 3: Dates, customer PO reference, and stock origin */}
          <TextField name="activation" size="small" label="Activation" type="date" value={activation} onChange={(event) => setActivation(event.target.value)} fullWidth required InputLabelProps={{ shrink: true }} sx={{ "& input[type='date']::-webkit-datetime-edit": { color: activation ? "inherit" : "transparent" } }} />
          <TextField name="deadline" size="small" label="Deadline" type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} fullWidth required InputLabelProps={{ shrink: true }} sx={{ "& input[type='date']::-webkit-datetime-edit": { color: deadline ? "inherit" : "transparent" } }} />
          <TextField name="customerPoRef" size="small" label="Customer PO Ref" defaultValue={formInitialValues.customerPoRef ?? ""} fullWidth />
        </Box>
         <Box sx={{ display: "flex", alignItems: "center", gap: 1, alignSelf: "flex-start" }}>
           <Typography variant="body2">Stock Origin</Typography>
           <Switch name="stockOrigin" defaultChecked={formInitialValues.stockOrigin ?? false} />
         </Box>
      </Paper>

      {/* Column 2: Consignee details */}
      <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2 }, display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
        <Box sx={{ mb: 1 }}>
            <SectionHeader
                title="Consignee Details"
            />
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" }, gap: 0.5 }}>
          <TextField name="consignee" size="small" label="Consignee" defaultValue={formInitialValues.consignee ?? ""} required />
          <TextField name="country" select size="small" label="Country" defaultValue={formInitialValues.country ?? ""} required>
            {getCountries().map((countryCode) => (
              <MenuItem key={countryCode} value={countryCode}>
                {(en as Record<string, string>)[countryCode] ?? countryCode}
              </MenuItem>
            ))}
          </TextField>
          <TextField name="destinationAirportCode" size="small" label="Airport Code (Destination)" defaultValue={formInitialValues.destinationAirportCode ?? ""} required />
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 0.5 }}>
          <TextField name="email" size="small" label="Email" type="email" defaultValue={formInitialValues.email ?? ""} />
          <Box sx={{ minWidth: 0, "& .PhoneInputCountry": { mr: 1 } }}>
            <PhoneInput
              international
              value={telephone as Value}
              onChange={(value) => setTelephone(value || "")}
              inputComponent={TelephoneInputField}
              style={{ display: "flex", width: "100%" }}
            />
          </Box>
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 0.5 }}>
          <TextField name="consigneeAddress" size="small" label="Consignee Address" defaultValue={formInitialValues.consigneeAddress ?? ""} fullWidth multiline minRows={3.5} />
          <TextField name="notifyParty" size="small" label="Notify Party" defaultValue={formInitialValues.notifyParty ?? ""} fullWidth multiline minRows={3.5} />
        </Box>
        
      </Paper>

      {/* Column 3: Stock rows, spanning both columns */}
      {/* Stock rows, spanning both columns */}
      <Paper
        variant="outlined"
        sx={{ minWidth: 0, gridColumn: { xs: "span 1", md: "span 2" }, overflow: "hidden" }}
      >
        {stockSelectionError && (
          <Typography role="alert" color="error" variant="body2" sx={{ px: 1.5, pt: 1 }}>
            {stockSelectionError}
          </Typography>
        )}
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table size="small" stickyHeader sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    size="small"
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={toggleAll}
                    inputProps={{ "aria-label": "Select all stocks" }}
                  />
                </TableCell>
                <TableCell>Vessel</TableCell>
                <TableCell>Stock ID</TableCell>
                <TableCell>Station</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>PO No</TableCell>
                <TableCell align="right">PKGS</TableCell>
                <TableCell align="right">Weight (KGS)</TableCell>
                <TableCell align="right">CBM</TableCell>
                <TableCell align="right">Value</TableCell>
                <TableCell>Stock Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {pageStocks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={12} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    No stock available
                  </TableCell>
                </TableRow>
              )}

              {pageStocks.map((stock, index) => {
                const rowId = `${stock.stock_id}-${index}`;
                const isSelected = selectedStockIds.includes(rowId);
                const color = STATUS_COLOR[stock.stock_status as keyof typeof STATUS_COLOR] ?? "warning";

                return (
                  <TableRow
                    key={rowId}
                    hover
                    selected={isSelected}
                    onClick={() => toggleStock(rowId)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        size="small"
                        checked={isSelected}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => toggleStock(rowId)}
                        inputProps={{ "aria-label": `Select stock ${stock.stock_id}` }}
                      />
                    </TableCell>
                    <TableCell>{stock.vessel}</TableCell>
                    <TableCell>{stock.stock_id}</TableCell>
                    <TableCell>{stock.station}</TableCell>
                    <TableCell>{new Date(`${stock.arrival_date}T00:00:00`).toLocaleDateString()}</TableCell>
                    <TableCell>{stock.supplier}</TableCell>
                    <TableCell>{stock.po_no}</TableCell>
                    <TableCell align="right">{stock.pkgs}</TableCell>
                    <TableCell align="right">{stock.weight.toLocaleString()}</TableCell>
                    <TableCell align="right">{(stock.cbm ?? 0).toFixed(2)}</TableCell>
                    <TableCell align="right">${stock.value.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={stock.stock_status}
                        color={color}
                        variant="outlined"
                        sx={(theme) => ({
                          height: 20,
                          fontSize: "0.65rem",
                          fontWeight: 600,
                          bgcolor: alpha(theme.palette[color].main, 0.08),
                        })}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TableCell colSpan={7} sx={footerCellSx}>
                  Selected totals ({selectedStockIds.length})
                </TableCell>
                <TableCell align="right" sx={footerCellSx}>{totals.pkgs.toLocaleString()}</TableCell>
                <TableCell align="right" sx={footerCellSx}>{totals.weight.toLocaleString()}</TableCell>
                <TableCell align="right" sx={footerCellSx}>{totals.cbm.toFixed(2)}</TableCell>
                <TableCell align="right" sx={footerCellSx}>${totals.value.toLocaleString()}</TableCell>
                <TableCell sx={footerCellSx} />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
      </Box>
    </Box>
  );
}
