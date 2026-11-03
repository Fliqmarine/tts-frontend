import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import MergeTypeIcon from "@mui/icons-material/MergeType";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useState } from "react";
import { PreAlertDetailsSchema } from "../../jobs/types/preAlert.types";

const STAGE3_STORAGE_KEY = "tts-demo-pre-alert-stage-3";
const STAGE4_STORAGE_KEY = "tts-demo-pre-alert-stage-4";

type ManifestOption = {
  id: string;
  manifestNumber: string;
};

const readManifestOptions = (storageKey: string, expectedStage: 3 | 4): ManifestOption[] => {
  const stored = localStorage.getItem(storageKey);
  if (!stored) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(stored);
  } catch (error) {
    console.error(`Could not read Stage ${expectedStage} manifests.`, error);
    return [];
  }

  if (!Array.isArray(parsed)) {
    console.error(`Stage ${expectedStage} manifests have an invalid storage format.`);
    return [];
  }

  const options: ManifestOption[] = [];
  parsed.forEach((value: unknown) => {
    const result = PreAlertDetailsSchema.safeParse(value);
    if (result.success && (result.data.stage ?? expectedStage) === expectedStage) {
      options.push({ id: result.data.id, manifestNumber: result.data.manifestNumber });
    } else if (!result.success) {
      console.error(`A Stage ${expectedStage} manifest has an invalid record.`, result.error);
    }
  });

  return options;
};

export default function SaleInvoiceIndexHeader() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [stage3ManifestId, setStage3ManifestId] = useState("");
  const [stage4ManifestId, setStage4ManifestId] = useState("");
  const [stage3Options, setStage3Options] = useState<ManifestOption[]>([]);
  const [stage4Options, setStage4Options] = useState<ManifestOption[]>([]);

  const openDialog = () => {
    setStage3Options(readManifestOptions(STAGE3_STORAGE_KEY, 3));
    setStage4Options(readManifestOptions(STAGE4_STORAGE_KEY, 4));
    setStage3ManifestId("");
    setStage4ManifestId("");
    setDialogOpen(true);
  };

  const closeDialog = () => setDialogOpen(false);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.2 }}>
          Sale Invoice
        </Typography>
        <Button
          variant="contained"
          color="primary"
          endIcon={<ArrowForwardIcon />}
          onClick={openDialog}
        >
          Club Stage 3 To Stage 4
        </Button>
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3, overflow: "hidden" } } }}
        aria-labelledby="club-stage-dialog-title"
        aria-describedby="club-stage-dialog-description"
        sx={{ mb:30 }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 2, pr: 1.5 }}>
          <Box
            sx={(theme) => ({
              width: 40,
              height: 40,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              color: "primary.main",
              bgcolor: alpha(theme.palette.primary.main, 0.12),
              flexShrink: 0,
            })}
          >
            <MergeTypeIcon />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography id="club-stage-dialog-title" variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              Club Stage 3 To Stage 4
            </Typography>
            
          </Box>
          <IconButton aria-label="Close dialog" onClick={closeDialog} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ bgcolor: "background.default", py: 3 }}>
          <Stack spacing={1}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: 1,
                borderColor: stage3ManifestId ? "primary.main" : "divider",
                bgcolor: "background.paper",
                transition: "border-color 0.2s",
              }}
            >
              <Chip label="Stage 3" size="small" color="primary" variant="outlined" sx={{ mb: 1.5, fontWeight: 600 }} />
              <TextField
                select
                required
                fullWidth
                size="small"
                label="Stage 3 Manifest"
                value={stage3ManifestId}
                onChange={(event) => setStage3ManifestId(event.target.value)}
                disabled={stage3Options.length === 0}
                error={stage3Options.length === 0}
                helperText={stage3Options.length === 0 ? "No Stage 3 manifests available" : " "}
                slotProps={{ formHelperText: { sx: { mb: -1.5 } } }}
              >
                {stage3Options.map((option) => (
                  <MenuItem key={option.id} value={option.id}>{option.manifestNumber}</MenuItem>
                ))}
              </TextField>
            </Box>

            

            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: 1,
                borderColor: stage4ManifestId ? "success.main" : "divider",
                bgcolor: "background.paper",
                transition: "border-color 0.2s",
              }}
            >
              <Chip label="Stage 4" size="small" color="success" variant="outlined" sx={{ mb: 1.5, fontWeight: 600 }} />
              <TextField
                select
                required
                fullWidth
                size="small"
                label="Stage 4 Manifest"
                value={stage4ManifestId}
                onChange={(event) => setStage4ManifestId(event.target.value)}
                disabled={stage4Options.length === 0}
                error={stage4Options.length === 0}
                helperText={stage4Options.length === 0 ? "No Stage 4 manifests available" : " "}
                slotProps={{ formHelperText: { sx: { mb: -1.5 } } }}
              >
                {stage4Options.map((option) => (
                  <MenuItem key={option.id} value={option.id}>{option.manifestNumber}</MenuItem>
                ))}
              </TextField>
            </Box>

            {(stage3Options.length === 0 || stage4Options.length === 0) && (
              <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                Both stages need an available manifest before you can submit.
              </Alert>
            )}
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button variant="outlined" color="error" onClick={closeDialog}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disableElevation
            disabled={!stage3ManifestId || !stage4ManifestId}
            onClick={closeDialog}
            endIcon={<ArrowForwardIcon />}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
