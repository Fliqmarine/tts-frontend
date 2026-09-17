import { Box, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, Typography } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";



interface FilterProps {
    activeOnly: boolean;
    onActiveChange: (active: boolean) => void;
}

export default function Filter({ activeOnly, onActiveChange }: FilterProps) {
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