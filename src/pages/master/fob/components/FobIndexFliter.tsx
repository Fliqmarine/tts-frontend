import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { FOB_CLIENT_TYPES, type FobIndexFilterProps } from "../types/fob.types";

export default function FobIndexFilter({ value, onChange }: FobIndexFilterProps) {
    return (
        <Box sx={{ px: { xs: 0, sm: 1 }, py: 1 }}>
            <FormControl size="small" sx={{ width: { xs: "100%", sm: 280 } }}>
                <InputLabel id="fob-client-type-filter-label">Client Type</InputLabel>
                <Select
                    labelId="fob-client-type-filter-label"
                    id="fob-client-type-filter"
                    value={value}
                    label="Client Type"
                    onChange={(event) => onChange(event.target.value)}
                >
                    <MenuItem value="">All Client Types</MenuItem>
                    {FOB_CLIENT_TYPES.map((clientType) => (
                        <MenuItem key={clientType} value={clientType}>
                            {clientType}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}
