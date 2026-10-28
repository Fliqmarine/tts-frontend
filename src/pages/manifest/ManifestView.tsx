import { Box, Button, Chip, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TextField, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import type { ManifestSectionHeaderProps } from "./types/manifest.types";
import { DEMO_MANIFESTS } from "./components/ManifestIndexTable";

type StockManifestFallback = {
  id: number;
  stock_id: string;
  existing_manifest: string;
  client: string;
  vessel: string;
  station: string;
  arrival_date: string;
  supplier: string;
  po_no: string;
  pkgs: number;
  weight: number;
  cbm: number;
  value: number;
  stock_status: string;
  docs: Array<{ name: string; url: string }>;
};

function SectionHeader({ title }: ManifestSectionHeaderProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", color: "primary.main", borderBottom: "2px solid", borderColor: "divider", pb: 0.75 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{title}</Typography>
    </Box>
  );
}

function ReadOnlyField({ label, value, type = "text", multiline = false }: { label: string; value: unknown; type?: string; multiline?: boolean }) {
  return <TextField size="small" label={label} type={type} value={String(value ?? "")} fullWidth multiline={multiline} minRows={multiline ? 3.5 : undefined} InputLabelProps={type === "date" ? { shrink: true } : undefined} InputProps={{ readOnly: true }} />;
}

