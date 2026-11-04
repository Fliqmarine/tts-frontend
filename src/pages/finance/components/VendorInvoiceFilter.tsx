import FilterListIcon from "@mui/icons-material/FilterList";
import { Box, MenuItem, TextField, Typography } from "@mui/material";
import type {
  VendorInvoiceFilters,
  VendorInvoiceSelectFilterKey,
} from "../types/vendorInvoice.types";

type Props = {
  filters: VendorInvoiceFilters;
  onChange: (filters: VendorInvoiceFilters) => void;
  options: Partial<Record<VendorInvoiceSelectFilterKey, string[]>>;
};

const selectFields: {
  key: VendorInvoiceSelectFilterKey;
  label: string;
}[] = [
  { key: "vendor", label: "Vendor" },
  { key: "vessel", label: "Vessel" },
  { key: "modeOfArrival", label: "Mode of Arrival" },
  { key: "status", label: "Status" },
  { key: "bank", label: "Bank" },
];

const fieldSx = {
  "& .MuiOutlinedInput-root": { borderRadius: 2, backgroundColor: "background.paper" },
};

export default function VendorInvoiceFilter({ filters, onChange, options }: Props) {
  const handleChange = (field: keyof VendorInvoiceFilters, value: string) =>
    onChange({ ...filters, [field]: value });

  return (
    <Box sx={{ py: 2, backgroundColor: "background.default" }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 1 }}>
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
            value={filters[key]}
            onChange={(event) => handleChange(key, event.target.value)}
            sx={{ ...fieldSx, minWidth: 150, flex: 1 }}
          >
            <MenuItem value="">All</MenuItem>
            {(options[key] ?? []).map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        ))}

        <TextField
          label="Date From"
          type="date"
          size="small"
          value={filters.fromDate}
          onChange={(event) => handleChange("fromDate", event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ ...fieldSx, minWidth: 150, flex: 1 }}
        />
        <TextField
          label="Date To"
          type="date"
          size="small"
          value={filters.toDate}
          onChange={(event) => handleChange("toDate", event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ ...fieldSx, minWidth: 150, flex: 1 }}
        />
      </Box>
    </Box>
  );
  
}