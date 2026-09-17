import { Box, MenuItem, TextField, Typography } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import type { HubFilters } from "../types/hub.types";

// Sample station codes – replace with API-driven list when ready
const STATION_CODES = [
    "DXB", "AUH", "SHJ", "RKT", "FJR",
    "SIN", "KUL", "BKK", "HKG", "ICN",
    "LHR", "CDG", "FRA", "AMS", "MXP",
];

interface HubIndexFilterProps {
    filters: HubFilters;
    onFilterChange: (filters: HubFilters) => void;
}

export default function HubListFilter({ filters, onFilterChange }: HubIndexFilterProps) {
    const handleChange = (key: keyof HubFilters, value: string) => {
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
            {/* Label */}
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
                    placeholder="Search by name, email, telephone…"
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

            {/* Station Code dropdown */}
            <TextField
                label="Station Code"
                size="small"
                select
                value={filters.stationCode ?? ""}
                onChange={(e) => handleChange("stationCode", e.target.value)}
                sx={{ minWidth: 180, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            >
                <MenuItem value="">All Stations</MenuItem>
                {STATION_CODES.map((code) => (
                    <MenuItem key={code} value={code}>
                        {code}
                    </MenuItem>
                ))}
            </TextField>
        </Box>
    );
}
