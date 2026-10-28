import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Alert, Box, Button, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { PreAlertDetails, TransitInformation } from "./types/preAlert.types";

const PRE_ALERT_STORAGE_KEY = "tts-demo-pre-alerts";
const TRANSIT_STORAGE_KEY = "tts-demo-pre-alert-transit";

type ViewLocationState = { preAlert?: PreAlertDetails };

const readArray = <T,>(key: string): T[] => {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(parsed) ? parsed as T[] : [];
  } catch {
    return [];
  }
};

const formatDate = (date: string) => {
  if (!date) return "";
  const value = new Date(`${date.slice(0, 10)}T00:00:00`);
  return Number.isNaN(value.getTime()) ? date : value.toLocaleDateString();
};

function ReadOnlyField({ label, value, type = "text", multiline = false }: { label: string; value?: string | number; type?: string; multiline?: boolean }) {
  return <TextField label={label} value={value ?? ""} type={type} size="small" fullWidth disabled multiline={multiline} minRows={multiline ? 2 : undefined} slotProps={type === "date" ? { inputLabel: { shrink: true } } : undefined} />;
}

export default function PreAlertViewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id = "" } = useParams();
  const statePreAlert = (location.state as ViewLocationState | null)?.preAlert;
  const preAlert = statePreAlert ?? readArray<PreAlertDetails>(PRE_ALERT_STORAGE_KEY).find((row) => row.id === decodeURIComponent(id));
  const transitRows = preAlert ? readArray<TransitInformation>(TRANSIT_STORAGE_KEY).filter((row) => row.preAlertId === preAlert.id) : [];

  if (!preAlert) {
    return <Box sx={{ p: 2 }}><Alert severity="warning" sx={{ mb: 2 }}>Pre-Alert details were not found.</Alert><Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>Back</Button></Box>;
  }

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", columnGap: 3, rowGap: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>Pre-Alert Details</Typography>
          <Chip label={`Manifest No: ${preAlert.manifestNumber || preAlert.manifestId}`} variant="outlined" color="secondary" />
          {preAlert.vessel && <Chip label={`Vessel: ${preAlert.vessel}`} variant="outlined" color="secondary" />}
        </Box>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>Back</Button>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) minmax(0, 2fr)" }, gap: 1 }}>
        <Paper elevation={2} sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5, minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, borderBottom: "2px solid", borderColor: "divider", pb: 0.75 }}>Pre-Alert Information</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1 }}>
            <ReadOnlyField label="Origin" value={preAlert.origin} />
            <ReadOnlyField label="Destination" value={preAlert.destination} />
          </Box>
          <ReadOnlyField label="Consignee Address" value={preAlert.consigneeAddress} multiline />
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1 }}>
            <ReadOnlyField label="M AWB Number" value={preAlert.masterAwbNumber} />
            <ReadOnlyField label="H AWB Number" value={preAlert.houseAwbNumber} />
            <ReadOnlyField label="Airline Name" value={preAlert.airlineName} />
            <ReadOnlyField label="ETD" value={preAlert.etd} type="date" />
            <ReadOnlyField label="ETA" value={preAlert.eta} type="date" />
            <ReadOnlyField label="Distance" value={preAlert.distance} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 1.5, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Pre-Alert Documents</Typography>
            {preAlert.documentNames.length ? <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>{preAlert.documentNames.map((name, index) => <Chip key={`${name}-${index}`} size="small" label={name} variant="outlined" />)}</Box> : <Typography variant="caption" color="text.secondary">No documents uploaded</Typography>}
          </Box>
          <ReadOnlyField label="Comments / Remarks" value={preAlert.remarks} multiline />
        </Paper>

        <Paper elevation={2} sx={{ p: 2, minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, borderBottom: "2px solid", borderColor: "divider", pb: 0.75, mb: 1 }}>Manifest / Stock Summary</Typography>
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table size="small" sx={{ minWidth: 500 }}>
              <TableHead><TableRow>{["Client", "Vessel", "Hub", "Mode", "Packages", "Weight (KGS)"].map((label) => <TableCell key={label}>{label}</TableCell>)}</TableRow></TableHead>
              <TableBody><TableRow>
                <TableCell>{preAlert.client || "—"}</TableCell>
                <TableCell>{preAlert.vessel || "—"}</TableCell>
                <TableCell>{preAlert.hub || "—"}</TableCell>
                <TableCell>{preAlert.mode || "—"}</TableCell>
                <TableCell>{preAlert.packageCount ?? "—"}</TableCell>
                <TableCell>{preAlert.totalWeight?.toLocaleString() ?? "—"}</TableCell>
              </TableRow></TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Paper elevation={2} sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1, minWidth: 0, gridColumn: { xs: "span 1", md: "span 2" } }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, borderBottom: "2px solid", borderColor: "divider", pb: 0.75 }}>Transit Information</Typography>
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table size="small" sx={{ minWidth: 900 }}>
              <TableHead><TableRow>{["Origin", "Destination", "Flight Details", "Depart Date", "Depart Time", "Arrival Date", "ETA Time", "ATA Date", "Revised Schedule", "Shipment Delay Remark"].map((label) => <TableCell key={label}>{label}</TableCell>)}</TableRow></TableHead>
              <TableBody>{transitRows.length ? transitRows.map((row) => <TableRow key={row.id}>
                <TableCell>{row.origin || "—"}</TableCell><TableCell>{row.destination || "—"}</TableCell><TableCell>{row.flightDetails || "—"}</TableCell>
                <TableCell>{formatDate(row.departureDate) || "—"}</TableCell><TableCell>{row.departureTime || "—"}</TableCell>
                <TableCell>{formatDate(row.arrivalDate) || "—"}</TableCell><TableCell>{row.etaTime || "—"}</TableCell>
                <TableCell>{formatDate(row.actualArrivalDate) || "—"}</TableCell><TableCell>{row.revisedSchedule || "—"}</TableCell><TableCell>{row.shipmentDelayRemark || "—"}</TableCell>
              </TableRow>) : <TableRow><TableCell colSpan={10} align="center" sx={{ py: 3, color: "text.secondary" }}>No transit information was saved for this Pre-Alert.</TableCell></TableRow>}</TableBody>
            </Table>
          </TableContainer>
          <Typography variant="caption" color="text.secondary">Created {formatDate(preAlert.createdAt)}</Typography>
        </Paper>
      </Box>
    </Box>
  );
}
