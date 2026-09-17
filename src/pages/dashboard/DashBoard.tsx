import { Paper, Typography } from "@mui/material";

function DashboardPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4">
        Dashboard
      </Typography>

      <Typography sx={{ mt: 2 }}>
        Welcome to TTS Portal.
      </Typography>
    </Paper>
  );
}

export default DashboardPage;