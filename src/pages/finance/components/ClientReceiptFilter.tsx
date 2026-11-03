import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import {
  Badge,
  Box,
  Collapse,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type {
  ClientReceiptFilters,
  ClientReceiptSelectFilterKey,
} from "../types/clientReceipt.types";

type Props = {
  filters: ClientReceiptFilters;
  onChange: (filters: ClientReceiptFilters) => void;
  options?: Partial<Record<ClientReceiptSelectFilterKey, string[]>>;
};

const selectFields: {
  key: ClientReceiptSelectFilterKey;
  label: string;
  defaultOptions: string[];
}[] = [
  { key: "client", label: "Client", defaultOptions: [] },
  {
    key: "status",
    label: "Status",
    defaultOptions: ["Received", "Partially Received", "Invoice Generated", "Overdue", "Reopen Request", "Reopened"],
  },
];

const extraFields: { key: keyof ClientReceiptFilters; label: string; type?: "date" }[] = [
  { key: "receiptNumber", label: "Receipt No" },
  { key: "invoiceNumber", label: "Invoice No" },
  { key: "fromDate", label: "From Date", type: "date" },
  { key: "toDate", label: "To Date", type: "date" },
];

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    backgroundColor: "background.paper",
  },
};

export default function ClientReceiptFilter({ filters, onChange, options }: Props) {
  const [showMore, setShowMore] = useState(false);
  const hasHiddenActive = extraFields.some(({ key }) => Boolean(filters[key]));

  const handleChange = (field: keyof ClientReceiptFilters, value: string) =>
    onChange({ ...filters, [field]: value });

  return (
    <Box sx={{ py: 2, backgroundColor: "background.default" }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FilterListIcon sx={{ color: "text.secondary", fontSize: 20 }} />
          <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
            Filters
          </Typography>
        </Box>

        <TextField
          placeholder="Search receipts..."
          size="small"
          value={filters.search}
          onChange={(event) => handleChange("search", event.target.value)}
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

        {selectFields.map(({ key, label, defaultOptions }) => {
          const fieldOptions = [...new Set([...defaultOptions, ...(options?.[key] ?? [])])];

          return (
            <TextField
              key={key}
              select
              label={label}
              size="small"
              value={filters[key]}
              onChange={(event) => handleChange(key, event.target.value)}
              sx={{ ...fieldSx, minWidth: 140, flex: 1 }}
            >
              <MenuItem value="">All</MenuItem>
              {fieldOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          );
        })}

        <Tooltip disableInteractive title={showMore ? "Hide more filters" : "Show more filters"}>
          <IconButton
            aria-label={showMore ? "Hide more filters" : "Show more filters"}
            aria-expanded={showMore}
            onClick={() => setShowMore((open) => !open)}
            size="small"
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              backgroundColor: "background.paper",
            }}
          >
            <Badge color="primary" variant="dot" invisible={showMore || !hasHiddenActive}>
              <ExpandMoreIcon
                fontSize="small"
                sx={{
                  transition: "transform 0.2s",
                  transform: showMore ? "rotate(180deg)" : "none",
                }}
              />
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>

      <Collapse in={showMore} timeout="auto" unmountOnExit>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              md: "repeat(auto-fill, minmax(180px, 1fr))",
            },
            gap: 1,
            mt: 1.5,
            pt: 1.5,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          {extraFields.map(({ key, label, type }) => (
            <TextField
              key={key}
              label={label}
              type={type}
              size="small"
              fullWidth
              value={filters[key]}
              onChange={(event) => handleChange(key, event.target.value)}
              slotProps={type === "date" ? { inputLabel: { shrink: true } } : undefined}
              sx={fieldSx}
            />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}