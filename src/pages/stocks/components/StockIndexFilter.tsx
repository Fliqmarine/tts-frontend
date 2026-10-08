import { useState } from "react";
import { Box, Checkbox, Collapse, FormControlLabel, IconButton, InputAdornment, MenuItem, TextField, Tooltip, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";

export interface StockIndexFilters {
    search: string;
    client: string;
    vessel: string;
    station: string;
    supplier: string;
    poNumber: string;
    transitNumber: string;
    status: string;
    fromDate: string;
    toDate: string;
    stock30PlusDays: boolean;
    dg: boolean;
    pickup: boolean;
    withoutChineseDocs: boolean;
}

interface StockIndexFilterProps {
    filters: StockIndexFilters;
    onChange: (filters: StockIndexFilters) => void;
}

const fieldSx = {
    minWidth: 0,
    "& .MuiOutlinedInput-root": {
        backgroundColor: "background.paper",
        borderRadius: 2,
    },
};

export const DEFAULT_STOCK_INDEX_FILTERS: StockIndexFilters = {
    search: "",
    client: "",
    vessel: "",
    station: "",
    supplier: "",
    poNumber: "",
    transitNumber: "",
    status: "",
    fromDate: "",
    toDate: "",
    stock30PlusDays: false,
    dg: false,
    pickup: false,
    withoutChineseDocs: false,
};

export default function StockIndexFilter({ filters, onChange }: StockIndexFilterProps) {
    const [showMore, setShowMore] = useState(false);
    const update = <K extends keyof StockIndexFilters>(key: K, value: StockIndexFilters[K]) => {
        onChange({ ...filters, [key]: value });
    };

    const selectField = (
        key: "client" | "vessel" | "station" | "supplier" | "status",
        label: string,
        options: string[],
    ) => (
        <TextField
            key={key}
            select
            label={label}
            size="small"
            fullWidth
            value={filters[key]}
            onChange={(event) => update(key, event.target.value)}
            sx={fieldSx}
        >
            <MenuItem value="">All</MenuItem>
            {options.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
        </TextField>
    );

    return (
        <Box sx={{ py: 0.5, backgroundColor: "background.default" }}>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "repeat(2, minmax(0, 1fr))",
                        md: "repeat(4, minmax(0, 1fr))",
                        lg: "auto minmax(120px, 1.2fr) repeat(7, minmax(90px, 1fr)) 36px",
                    },
                    gap: 1.5,
                    alignItems: "center",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, whiteSpace: "nowrap", gridColumn: { xs: "span 2", md: "span 4", lg: "auto" } }}>
                    <FilterListIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>Filters</Typography>
                </Box>
                <TextField
                    placeholder="Search..."
                    size="small"
                    fullWidth
                    value={filters.search}
                    onChange={(event) => update("search", event.target.value)}
                    slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> } }}
                    sx={fieldSx}
                />
                {selectField("client", "Client", ["Client 1", "Client 2", "Client 3"])}
                {selectField("vessel", "Vessel", ["Vessel 1", "Vessel 2", "Vessel 3"])}
                {selectField("station", "Station", ["ICN-TTS-E 1", "DXB-TTS-02", "SIN-TTS-03", "LHR-TTS-04", "JFK-TTS-05", "HND-TTS-06"])}
                {selectField("supplier", "Supplier", ["Supplier 1", "Supplier 2", "Supplier 3"])}
                <TextField
                    label="PO Number"
                    size="small"
                    fullWidth
                    value={filters.poNumber}
                    onChange={(event) => update("poNumber", event.target.value)}
                    sx={fieldSx}
                />
                <TextField
                    label="Transit Number"
                    size="small"
                    fullWidth
                    value={filters.transitNumber}
                    onChange={(event) => update("transitNumber", event.target.value)}
                    sx={fieldSx}
                />
                {selectField("status", "Status", ["Pending", "In Progress", "Completed"])}
                <Tooltip title={showMore ? "Hide more filters" : "Show more filters"}>
                        <IconButton
                        aria-label={showMore ? "Hide more filters" : "Show more filters"}
                        onClick={() => setShowMore((open) => !open)}
                        size="small"
                        sx={{
                            justifySelf: "center",
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 2,
                            backgroundColor: "background.paper",
                            width: 36,
                            height: 36,
                            transform: showMore ? "rotate(180deg)" : "none",
                            transition: "transform 180ms ease",
                        }}
                    >
                        <ExpandMoreIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>

            <Collapse in={showMore} timeout="auto" unmountOnExit>
                <Box sx={{ mt: 1, pt: 1, borderTop: 1, borderColor: "divider" }}>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(3, minmax(0, 1fr,1fr))", md: "repeat(10, minmax(0, 1fr))" }, gap: 0.5 }}>
                        <TextField
                            label="From Date"
                            type="date"
                            size="small"
                            fullWidth
                            value={filters.fromDate}
                            onChange={(event) => update("fromDate", event.target.value)}
                            slotProps={{ inputLabel: { shrink: true } }}
                            sx={fieldSx}
                        />
                        <TextField
                            label="To Date"
                            type="date"
                            size="small"
                            fullWidth
                            value={filters.toDate}
                            onChange={(event) => update("toDate", event.target.value)}
                            slotProps={{ inputLabel: { shrink: true } }}
                            sx={fieldSx}
                        />
                        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, gridColumn: { xs: "span 2", md: "span 8" } }}>
                            <FormControlLabel sx={{ m: 0, minWidth: 0, "& .MuiFormControlLabel-label": { whiteSpace: "nowrap", fontSize: "0.75rem" } }} control={<Checkbox size="small" sx={{ p: 0.25 }} checked={filters.stock30PlusDays} onChange={(event) => update("stock30PlusDays", event.target.checked)} />} label={<Typography variant="body2">Stock 30+ days</Typography>} />
                            <FormControlLabel sx={{ m: 0, minWidth: 0, "& .MuiFormControlLabel-label": { whiteSpace: "nowrap", fontSize: "0.75rem" } }} control={<Checkbox size="small" sx={{ p: 0.25 }} checked={filters.dg} onChange={(event) => update("dg", event.target.checked)} />} label={<Typography variant="body2">DG</Typography>} />
                            <FormControlLabel sx={{ m: 0, minWidth: 0, "& .MuiFormControlLabel-label": { whiteSpace: "nowrap", fontSize: "0.75rem" } }} control={<Checkbox size="small" sx={{ p: 0.25 }} checked={filters.pickup} onChange={(event) => update("pickup", event.target.checked)} />} label={<Typography variant="body2">Pickup</Typography>} />
                            <FormControlLabel sx={{ m: 0, minWidth: 0, "& .MuiFormControlLabel-label": { whiteSpace: "nowrap", fontSize: "0.75rem" } }} control={<Checkbox size="small" sx={{ p: 0.25 }} checked={filters.withoutChineseDocs} onChange={(event) => update("withoutChineseDocs", event.target.checked)} />} label={<Typography variant="body2">Stocks without Chinese docs</Typography>} />
                        </Box>
                        
                        

                    </Box>
                    
                </Box>
            </Collapse>
        </Box>
    );
}
