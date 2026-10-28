import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { Alert, Box, Button, IconButton, Paper, TextField, Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState, type FormEvent } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { PreAlertDetails } from "./types/preAlert.types";

const PRE_ALERT_STORAGE_KEY = "tts-demo-pre-alerts";

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

type EditLocationState = { preAlert?: PreAlertDetails };
type EditableField = { [Key in keyof PreAlertDetails]: PreAlertDetails[Key] extends string ? Key : never }[keyof PreAlertDetails];

const readPreAlerts = (): PreAlertDetails[] => {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(PRE_ALERT_STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? value as PreAlertDetails[] : [];
  } catch {
    return [];
  }
};

export default function PreAlertEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id = "" } = useParams();
  const statePreAlert = (location.state as EditLocationState | null)?.preAlert;
  const [preAlert, setPreAlert] = useState<PreAlertDetails | undefined>(() =>
    statePreAlert ?? readPreAlerts().find((item) => item.id === decodeURIComponent(id)),
  );
  const [saved, setSaved] = useState(false);

  const updateField = (field: EditableField, value: string) => {
    setPreAlert((current) => current ? { ...current, [field]: value } : current);
    setSaved(false);
  };

  const addDocuments = (files: File[]) => {
    setPreAlert((current) => current ? {
      ...current,
      documentNames: [...current.documentNames, ...files.map((file) => file.name)],
    } : current);
    setSaved(false);
  };

  const removeDocument = (removeIndex: number) => {
    setPreAlert((current) => current ? {
      ...current,
      documentNames: current.documentNames.filter((_, index) => index !== removeIndex),
    } : current);
    setSaved(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!preAlert) return;
    const records = readPreAlerts();
    const updatedRecords = records.some((item) => item.id === preAlert.id)
      ? records.map((item) => item.id === preAlert.id ? preAlert : item)
      : [...records, preAlert];
    localStorage.setItem(PRE_ALERT_STORAGE_KEY, JSON.stringify(updatedRecords));
    setSaved(true);
  };

  if (!preAlert) {
    return <Box sx={{ p: 2 }}><Alert severity="warning" sx={{ mb: 2 }}>Pre-Alert details were not found.</Alert><Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>Back</Button></Box>;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", minWidth: 0 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>Edit Pre-Alert</Typography>
          <Typography variant="body2" color="text.secondary">Manifest No: {preAlert.manifestNumber || preAlert.manifestId}</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button color= "error" variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </Box>
      </Box>

      {saved && <Alert severity="success" sx={{ mb: 2 }}>Pre-Alert changes saved.</Alert>}

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) minmax(0, 2fr)" }, gap: 1 }}>
        <Paper elevation={2} sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5, minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, borderBottom: "2px solid", borderColor: "divider", pb: 0.75 }}>Pre-Alert Details</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1 }}>
            <TextField label="Origin" size="small" value={preAlert.origin} onChange={(event) => updateField("origin", event.target.value)} />
            <TextField label="Destination" size="small" value={preAlert.destination} onChange={(event) => updateField("destination", event.target.value)} />
          </Box>
          <TextField label="Consignee Address" size="small" multiline minRows={2} value={preAlert.consigneeAddress} onChange={(event) => updateField("consigneeAddress", event.target.value)} />
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1 }}>
            <TextField label="M AWB Number" size="small" required value={preAlert.masterAwbNumber} onChange={(event) => updateField("masterAwbNumber", event.target.value)} />
            <TextField label="H AWB Number" size="small" value={preAlert.houseAwbNumber} onChange={(event) => updateField("houseAwbNumber", event.target.value)} />
            <TextField label="Airline Name" size="small" required value={preAlert.airlineName} onChange={(event) => updateField("airlineName", event.target.value)} />
            <TextField label="ETD" type="date" size="small" value={preAlert.etd} onChange={(event) => updateField("etd", event.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
            <TextField label="ETA" type="date" size="small" value={preAlert.eta} onChange={(event) => updateField("eta", event.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
            <TextField label="Distance" size="small" value={preAlert.distance} onChange={(event) => updateField("distance", event.target.value)} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 1, p: 1.5, border: "1px solid", borderColor: "divider", borderRadius: 1, minWidth: 0 }}>
            <Button
              component="label"
              variant={preAlert.documentNames.length ? "outlined" : "contained"}
              tabIndex={-1}
              startIcon={preAlert.documentNames.length ? <CheckCircleIcon color="success" /> : <CloudUploadOutlinedIcon />}
              color={preAlert.documentNames.length ? "success" : "primary"}
            >
              {preAlert.documentNames.length ? "Add more Docs" : "Upload Documents"}
              <VisuallyHiddenInput
                type="file"
                multiple
                accept="application/pdf,image/jpeg,image/png,image/webp"
                onChange={(event) => {
                  addDocuments(Array.from(event.target.files ?? []));
                  event.target.value = "";
                }}
              />
            </Button>
            {preAlert.documentNames.length ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {preAlert.documentNames.map((name, index) => (
                  <Tooltip key={`${name}-${index}`} title={name}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, px: 1, py: 0.25, borderRadius: 1, border: "1px solid", borderColor: "success.light", bgcolor: "rgba(46,125,50,0.06)", maxWidth: "100%", minWidth: 0 }}>
                      <InsertDriveFileIcon sx={{ fontSize: 13, color: "success.main", flexShrink: 0 }} />
                      <Typography variant="caption" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "success.main", fontWeight: 500, maxWidth: { xs: 160, sm: 180 } }}>{name}</Typography>
                      <IconButton aria-label={`Remove ${name}`} size="small" onClick={() => removeDocument(index)} sx={{ p: 0.15, ml: 0.25, flexShrink: 0 }}>
                        <Typography variant="caption" sx={{ lineHeight: 1, color: "text.secondary", fontSize: 10 }}>×</Typography>
                      </IconButton>
                    </Box>
                  </Tooltip>
                ))}
              </Box>
            ) : <Typography variant="caption" color="text.secondary">No documents uploaded</Typography>}
          </Box>
          <TextField label="Comments / Remarks" size="small" multiline minRows={2} value={preAlert.remarks} onChange={(event) => updateField("remarks", event.target.value)} />
        </Paper>

        <Paper elevation={2} sx={{ p: 2, minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, borderBottom: "2px solid", borderColor: "divider", pb: 0.75, mb: 1 }}>Manifest / Stock Summary</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 1 }}>
            <TextField label="Client" size="small" value={preAlert.client ?? ""} disabled />
            <TextField label="Vessel" size="small" value={preAlert.vessel ?? ""} disabled />
            <TextField label="Hub" size="small" value={preAlert.hub ?? ""} disabled />
            <TextField label="Mode" size="small" value={preAlert.mode ?? ""} disabled />
            <TextField label="Packages" size="small" value={preAlert.packageCount ?? ""} disabled />
            <TextField label="Total Weight (KGS)" size="small" value={preAlert.totalWeight ?? ""} disabled />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>Manifest and stock values come from the linked manifest.</Typography>
        </Paper>
      </Box>
    </Box>
  );
}