export default function ManifestViewPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const savedManifest = DEMO_MANIFESTS.find((item) => String(item.id) === id || item.manifestNumber === id);
  const stock = (location.state as { stock?: StockManifestFallback } | null)?.stock;
  const manifest = savedManifest ?? (stock ? {
    id: stock.existing_manifest,
    manifestNumber: stock.existing_manifest,
    status: stock.stock_status,
    client: stock.client,
    vessel: stock.vessel,
    stationCode: stock.station,
    mode: "",
    activation: stock.arrival_date,
    deadline: "",
    originAirportCode: "",
    customerPoRef: stock.po_no,
    stockOrigin: false,
    consignee: "",
    country: "",
    destinationAirportCode: "",
    email: "",
    telephone: "",
    consigneeAddress: "",
    notifyParty: "",
    stocks: [{
      id: stock.id,
      vessel: stock.vessel,
      stock_id: stock.stock_id,
      station: stock.station,
      arrival_date: stock.arrival_date,
      supplier: stock.supplier,
      po_no: stock.po_no,
      pkgs: stock.pkgs,
      weight: stock.weight,
      cbm: stock.cbm,
      value: stock.value,
      stock_status: stock.stock_status,
      docs: stock.docs,
    }],
  } : undefined);

  if (!manifest) return <Navigate to="/manifest/manifest-index" replace />;

  const extra = manifest as unknown as Record<string, unknown>;
  const totals = manifest.stocks.reduce((sum, stock) => ({
    pkgs: sum.pkgs + stock.pkgs,
    weight: sum.weight + stock.weight,
    cbm: sum.cbm + (stock.cbm ?? 0),
    value: sum.value + stock.value,
  }), { pkgs: 0, weight: 0, cbm: 0, value: 0 });

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Manifest Details</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/manifest/manifest-index")}>Back to list</Button>
          {savedManifest && <Button variant="contained" startIcon={<EditIcon />} onClick={() => navigate(`/manifest/manifest-edit/${manifest.id}`, { state: { manifest } })}>Edit</Button>}
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) minmax(0, 1fr)" }, gap: 1, width: "100%" }}>
        <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2 }, display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
          <Box sx={{ mb: 1 }}><SectionHeader title="Manifest Details" /></Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 1 }}>
            <ReadOnlyField label="Manifest No" value={manifest.manifestNumber ?? manifest.id} />
            <ReadOnlyField label="Status" value={extra.status} />
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 1 }}>
            <ReadOnlyField label="Client" value={manifest.client} />
            <ReadOnlyField label="Vessel" value={manifest.vessel} />
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" }, gap: 1 }}>
            <ReadOnlyField label="Station Code" value={manifest.stationCode} />
            <ReadOnlyField label="Mode" value={manifest.mode} />
            <ReadOnlyField label="Airport Code (Origin)" value={manifest.originAirportCode} />
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", xl: "repeat(3, minmax(0, 1fr))" }, gap: 1, alignItems: "center" }}>
            <ReadOnlyField label="Activation" value={manifest.activation} type="date" />
            <ReadOnlyField label="Deadline" value={manifest.deadline} type="date" />
            <ReadOnlyField label="Customer PO Ref" value={manifest.customerPoRef} />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, alignSelf: "flex-start" }}>
            <Typography variant="body2">Stock Origin</Typography>
            <Switch checked={manifest.stockOrigin} disabled size="small" />
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2 }, display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
          <Box sx={{ mb: 1 }}><SectionHeader title="Consignee Details" /></Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" }, gap: 0.5 }}>
            <ReadOnlyField label="Consignee" value={manifest.consignee} />
            <ReadOnlyField label="Country" value={manifest.country} />
            <ReadOnlyField label="Airport Code (Destination)" value={manifest.destinationAirportCode} />
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 0.5 }}>
            <ReadOnlyField label="Email" value={manifest.email} />
            <ReadOnlyField label="Telephone" value={manifest.telephone} />
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 0.5 }}>
            <ReadOnlyField label="Consignee Address" value={manifest.consigneeAddress} multiline />
            <ReadOnlyField label="Notify Party" value={manifest.notifyParty} multiline />
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 0.5 }}>
            <ReadOnlyField label="Key Account Manager" value={extra.keyAccountManager} />
            <ReadOnlyField label="Internal Status" value={extra.InternalStatus} />
          </Box>
        </Paper>

        <Paper variant="outlined" sx={{ minWidth: 0, gridColumn: { xs: "span 1", md: "span 2" }, overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table size="small" stickyHeader sx={{ minWidth: 1000 }}>
              <TableHead><TableRow>
                {["Vessel", "Stock ID", "Station", "Date", "Supplier", "PO No", "PKGS", "Weight (KGS)", "CBM", "Value", "Stock Status", "Documents"].map((label) => <TableCell key={label} align={["PKGS", "Weight (KGS)", "CBM", "Value"].includes(label) ? "right" : "left"}>{label}</TableCell>)}
              </TableRow></TableHead>
              <TableBody>
                {manifest.stocks.map((stock) => {
                  const color = stock.stock_status === "Completed" ? "success" : stock.stock_status === "In Progress" ? "info" : "warning";
                  return <TableRow key={stock.id} hover>
                    <TableCell>{stock.vessel}</TableCell><TableCell>{stock.stock_id}</TableCell><TableCell>{stock.station}</TableCell>
                    <TableCell>{stock.arrival_date ? new Date(`${stock.arrival_date}T00:00:00`).toLocaleDateString() : "—"}</TableCell>
                    <TableCell>{stock.supplier}</TableCell><TableCell>{stock.po_no}</TableCell><TableCell align="right">{stock.pkgs.toLocaleString()}</TableCell>
                    <TableCell align="right">{stock.weight.toLocaleString()}</TableCell><TableCell align="right">{(stock.cbm ?? 0).toFixed(2)}</TableCell>
                    <TableCell align="right">${stock.value.toLocaleString()}</TableCell>
                    <TableCell><Chip size="small" label={stock.stock_status} color={color} variant="outlined" sx={(theme) => ({ height: 20, fontSize: "0.65rem", fontWeight: 600, bgcolor: alpha(theme.palette[color].main, 0.08) })} /></TableCell>
                    <TableCell>{(stock.docs ?? []).map((doc) => <Box key={`${stock.id}-${doc.name}`} component="a" href={doc.url} target="_blank" rel="noreferrer" sx={{ display: "block" }}>{doc.name}</Box>)}</TableCell>
                  </TableRow>;
                })}
                {manifest.stocks.length === 0 && <TableRow><TableCell colSpan={12} align="center" sx={{ py: 4, color: "text.secondary" }}>No stock available</TableCell></TableRow>}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={6} sx={{ position: "sticky", bottom: 0, zIndex: 2, py: 1.5, fontWeight: 700, bgcolor: "background.paper", borderTop: "3px solid", borderColor: "divider" }}>Total ({manifest.stocks.length})</TableCell>
                  <TableCell align="right" sx={{ position: "sticky", bottom: 0, zIndex: 2, py: 1.5, fontWeight: 700, bgcolor: "background.paper", borderTop: "3px solid", borderColor: "divider" }}>{totals.pkgs.toLocaleString()}</TableCell>
                  <TableCell align="right" sx={{ position: "sticky", bottom: 0, zIndex: 2, py: 1.5, fontWeight: 700, bgcolor: "background.paper", borderTop: "3px solid", borderColor: "divider" }}>{totals.weight.toLocaleString()}</TableCell>
                  <TableCell align="right" sx={{ position: "sticky", bottom: 0, zIndex: 2, py: 1.5, fontWeight: 700, bgcolor: "background.paper", borderTop: "3px solid", borderColor: "divider" }}>{totals.cbm.toFixed(2)}</TableCell>
                  <TableCell align="right" sx={{ position: "sticky", bottom: 0, zIndex: 2, py: 1.5, fontWeight: 700, bgcolor: "background.paper", borderTop: "3px solid", borderColor: "divider" }}>${totals.value.toLocaleString()}</TableCell>
                  <TableCell colSpan={2} sx={{ position: "sticky", bottom: 0, zIndex: 2, py: 1.5, fontWeight: 700, bgcolor: "background.paper", borderTop: "3px solid", borderColor: "divider" }} />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
}
