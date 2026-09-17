import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
    Box,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";

export interface UserFilters {
    search: string;
    status: string;
    role: string;
}

interface UserPageFilterProps {
    filters: UserFilters;
    onFilterChange: (filters: UserFilters) => void;
}

export default function UserIndexFilter({
    filters,
    onFilterChange,
}: UserPageFilterProps) {
    const handleChange = (field: keyof UserFilters, value: string) => {
        onFilterChange({ ...filters, [field]: value });
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
                    sx={{
                        color: "text.secondary",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                    }}
                >
                    Filters
                </Typography>
            </Box>

            <Box sx={{ position: "relative", minWidth: 280 }}>
                <TextField
                    placeholder="Search by name or email..."
                    size="small"
                    fullWidth
                    value={filters.search}
                    onChange={(e) => handleChange("search", e.target.value)}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            pl: 1,
                        },
                        "& .MuiOutlinedInput-input": {
                            pl: 4,
                        },
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

            <TextField
                label="Status"
                size="small"
                select
                value={filters.status}
                onChange={(e) => handleChange("status", e.target.value)}
                sx={{
                    minWidth: 150,
                    "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
            >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>

            <TextField
                label="Role"
                size="small"
                select
                value={filters.role}
                onChange={(e) => handleChange("role", e.target.value)}
                sx={{
                    minWidth: 150,
                    "& .MuiOutlinedInput-root": { borderRadius: 2 },
                }}
            >
               <MenuItem value="Vendor">
                  Client
                </MenuItem>

                <MenuItem value="Vendor">
                  Documentation
                </MenuItem>

                <MenuItem value="Employee">
                  Key Account Manager
                </MenuItem>

                <MenuItem value="Employee">
                  operations Manager
                </MenuItem>

                <MenuItem value="SuperAdmin">
                  Manager
                </MenuItem>

                <MenuItem value="Client">
                  Fiance Executive
                </MenuItem>

                <MenuItem value="Client">
                  Finance Manager
                </MenuItem>
                
            </TextField>
        </Box>
    );
}