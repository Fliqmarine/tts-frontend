import { Autocomplete, Box, MenuItem, TextField, Typography } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import type { ContactFilters } from "./Table";
import { getCountries } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";

interface ContactListFilterProps {
    filters: ContactFilters;
    onFilterChange: (filters: ContactFilters) => void;
}

export default function ContactsIndexFilter({ filters, onFilterChange }: ContactListFilterProps) {
    const handleChange = (key: keyof ContactFilters, value: string) => {
        onFilterChange({ ...filters, [key]: value || undefined });
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                alignItems: { sm: "center" },
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 1 }}>
                <FilterListIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", fontWeight: 600, whiteSpace: "nowrap" }}
                >
                    Filters
                </Typography>
            </Box>

            {/* Search */}
            <Box sx={{ position: "relative", minWidth: 300 }}>
                <TextField
                    placeholder="Search by name, email, phone..."
                    size="small"
                    fullWidth
                    value={filters.search ?? ""}
                    onChange={(e) => handleChange("search", e.target.value)}
                    sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: 2, pl: 1 },
                        "& .MuiOutlinedInput-input": { pl: 4 },
                    }}
                />
                <SearchIcon
                    sx={{
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: 20,
                        color: "text.disabled",
                        pointerEvents: "none",
                    }}
                />
            </Box>

            {/* Category / Group filter */}
            <TextField
                label="Category"
                size="small"
                select
                value={filters.groupId ?? ""}
                onChange={(e) => handleChange("groupId", e.target.value)}
                sx={{ minWidth: 160, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Client">Client</MenuItem>
                <MenuItem value="Hub">Hub</MenuItem>
                <MenuItem value="TTS Agent">TTS Agent</MenuItem>
                <MenuItem value="Sub Agent">Sub Agent</MenuItem>
                <MenuItem value="Sub Agent Onboard">Sub Agent Onboard</MenuItem>
                <MenuItem value="Sub Agent Export">Sub Agent Export</MenuItem>
                <MenuItem value="Owners Agent">Owners Agent</MenuItem>
                <MenuItem value="Supplier">Supplier</MenuItem>
            </TextField>
            {/* Country*/}
            <Autocomplete
                size="small"
                options={getCountries().map((c) => ({ code: c, label: (en as Record<string, string>)[c] || c }))}
                getOptionLabel={(option) => option.label}
                value={
                    filters.country
                        ? { code: filters.country, label: (en as Record<string, string>)[filters.country] || filters.country }
                        : null
                }
                onChange={(_, newValue) => {
                    handleChange("country", newValue ? newValue.code : "");
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Country"
                    />
                )}
                sx={{ minWidth: 160, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
        </Box>
    );
}
