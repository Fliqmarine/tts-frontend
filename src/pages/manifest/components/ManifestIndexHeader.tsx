import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import InternalStatusReportDialog from "./InternalStatusReportDialog";

export default function ManifestHeader() {
  const [reportOpen, setReportOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleInternalReport = async () => {
    setDownloading(true);
    try {
      const { exportInternalReport } = await import("../utils/exportInternalReport");
      await exportInternalReport();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.2 }}>
          Manifest List
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" color="success" startIcon={<FileDownloadOutlinedIcon />}
            onClick={handleInternalReport} disabled={downloading}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 10 }}>
            {downloading ? "Preparing..." : "Internal Report"}
          </Button>
          <Button variant="contained" color="primary" startIcon={<AssessmentOutlinedIcon />}
            onClick={() => setReportOpen(true)}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: 10 }}>
            Internal Status Report
          </Button>
        </Box>
      </Box>

      <InternalStatusReportDialog open={reportOpen} onClose={() => setReportOpen(false)} />
    </>
  );
}