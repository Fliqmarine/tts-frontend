import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMemo } from "react";
import type { Manifest } from "../types/manifest.types";
import { DEMO_MANIFESTS } from "./ManifestIndexTable";

const STATUSES = [
  "OPS PENDING", "PO PENDING", "DISPUTE", "PENDING APPROVAL FROM MANAGEMENT",
  "INVOICE PENDING", "POD PENDING", "LINKED TO ONGOING JOB", "LINKED TO INVOICE PENDING",
  "LINKED TO POD PENDING", "ACCOUNTS PENDING", "INVOICE RECEIVED", "IN STOCK", "OTHERS",
];

const BORDER = "1px solid #000";
const HEAD_BG = "#dbe9f6";

const cellSx = { border: BORDER, color: "#000", fontSize: "0.75rem", py: 0.25, px: 0.75, lineHeight: 1.6 };
const numSx = { ...cellSx, textAlign: "center", width: 60 };

const getStatus = (m: Manifest) => {
  const x = m as unknown as Record<string, unknown>;
  const raw = String(x.InternalStatus ?? x.internalStatus ?? "").trim().toUpperCase();
  return STATUSES.includes(raw) ? raw : "OTHERS";
};

const getManager = (m: Manifest) => {
  const x = m as unknown as Record<string, unknown>;
  return String(x.keyAccountManager ?? x.pic ?? "").trim().toUpperCase() || "N/A";
};

type Props = {
  open: boolean;
  onClose: () => void;
  fromDate?: string;
  toDate?: string;
};

export default function InternalStatusReportDialog({ open, onClose, fromDate, toDate }: Props) {
  const report = useMemo(() => {
    if (!open) return null;
    const manifests: Manifest[] = DEMO_MANIFESTS.filter((m) => {
      if (!fromDate && !toDate) return true;
      return m.stocks.some((s) => (!fromDate || s.arrival_date >= fromDate) && (!toDate || s.arrival_date <= toDate));
    });

    const managers = [...new Set(manifests.map(getManager))].sort();
    const counts: Record<string, Record<string, number>> = {};
    STATUSES.forEach((s) => (counts[s] = Object.fromEntries(managers.map((k) => [k, 0]))));
    manifests.forEach((m) => { counts[getStatus(m)][getManager(m)] += 1; });

    const rowTotal = (s: string) => managers.reduce((t, k) => t + counts[s][k], 0);
    const colTotal = (k: string) => STATUSES.reduce((t, s) => t + counts[s][k], 0);
    return { managers, counts, rowTotal, colTotal, grand: manifests.length };
  }, [open, fromDate, toDate]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontSize: "0.9rem", fontWeight: 700, pr: 6 }}>
        Internal Status Report
        <IconButton aria-label="Close" onClick={onClose} size="small" sx={{ position: "absolute", right: 12, top: 12 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, mb: 2 }}>
          Report Period: {fromDate || "All"} - {toDate || "All"}
        </Typography>

        {report && (
          <TableContainer>
            <Table size="small" sx={{ borderCollapse: "collapse" }}>
              <TableHead>
                <TableRow sx={{ bgcolor: HEAD_BG }}>
                  <TableCell sx={{ ...cellSx, textAlign: "center", fontWeight: 700 }}>Internal Status</TableCell>
                  {report.managers.map((k) => (
                    <TableCell key={k} sx={{ ...numSx, fontWeight: 700 }}>{k}</TableCell>
                  ))}
                  <TableCell sx={{ ...numSx, width: 100, fontWeight: 700 }}>Grand Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {STATUSES.map((s) => (
                  <TableRow key={s}>
                    <TableCell sx={cellSx}>{s}</TableCell>
                    {report.managers.map((k) => (
                      <TableCell key={k} sx={numSx}>{report.counts[s][k]}</TableCell>
                    ))}
                    <TableCell sx={{ ...numSx, width: 100, fontWeight: 700 }}>{report.rowTotal(s)}</TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ bgcolor: HEAD_BG }}>
                  <TableCell sx={{ ...cellSx, fontWeight: 700 }}>Grand Total</TableCell>
                  {report.managers.map((k) => (
                    <TableCell key={k} sx={{ ...numSx, fontWeight: 700 }}>{report.colTotal(k)}</TableCell>
                  ))}
                  <TableCell sx={{ ...numSx, width: 100, fontWeight: 700 }}>{report.grand}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, justifyContent: "flex-start" }}>
        <Button onClick={onClose} variant="outlined" color="inherit" size="small" sx={{ textTransform: "none" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
