import { Box, TextField, Typography } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";




export interface Filters {
    search: string;
}

interface VendorsIndexFilterProps {
    filters: Filters;
    onChange: (filters: Filters) => void;
}
export default function VendorIndexFilter({ filters, onChange }: VendorsIndexFilterProps) {

    const handleChange = (field: keyof Filters, value: string) => {
        onChange({ ...filters, [field]: value });
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


        </Box>


    );
}
