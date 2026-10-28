import { useState } from "react";
import { Box, Checkbox, Collapse, FormControlLabel, IconButton, InputAdornment, MenuItem, TextField, Tooltip, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import type { StockIndexFilterProps, StockIndexFilters } from "../types/Stocks.types";

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
    po_no: "",
    transit_no: "",
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
    const handleChange = <K extends keyof StockIndexFilters>(key: K, value: StockIndexFilters[K]) => {
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
            onChange={(event) => handleChange(key, event.target.value)}
            sx={fieldSx}
        >
            <MenuItem value="">All</MenuItem>
            {options.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
        </TextField>
    );

    return (
        <Box sx={{ py: 2, backgroundColor: "background.default" }}>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "repeat(2, minmax(0, 1fr))",
                        md: "repeat(4, minmax(0, 1fr))",
                        lg: "auto minmax(120px, 1.2fr) repeat(7, minmax(90px, 1fr)) 36px",
                    },
                    gap: 0.5,
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
                    onChange={(event) => handleChange("search", event.target.value)}
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
                    value={filters.po_no}
                    onChange={(event) => handleChange("po_no", event.target.value)}
                    sx={fieldSx}
                />
                <TextField
                    label="Transit Number"
                    size="small"
                    fullWidth
                    value={filters.transit_no}
                    onChange={(event) => handleChange("transit_no", event.target.value)}
                    sx={fieldSx}
                />
                {selectField("status", "Status", ["Pending", "In Progress", "Completed"])}
                <Tooltip title={showMore ? "Hide more filters" : "Show more filters"}>
                        <IconButton
                        aria-label={showMore ? "Hide more filters" : "Show more filters"}
                        onClick={() => setShowMore((open) => !open)}
                        size="small"
                        sx={{
                            justifySelf: { xs: "flex-start", lg: "center" },
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 2,
                            backgroundColor: "background.paper",
                            width: 32,
                            height: 32,
                            transform: showMore ? "rotate(180deg)" : "none",
                            transition: "transform 180ms ease",
                        }}
                    >
                        <ExpandMoreIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>

            <Collapse in={showMore} timeout="auto" unmountOnExit>
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" },
                    gap: 1,
                    mt: 1,
                    pt: 1,
                    borderTop: 1,
                    borderColor: "divider",
                }}>
                        <TextField
                            label="From Date"
                            type="date"
                            size="small"
                            fullWidth
                            value={filters.fromDate}
                            onChange={(event) => handleChange("fromDate", event.target.value)}
                            slotProps={{ inputLabel: { shrink: true } }}
                            sx={fieldSx}
                        />
                        <TextField
                            label="To Date"
                            type="date"
                            size="small"
                            fullWidth
                            value={filters.toDate}
                            onChange={(event) => handleChange("toDate", event.target.value)}
                            slotProps={{ inputLabel: { shrink: true } }}
                            sx={fieldSx}
                        />
                        <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 1, gridColumn: { xs: "span 2", lg: "span 2" } }}>
                            <FormControlLabel sx={{ m: 0, minWidth: 0, "& .MuiFormControlLabel-label": { whiteSpace: "nowrap", fontSize: "0.75rem" } }} control={<Checkbox size="small" sx={{ p: 0.25 }} checked={filters.stock30PlusDays} onChange={(event) => handleChange("stock30PlusDays", event.target.checked)} />} label={<Typography variant="body2">Stock 30+ days</Typography>} />
                            <FormControlLabel sx={{ m: 0, minWidth: 0, "& .MuiFormControlLabel-label": { whiteSpace: "nowrap", fontSize: "0.75rem" } }} control={<Checkbox size="small" sx={{ p: 0.25 }} checked={filters.dg} onChange={(event) => handleChange("dg", event.target.checked)} />} label={<Typography variant="body2">DG</Typography>} />
                            <FormControlLabel sx={{ m: 0, minWidth: 0, "& .MuiFormControlLabel-label": { whiteSpace: "nowrap", fontSize: "0.75rem" } }} control={<Checkbox size="small" sx={{ p: 0.25 }} checked={filters.pickup} onChange={(event) => handleChange("pickup", event.target.checked)} />} label={<Typography variant="body2">Pickup</Typography>} />
                            <FormControlLabel sx={{ m: 0, minWidth: 0, "& .MuiFormControlLabel-label": { whiteSpace: "nowrap", fontSize: "0.75rem" } }} control={<Checkbox size="small" sx={{ p: 0.25 }} checked={filters.withoutChineseDocs} onChange={(event) => handleChange("withoutChineseDocs", event.target.checked)} />} label={<Typography variant="body2">Stocks without Chinese docs</Typography>} />
                        </Box>
                        
                        

                </Box>
            </Collapse>
        </Box>
    );
}
