import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Box,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import type {
  InvoiceReportFilterProps,
  InvoiceReportFilters,
  InvoiceReportSelectFilterKey,
} from "../types/invoiceReport.types";

const fieldSx = {
  minWidth: 0,
  "& .MuiOutlinedInput-root": {
    backgroundColor: "background.paper",
    borderRadius: 2,
  },
};

const selectFields: {
  key: InvoiceReportSelectFilterKey;
  label: string;
}[] = [
  { key: "client", label: "Client" },
  { key: "vessel", label: "Vessel" },
  { key: "status", label: "Status" },
  { key: "mode", label: "Mode" },
];

const statusOptions = [
  "Draft",
  "Invoice Generated",
  "Received",
  "Partially Received",
];

const textAndDateFields: {
  key: "manifestNo" | "invoiceNo" | "dateFrom" | "dateTo";
  label: string;
  type?: "date";
}[] = [
  { key: "manifestNo", label: "Manifest No" },
  { key: "invoiceNo", label: "Invoice No" },
  { key: "dateFrom", label: "Date From", type: "date" },
  { key: "dateTo", label: "Date To", type: "date" },
];

export default function InvoiceReportFilter({
  filters,
  onChange,
  options,
}: InvoiceReportFilterProps) {
  const handleChange = <K extends keyof InvoiceReportFilters>(
    key: K,
    value: InvoiceReportFilters[K],
  ) => onChange({ ...filters, [key]: value });

  return (
    <Box sx={{ py: 2, backgroundColor: "background.default" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
            lg: "auto repeat(8, minmax(100px, 1fr))",
          },
          gap: 0.5,
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            whiteSpace: "nowrap",
            gridColumn: { xs: "span 2", md: "span 4", lg: "auto" },
          }}
        >
          <FilterListIcon sx={{ color: "text.secondary", fontSize: 20 }} />
          <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
            Filters
          </Typography>
        </Box>

        {selectFields.map(({ key, label }) => (
          <TextField
            key={key}
            select
            label={label}
            size="small"
            fullWidth
            value={filters[key]}
            onChange={(event) => handleChange(key, event.target.value)}
            sx={fieldSx}
          >
            <MenuItem value="">All</MenuItem>
            {[...new Set(key === "status" ? statusOptions : options?.[key] ?? [])].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        ))}

        {textAndDateFields.map(({ key, label, type }) => (
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
    </Box>
  );
}