import { useState } from "react";
import { Box, Collapse, IconButton, MenuItem, TextField, Tooltip, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";

export interface Filters {
    search: string;
    client: string;
    vessel: string;
    station: string;
    supplier: string;
    po_number: string;
    transit_number: string;
    status: string;
    key_account_manager: string;
}

interface FollowupFilterProps {
    filters: Filters;
    onChange: (filters: Filters) => void;
}

const fieldSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: 2,
        backgroundColor: "background.paper",
    },
};

export default function Filter({ filters, onChange }: FollowupFilterProps) {
    const [showMore, setShowMore] = useState(false);

    const handleChange = (field: keyof Filters, value: string) => {
        onChange({ ...filters, [field]: value });
    };

    return (
        <Box
            sx={{
                // px: { xs: 1.5, sm: 2 },
                // borderRadius: 1,
                // border: 1,
                // borderColor: "divider",
                py: 1.5,
                backgroundColor: "background.default",
            }}
        >
            {/* Main row: label + search + 4 fields, all evenly sized, ending with expand button */}
            <Box
                sx={{
                    display: "grid",
                    gap: 1.5,
                    alignItems: "center",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "auto 1fr 1fr",
                        md: "auto repeat(3, 1fr)",
                        lg: "auto 1.4fr repeat(4, 1fr) 44px",
                    },
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, whiteSpace: "nowrap" }}>
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
                    value={filters.po_number}
                    onChange={(e) => handleChange("po_number", e.target.value)}
                    sx={fieldSx}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="PO 1">PO 1</MenuItem>
                    <MenuItem value="PO 2">PO 2</MenuItem>
                    <MenuItem value="PO 3">PO 3</MenuItem>
                </TextField>
                <TextField
                    select
                    label="Key Account Manager"
                    size="small"
                    fullWidth
                    value={filters.key_account_manager}
                    onChange={(e) => handleChange("key_account_manager", e.target.value)}
                    sx={fieldSx}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Key Account Manager 1">Key Account Manager 1</MenuItem>
                    <MenuItem value="Key Account Manager 2">Key Account Manager 2</MenuItem>
                    <MenuItem value="Key Account Manager 3">Key Account Manager 3</MenuItem>
                </TextField>

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
                            width: 40,
                            height: 40,
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
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            lg: "repeat(4, 1fr)",
                        },
                        gap: 1.5,
                        mt: 1.5,
                        pt: 1.5,
                        borderTop: 1,
                        borderColor: "divider",
                    }}
                >
                   

                    <TextField
                        label="Transit Number"
                        size="small"
                        fullWidth
                        value={filters.transit_number}
                        onChange={(e) => handleChange("transit_number", e.target.value)}
                        sx={fieldSx}
                    />

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

                    
                </Box>
            </Collapse>
        </Box>
    );
}