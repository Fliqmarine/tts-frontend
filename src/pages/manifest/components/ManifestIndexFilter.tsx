import { Badge, Box, Collapse, IconButton, InputAdornment, MenuItem, TextField, Tooltip, Typography } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import type { ManifestIndexFilters } from "../types/manifest.types";

type ManifestIndexFilterProps = {
  filters: ManifestIndexFilters;
  onChange: (filters: ManifestIndexFilters) => void;
};

type FieldConfig = { key: keyof ManifestIndexFilters; label: string; type?: "text" | "date" | "select"; options?: string[] };

// Row 1
const ROW_ONE_FIELDS: FieldConfig[] = [ 
  { key: "vessel", label: "Vessel" },
  { key: "status", label: "Status", type: "select", options: ["Manifest Created", "Manifest Sent", "Pre Alert Created","Pre Alert Stage - 2","Pre Alert Stage - 3","Pre Alert Stage - 4","Completed"] },
  { key: "keyAccountManager", label: "Key Account Manager" },
  { key: "fromDate", label: "From Date", type: "date" },
  { key: "toDate", label: "To Date", type: "date" },
  { key: "InternalStatus", label: "Internal Status", type:"select", options:["N/A","In Stock","Invoice Pending","Accounts Pending", "POD Pending","Linked To OnGoing Job","Linked To POD Pending", "Linked To Invoice Pending", "Dispute","OPS Pending","PO Pending","Invoice Received","Pending Approval From Management","Others" ] },
];

// Row 2 (collapsed by default)
const ROW_TWO_FIELDS: FieldConfig[] = [
  { key: "client", label: "Client" },
  { key: "vesselPo", label: "Vessel PO" },
  { key: "hub", label: "Hub" },
  { key: "consignee", label: "Consignee" },
  { key: "portOfDestination", label: "Port of Destination" },
  { key: "mode", label: "Mode" },
];

//*Row (collapsed by default)
const ROW_THREE_FIELDS: FieldConfig[] = [
  { key: "transitNo", label: "Transit No" },
  { key: "invoice", label: "Invoice" },
];

const fieldSx = {
  "& .MuiOutlinedInput-root": { borderRadius: 2, backgroundColor: "background.paper" },
};

export default function ManifestIndexFilter({ filters, onChange }: ManifestIndexFilterProps) {
  const [showMore, setShowMore] = useState(false);

  const handleChange = (field: keyof ManifestIndexFilters, value: string) =>
    onChange({ ...filters, [field]: value });

  const hasHiddenActive = [ROW_TWO_FIELDS ,ROW_THREE_FIELDS].some(({ key }) => Boolean(filters[key]));

  const renderField = ({ key, label, type = "text", options = [] }: FieldConfig) => (
    <TextField
      key={key}
      label={label}
      type={type}
      size="small"
      fullWidth
      select={type === "select"}
      value={filters[key] ?? ""}
      onChange={(event) => handleChange(key, event.target.value)}
      slotProps={type === "date" ? { inputLabel: { shrink: true } } : undefined}
      sx={fieldSx}
    >
      {type === "select" && [<MenuItem key="all" value="">All statuses</MenuItem>, ...options.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)]}
    </TextField>
  );

  return (
    <Box sx={{ mt:2 }}>
      {/* ROW 1: label + 7 fields + arrow */}
      <Box
        sx={{
          display: "grid",
          gap: 1,
          alignItems: "center",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
            lg: "auto repeat(7, minmax(0, 1fr)) auto",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            gridColumn: { xs: "1 / -1", lg: "auto" },
          }}
        >
          <FilterListIcon sx={{ color: "text.secondary", fontSize: 20 }} />
          <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
            Filters
          </Typography>
        </Box>

        <TextField
          placeholder="Search..."
          size="small"
          fullWidth
          value={filters.search}
          onChange={(event) => handleChange("search", event.target.value)}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> } }}
          sx={fieldSx}
        />

        {ROW_ONE_FIELDS.map(renderField)}

        <Tooltip title={showMore ? "Hide more filters" : "Show more filters"}>
          <IconButton
            aria-label={showMore ? "Hide more filters" : "Show more filters"}
            aria-expanded={showMore}
            onClick={() => setShowMore((open) => !open)}
            size="small"
            sx={{
              justifySelf: "end",
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              width: 32,
              height: 32,
            }}
          >
            <Badge color="primary" variant="dot" invisible={showMore || !hasHiddenActive}>
              <ExpandMoreIcon
                fontSize="small"
                sx={{ transition: "transform 0.2s", transform: showMore ? "rotate(180deg)" : "none" }}
              />
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>

      {/* ROW 2: remaining filters */}
      <Collapse in={showMore} timeout="auto" unmountOnExit>
        <Box
          sx={{
            display: "grid",
            gap: 1,
            mt: 1.5,
            pt: 1.5,
            borderTop: 1,
            borderColor: "divider",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              md: "repeat(4, minmax(0, 1fr))",
              lg: "repeat(6, minmax(0, 1fr))",
            },
          }}
        >
          {ROW_TWO_FIELDS.map(renderField)}
        </Box>
      </Collapse>
      <Collapse in={showMore} timeout="auto" unmountOnExit>
        <Box
          sx={{
            display: "grid",
            gap: 1,
            mt: 1.5,
            pt: 1.5,
            borderTop: 1,
            borderColor: "divider",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              md: "repeat(4, minmax(0, 1fr))",
              lg: "repeat(6, minmax(0, 1fr))",
            },
          }}
        >
          {ROW_THREE_FIELDS.map(renderField)}

        </Box>
      </Collapse>
    </Box>
  );
}
