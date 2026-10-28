import { Box, Collapse, IconButton, MenuItem, TextField, Tooltip, Typography } from "@mui/material";
import type { StockHistoryFilterProps, StockHistoryFilters } from "../types/Stocks.types";
import FilterListIcon from "@mui/icons-material/FilterList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";




const fieldSx = {
        "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            backgroundColor: "background.paper",
        },
    };

export default function StockHistoryFilter({ filters, onChange }: StockHistoryFilterProps) {

    const [showMore, setShowMore] = useState(false);

    const handleChange = (field: keyof StockHistoryFilters, value: string) => {
            onChange({ ...filters, [field]: value });
        };

    return (
        <Box
            sx={{
                py: 2,
                backgroundColor: "background.default",
            }}
        >
            <Box
                sx={{
                    display: "grid",
                    gap: 0.5,
                    alignItems: "center",
                    gridTemplateColumns: {
                        xs: "repeat(2, minmax(0, 1fr))",
                        sm: "repeat(2, minmax(0, 1fr))",
                        md: "repeat(3, minmax(0, 1fr))",
                        lg: "repeat(4, minmax(0, 1fr))",
                        xl: "auto minmax(130px, 1.2fr) repeat(6, minmax(100px, 1fr)) 36px",
                    },
                }}  

            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, whiteSpace: "nowrap", gridColumn: { xs: "span 2", xl: "auto" } }}>
                    <FilterListIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
                        Filters
                    </Typography>
                </Box>
                <Box sx={{ position: "relative", minWidth: 0 }}>
                    <TextField
                        placeholder="Search..."
                        size="small"
                        fullWidth
                        value={filters.search}
                        onChange={(e) => handleChange("search", e.target.value)}
                        sx={{
                            ...fieldSx,
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

                <TextField
                    select
                    label="Client"
                    size="small"
                    fullWidth
                    value={filters.client}
                    onChange={(e) => handleChange("client", e.target.value)}
                    sx={fieldSx}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Client 1">Client 1</MenuItem>
                    <MenuItem value="Client 2">Client 2</MenuItem>
                    <MenuItem value="Client 3">Client 3</MenuItem>
                </TextField>

                <TextField
                    select
                    label="Vessel"
                    size="small"
                    fullWidth
                    value={filters.vessel}
                    onChange={(e) => handleChange("vessel", e.target.value)}
                    sx={fieldSx}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Vessel 1">Vessel 1</MenuItem>
                    <MenuItem value="Vessel 2">Vessel 2</MenuItem>
                    <MenuItem value="Vessel 3">Vessel 3</MenuItem>
                </TextField>
                <TextField
                    select
                    label="PO Number"
                    size="small"
                    fullWidth
                    value={filters.po_no}
                    onChange={(e) => handleChange("po_no", e.target.value)}
                    sx={fieldSx}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="PO 1">PO 1</MenuItem>
                    <MenuItem value="PO 2">PO 2</MenuItem>
                    <MenuItem value="PO 3">PO 3</MenuItem>
                </TextField>

                <TextField
                    select
                    label="Station"
                    size="small"
                    fullWidth
                    value={filters.station}
                    onChange={(e) => handleChange("station", e.target.value)}
                    sx={fieldSx}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Station 1">Station 1</MenuItem>
                    <MenuItem value="Station 2">Station 2</MenuItem>
                    <MenuItem value="Station 3">Station 3</MenuItem>
                </TextField>

                <TextField
                    select
                    label="Supplier"
                    size="small"
                    fullWidth
                    value={filters.supplier}
                    onChange={(e) => handleChange("supplier", e.target.value)}
                    sx={fieldSx}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Supplier 1">Supplier 1</MenuItem>
                    <MenuItem value="Supplier 2">Supplier 2</MenuItem>
                    <MenuItem value="Supplier 3">Supplier 3</MenuItem>
                </TextField>
                <TextField
                    label="Transit Number"
                    size="small"
                    fullWidth
                    value={filters.transit_no}
                    onChange={(e) => handleChange("transit_no", e.target.value)}
                    sx={fieldSx}
                />

                <Tooltip title={showMore ? "Hide more filters" : "Show more filters"}>
                    <IconButton
                        aria-label={showMore ? "Hide more filters" : "Show more filters"}
                        onClick={() => setShowMore((open) => !open)}
                        size="small"
                        sx={{
                            justifySelf: { xs: "flex-start", xl: "center" },
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 2,
                            backgroundColor: "background.paper",
                            width: 32,
                            height: 32,
                            transition: "transform 180ms ease, background-color 120ms ease",
                            transform: showMore ? "rotate(180deg)" : "none",
                            "&:hover": { backgroundColor: "action.hover" },
                        }}
                    >
                        <ExpandMoreIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Extra fields */}
            <Collapse in={showMore} timeout="auto" unmountOnExit>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "repeat(2, minmax(0, 1fr))",
                            sm: "repeat(2, minmax(0, 1fr))",
                            lg: "repeat(8, minmax(0, 1fr))",
                        },
                        gap: 1,
                        mt: 1,
                        pt: 1,
                        borderTop: 1,
                        borderColor: "divider",
                    }}
                >
                    <TextField
                        select
                        label="Status"
                        size="small"
                        fullWidth
                        value={filters.status}
                        onChange={(e) => handleChange("status", e.target.value)}
                        sx={fieldSx}
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Status 1">Status 1</MenuItem>
                        <MenuItem value="Status 2">Status 2</MenuItem>
                        <MenuItem value="Status 3">Status 3</MenuItem>
                    </TextField>
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
                </Box>

            </Collapse>



        </Box>
            
        
    )}