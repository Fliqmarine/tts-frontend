import { Box, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField, Typography } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";

interface FilterProps {
    activeOnly: boolean;
    onActiveChange: (active: boolean) => void;
    search: string;
    onSearchChange: (search: string) => void;
}

export default function Filter({ activeOnly, onActiveChange, search, onSearchChange }: FilterProps) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                flexWrap: "wrap",
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
            <Box sx={{ position: "relative", width: { xs: "100%", sm: 280 } }}>
                <TextField
                    placeholder="Search vessels by name, client, code, or IMO..."
                    size="small"
                    fullWidth
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Client</InputLabel>
                    <Select
                        label="Client"
                        sx={{ minWidth: 160, borderRadius: 2 }}
                    >
                        <MenuItem value="Client">Client</MenuItem>
                    </Select>
                </FormControl>
                <FormControlLabel
                    control={
                        <Switch
                            color="success"
                            checked={activeOnly}
                            onChange={(e) => onActiveChange(e.target.checked)}
                        />
                    }
                    label="Active Vessels"
                />
            </Box>
        </Box>
    );
}