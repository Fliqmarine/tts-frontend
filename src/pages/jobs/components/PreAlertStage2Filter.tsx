import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Collapse, IconButton, InputAdornment, MenuItem, TextField, Tooltip, Typography } from "@mui/material";
import { useState } from "react";

export type PreAlertStage2Filters = {
  search: string;
  client: string;
  vessel: string;
  hub: string;
  status: string;
  vesselPo: string;
  keyAccountManager: string;
  consignee: string;
  destinationPort: string;
  stage: string;
  manifestNo: string;
  awbNumber: string;
  fromDate: string;
  toDate: string;
};

export type PreAlertStage2SelectFilterKey =
  | "client"
  | "vessel"
  | "hub"
  | "status"
  | "vesselPo"
  | "keyAccountManager"
  | "consignee"
  | "destinationPort"
  | "stage";

type Props = {
  filters: PreAlertStage2Filters;
  onChange: (filters: PreAlertStage2Filters) => void;
  /** Dropdowns that are always visible. All other dropdowns go under "Show more". */
  primaryFields?: PreAlertStage2SelectFilterKey[];
  options?: Partial<Record<PreAlertStage2SelectFilterKey, string[]>>;
};

// ---------- 1. ALL DROPDOWNS (key + label) ----------
const selectFields: { key: PreAlertStage2SelectFilterKey; label: string }[] = [
  { key: "client", label: "Client" },
  { key: "vessel", label: "Vessel" },
  { key: "hub", label: "Hub" },
  { key: "status", label: "Status" },
  { key: "vesselPo", label: "Vessel PO" },
  { key: "keyAccountManager", label: "Key Account Manager" },
  { key: "consignee", label: "Consignee" },
  { key: "destinationPort", label: "Port of Destination" },
  { key: "stage", label: "Stage" },
];

// ---------- 2. DROPDOWNS ALWAYS VISIBLE (change this list to show more/less) ----------
const defaultPrimaryFields: PreAlertStage2SelectFilterKey[] = [
  "client",
  "vessel",
  "hub",
  "status",
  "vesselPo",
  "keyAccountManager",
];

// ---------- 3. EXTRA INPUTS (always under "Show more") ----------
const extraInputs: { key: keyof PreAlertStage2Filters; label: string; type?: "date" }[] = [
  { key: "manifestNo", label: "Manifest No" },
  { key: "awbNumber", label: "AWB Number" },
  { key: "fromDate", label: "From Date", type: "date" },
  { key: "toDate", label: "To Date", type: "date" },
];

// ---------- Default dropdown values (used when no `options` prop is passed) ----------
const defaultOptions: Record<PreAlertStage2SelectFilterKey, string[]> = {
  client: ["Client 1", "Client 2", "Client 3"],
  vessel: ["Vessel 1", "Vessel 2", "Vessel 3"],
  hub: ["Hub 1", "Hub 2", "Hub 3"],
  status: ["Pending", "In Progress", "Completed", "On Hold"],
  vesselPo: ["PO 1", "PO 2", "PO 3"],
  keyAccountManager: ["Manager 1", "Manager 2", "Manager 3"],
  consignee: ["Consignee 1", "Consignee 2", "Consignee 3"],
  destinationPort: ["Port 1", "Port 2", "Port 3"],
  stage: ["Stage 1", "Stage 2", "Stage 3", "Stage 4"],
};

const fieldSx = {
  "& .MuiOutlinedInput-root": { borderRadius: 2, backgroundColor: "background.paper" },
};

export default function PreAlertStage2Filter({
  filters,
  onChange,
  options,
  primaryFields = defaultPrimaryFields,
}: Props) {
  const [showMore, setShowMore] = useState(false);

  // Split dropdowns into "main" and "extra"
  const mainSelects = selectFields.filter((f) => primaryFields.includes(f.key));
  const extraSelects = selectFields.filter((f) => !primaryFields.includes(f.key));

  const handleChange = (field: keyof PreAlertStage2Filters, value: string) => {
    onChange({ ...filters, [field]: value });
  };

  const renderSelect = ({ key, label }: { key: PreAlertStage2SelectFilterKey; label: string }) => (
    <TextField
      key={key}
      select
      label={label}
      size="small"
      value={filters[key]}
      onChange={(e) => handleChange(key, e.target.value)}
      sx={{ ...fieldSx, minWidth: 140, flex: 1 }}
    >
      <MenuItem value="">All</MenuItem>
      {(options?.[key] ?? defaultOptions[key]).map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );

  return (
    <Box sx={{ py: 2, backgroundColor: "background.default" }}>
      {/* ---------- MAIN ROW: always visible ---------- */}
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FilterListIcon sx={{ color: "text.secondary", fontSize: 20 }} />
          <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
            Filters
          </Typography>
        </Box>

        <TextField
          placeholder="Search..."
          size="small"
          value={filters.search}
          onChange={(e) => handleChange("search", e.target.value)}
          sx={{ ...fieldSx, minWidth: 200, flex: 1.5 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 20, color: "text.disabled" }} />
                </InputAdornment>
              ),
            },
          }}
        />

        {mainSelects.map(renderSelect)}

        <Tooltip title={showMore ? "Hide more filters" : "Show more filters"}>
          <IconButton
            aria-label={showMore ? "Hide more filters" : "Show more filters"}
            onClick={() => setShowMore((open) => !open)}
            size="small"
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              backgroundColor: "background.paper",
              transform: showMore ? "rotate(180deg)" : "none",
            }}
          >
            <ExpandMoreIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* ---------- EXTRA ROW: shown after clicking the arrow ---------- */}
      <Collapse in={showMore} timeout="auto" unmountOnExit>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 1,
            mt: 1,
            pt: 1,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          {extraSelects.map(renderSelect)}

          {extraInputs.map(({ key, label, type }) => (
            <TextField
              key={key}
              label={label}
              type={type}
              size="small"
              value={filters[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              slotProps={type === "date" ? { inputLabel: { shrink: true } } : undefined}
              sx={fieldSx}
            />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}