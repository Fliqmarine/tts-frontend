import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import {
  Alert,
  Box,
  Button,
  IconButton,
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
import { alpha, styled } from "@mui/material/styles";
import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { ManifestStockRow } from "../manifest/types/manifest.types";
import type { PreAlertDetails, PreAlertLocationState, TransitInformation } from "./types/preAlert.types";

const PRE_ALERT_STORAGE_KEY = "tts-demo-pre-alerts";
const TRANSIT_STORAGE_KEY = "tts-demo-pre-alert-transit";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const newTransitRow = (preAlertId: string): TransitInformation => ({
  id: crypto.randomUUID(),
  preAlertId,
  origin: "",
  destination: "",
  flightDetails: "",
  departureDate: "",
  departureTime: "",
  arrivalDate: "",
  etaTime: "",
  actualArrivalDate: "",
  revisedSchedule: "",
  shipmentDelayRemark: "",
});

const readArray = <T,>(key: string): T[] => {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(data) ? data as T[] : [];
  } catch {
    return [];
  }
};

const updateField = <K extends keyof TransitInformation>(
  row: TransitInformation,
  key: K,
  value: TransitInformation[K],
) => ({ ...row, [key]: value });

export default function PreAlertCreatePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { manifest } = (location.state as PreAlertLocationState | null) ?? {};
  const [preAlertId] = useState(() => crypto.randomUUID());
  const [transitRows, setTransitRows] = useState<TransitInformation[]>(() => [newTransitRow(preAlertId)]);
  const [uploadedDocs, setUploadedDocs] = useState<File[]>([]);
  const [saved, setSaved] = useState(false);
  const stocks: ManifestStockRow[] = manifest?.stocks ?? [];

  const addTransitRow = () => setTransitRows((rows) => [...rows, newTransitRow(preAlertId)]);
  const changeTransitField = <K extends keyof TransitInformation>(id: string, key: K, value: TransitInformation[K]) => {
    setTransitRows((rows) => rows.map((row) => row.id === id ? updateField(row, key, value) : row));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const preAlert: PreAlertDetails = {
      id: preAlertId,
      manifestId: manifest?.id ?? "",
      manifestNumber: manifest?.manifestNumber ?? String(manifest?.id ?? ""),
      origin: String(form.get("origin") ?? ""),
      destination: String(form.get("destination") ?? ""),
      consigneeAddress: String(form.get("consigneeAddress") ?? ""),
      masterAwbNumber: String(form.get("masterAwbNumber") ?? ""),
      houseAwbNumber: String(form.get("houseAwbNumber") ?? ""),
      airlineName: String(form.get("airlineName") ?? ""),
      etd: String(form.get("etd") ?? ""),
      eta: String(form.get("eta") ?? ""),
      distance: String(form.get("distance") ?? ""),
      documentNames: uploadedDocs.map((file) => file.name),
      remarks: String(form.get("remarks") ?? ""),
      createdAt: new Date().toISOString(),
      client: manifest?.client,
      vessel: manifest?.vessel,
      hub: manifest?.stationCode,
      mode: manifest?.mode,
      packageCount: stocks.reduce((total, stock) => total + stock.pkgs, 0),
      totalWeight: stocks.reduce((total, stock) => total + stock.weight, 0),
      stocks,
      vesselPo: manifest?.customerPoRef,
      keyAccountManager: manifest?.keyAccountManager,
      consignee: manifest?.consignee,
      status: "Pending",
      stage: 1,
    };

    localStorage.setItem(PRE_ALERT_STORAGE_KEY, JSON.stringify([...readArray<PreAlertDetails>(PRE_ALERT_STORAGE_KEY), preAlert]));
    localStorage.setItem(TRANSIT_STORAGE_KEY, JSON.stringify([...readArray<TransitInformation>(TRANSIT_STORAGE_KEY), ...transitRows]));
    setSaved(true);
  };
  

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", minWidth: 0 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", columnGap: 3, rowGap: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>Create Pre-Alert</Typography>
          <Box  sx={(theme) => ({
            display: "flex",
            gap: 0.75,
            alignItems: "baseline",
            border: "1px solid",
            borderColor: alpha(theme.palette.secondary.main, 0.35),
            borderRadius: 2,
            px: 1.25,
            py: 0.5,
            bgcolor: alpha(theme.palette.secondary.main, 0.08),
            backdropFilter: "blur(6px)",
          })}>
            <Typography variant="body1" color="text.secondary">Manifest No:</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, color: "primary.main" }}>{manifest?.manifestNumber ?? manifest?.id ?? "—"}</Typography>
          </Box>
          <Box sx={(theme) => ({
            display: "flex",
            gap: 0.75,
            alignItems: "baseline",
            border: "1px solid",
            borderColor: alpha(theme.palette.secondary.main, 0.35),
            borderRadius: 2,
            px: 1.25,
            py: 0.5,
            bgcolor: alpha(theme.palette.secondary.main, 0.08),
            backdropFilter: "blur(6px)",
          })}>
            <Typography variant="body1" color="text.secondary">Vessel:</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, color: "primary.main" }}>{manifest?.vessel ?? stocks[0]?.vessel ?? "—"}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" color="error" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" variant="contained">Create Pre-Alert</Button>
        </Box>
      </Box>

      {saved && <Alert severity="success" sx={{ mb: 2 }}>Pre-alert and transit information saved.</Alert>}

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) minmax(0, 2fr)" }, gap: 1 }}>
        <Paper elevation={2} sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5, minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, borderBottom: "2px solid", borderColor: "divider", pb: 0.75 }}>Pre-Alert Details</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1 }}>
            <TextField name="origin" size="small" label="Origin" defaultValue={manifest?.originAirportCode ?? ""} />
            <TextField name="destination" size="small" label="Destination" defaultValue={manifest?.destinationAirportCode ?? ""} />
          </Box>
          <TextField name="consigneeAddress" size="small" label="Consignee Address" multiline minRows={2} defaultValue={manifest?.consigneeAddress ?? ""} />
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1 }}>
            <TextField name="masterAwbNumber" size="small" label="M AWB Number" required />
            <TextField name="houseAwbNumber" size="small" label="H AWB Number" />
            <TextField name="airlineName" size="small" label="Airline Name" required />
            <TextField name="etd" size="small" label="ETD" type="date" required slotProps={{ inputLabel: { shrink: true } }} />
            <TextField name="eta" size="small" label="ETA" type="date" required slotProps={{ inputLabel: { shrink: true } }} />
            <TextField name="distance" size="small" label="Distance" />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 1, p: 1.5, border: "1px solid", borderColor: "divider", borderRadius: 1, minWidth: 0 }}>
            <Button
              component="label"
              role={undefined}
              variant={uploadedDocs.length > 0 ? "outlined" : "contained"}
              tabIndex={-1}
              startIcon={uploadedDocs.length > 0 ? <CheckCircleIcon color="success" /> : <CloudUploadOutlinedIcon />}
              color={uploadedDocs.length > 0 ? "success" : "primary"}
            >
              {uploadedDocs.length > 0 ? "Add more Docs" : "Upload Documents"}
              <VisuallyHiddenInput
                type="file"
                multiple
                accept="application/pdf,image/jpeg,image/png,image/webp"
                onChange={(event) => {
                  const newFiles = Array.from(event.target.files ?? []);
                  setUploadedDocs((current) => [...current, ...newFiles]);
                  event.target.value = "";
                }}
              />
            </Button>
            {uploadedDocs.length > 0 ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {uploadedDocs.map((file, index) => (
                  <Tooltip key={`${file.name}-${index}`} title={file.name}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, px: 1, py: 0.25, borderRadius: 1, border: "1px solid", borderColor: "success.light", bgcolor: "rgba(46,125,50,0.06)", maxWidth: "100%", minWidth: 0 }}>
                      <InsertDriveFileIcon sx={{ fontSize: 13, color: "success.main", flexShrink: 0 }} />
                      <Typography variant="caption" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "success.main", fontWeight: 500, maxWidth: { xs: 160, sm: 180 } }}>{file.name}</Typography>
                      <IconButton aria-label={`Remove ${file.name}`} size="small" onClick={() => setUploadedDocs((current) => current.filter((_, i) => i !== index))} sx={{ p: 0.15, ml: 0.25, flexShrink: 0 }}>
                        <Typography variant="caption" sx={{ lineHeight: 1, color: "text.secondary", fontSize: 10 }}>×</Typography>
                      </IconButton>
                    </Box>
                  </Tooltip>
                ))}
              </Box>
            ) : <Typography variant="caption" color="text.secondary">No documents uploaded</Typography>}
          </Box>
          <TextField name="remarks" size="small" label="Comments / Remarks" multiline minRows={2} />
        </Paper>

        <Paper elevation={2} sx={{ p: 2, minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, borderBottom: "2px solid", borderColor: "divider", pb: 0.75, mb: 1 }}>Stock Details</Typography>
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table size="small" sx={{ minWidth: 760 }}>
                <TableHead>
                    <TableRow>
                        {["Supplier", "PO No", "Description", "Stock ID", "PKGS", "Weight (KGS)", "Value"].map((label) => <TableCell key={label}>{label}</TableCell>)}
                    </TableRow>
                </TableHead>
              <TableBody>
                {stocks.length === 0 ? <TableRow><TableCell colSpan={8} align="center" sx={{ color: "text.secondary", py: 3 }}>No stock details were passed from the manifest.</TableCell></TableRow> : stocks.map((stock) => (
                  <TableRow key={`${stock.stock_id}-${stock.id}`}>
                    <TableCell>{stock.supplier}</TableCell>
                    <TableCell>{stock.po_no}</TableCell>
                    <TableCell>{stock.description}</TableCell>
                    <TableCell>{stock.stock_id}</TableCell>
                    <TableCell>{stock.pkgs}</TableCell>
                    <TableCell>{stock.weight.toLocaleString()}</TableCell>
                    <TableCell>${stock.value.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Paper elevation={2} sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1, minWidth: 0, gridColumn: { xs: "span 1", md: "span 2" } }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, borderBottom: "2px solid", borderColor: "divider", pb: 0.75 }}>Transit Information</Typography>
            <Button size="small" startIcon={<AddIcon />} variant="outlined" onClick={addTransitRow}>Add Transit Information</Button>
          </Box>
          <TableContainer component={Paper} elevation={3} variant="outlined" sx={{ overflowX: "auto" }}>
            <Table
              size="small"
              sx={{
                width: "max-content",   // columns shrink to fit their fields
                minWidth: 0,            // remove the forced 1450 width
                "& .MuiTableCell-root": { px: 0.25, py: 0.5 },  // 2px each side instead of 4px
              }}>
              <TableHead>
                <TableRow>
                  {["Origin", "Destination", "Flight Details", "Depart Date", "Depart Time", "Arrival Date", "ETA Time", "ATA Date", "Revised Schedule", "Shipment Delay Remark", ""].map((label, i) => 
                  <TableCell key={`${label}-${i}`} sx={{ whiteSpace: "nowrap" ,textAlign: "center", }}>
                      {label}
                  </TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {transitRows.length === 0 ? <TableRow><TableCell colSpan={11} align="center" sx={{ color: "text.secondary", py: 3 }}>No transit information. Select “Add Transit Information” to add a row.</TableCell></TableRow> : transitRows.map((row) => (
                  <TableRow key={row.id} sx={{  }}  >
                    <TableCell>
                      <TextField size="small" sx={{ width: 135}} value={row.origin} onChange={(e) => changeTransitField(row.id, "origin", e.target.value)} />
                    </TableCell>
                    <TableCell><TextField size="small" sx={{ width: 134 }} value={row.destination} onChange={(e) => changeTransitField(row.id, "destination", e.target.value)} /></TableCell>
                    <TableCell><TextField size="small" sx={{ width: 134 }} value={row.flightDetails} onChange={(e) => changeTransitField(row.id, "flightDetails", e.target.value)} /></TableCell>
                    <TableCell><TextField size="small" type="date" sx={{ width: 124 }}value={row.departureDate} onChange={(e) => changeTransitField(row.id, "departureDate", e.target.value)} /></TableCell>
                    <TableCell><TextField size="small" type="time" sx={{ width: 120 }}value={row.departureTime} onChange={(e) => changeTransitField(row.id, "departureTime", e.target.value)} /></TableCell>
                    <TableCell><TextField size="small" type="date" sx={{ width: 124 }}value={row.arrivalDate} onChange={(e) => changeTransitField(row.id, "arrivalDate", e.target.value)} /></TableCell>
                    <TableCell><TextField size="small" type="time"sx={{ width: 120 }} value={row.etaTime} onChange={(e) => changeTransitField(row.id, "etaTime", e.target.value)} /></TableCell>
                    <TableCell><TextField size="small" type="date" sx={{ width: 124 }}value={row.actualArrivalDate} onChange={(e) => changeTransitField(row.id, "actualArrivalDate", e.target.value)} /></TableCell>
                    <TableCell><TextField size="small" sx={{ width: 180 }}value={row.revisedSchedule} onChange={(e) => changeTransitField(row.id, "revisedSchedule", e.target.value)} /></TableCell>
                    <TableCell><TextField size="small" sx={{ width: 180 }}value={row.shipmentDelayRemark} onChange={(e) => changeTransitField(row.id, "shipmentDelayRemark", e.target.value)} /></TableCell>
                    <TableCell sx={{ position: "sticky", right: 0, bgcolor: "background.paper", zIndex: 1, p: 1, textAlign: "center" }}>
                      <IconButton aria-label="Remove transit row" color="error" size="small" onClick={() => setTransitRows((rows) => rows.filter((item) => item.id !== row.id))}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
}

