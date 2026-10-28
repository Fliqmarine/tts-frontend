import {
    Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup,
    Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { alpha } from "@mui/material/styles";
import CargoSvg from "../../assets/Cargo_svg.svg";
import type { StockReadOnlyFieldProps, StockReadOnlyFilesProps, StockSectionHeaderProps, StockViewLocationState } from "./types/Stocks.types";

const inputSx = { "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "text.primary" } };

function SectionHeader({ title, icon }: StockSectionHeaderProps) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, pb: 0.75, borderBottom: "2px solid", borderColor: "divider" }}>
            <Box sx={{ display: "flex", color: "#000", "& svg": { fontSize: 26, color: "#000" } }}>{icon}</Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{title}</Typography>
        </Box>
        
    );
}

function ReadOnlyField({ label, value = "" }: StockReadOnlyFieldProps) {
    return <TextField size="small" label={label} value={value} fullWidth disabled sx={inputSx} />;
}

function ReadOnlyFiles({ title, files }: StockReadOnlyFilesProps) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 1.5, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{title}</Typography>
            {files.length ? (
                <Box sx={{ display: "flex", flexWrap: "wrap", alignContent: "flex-start", gap: 0.5 }}>
                    {files.map((file, index) => (
                        <Tooltip key={`${file.url}-${index}`} title={file.name}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, px: 1, py: 0.5, borderRadius: 1, border: "1px solid", borderColor: "success.light", bgcolor: "rgba(46,125,50,0.06)", maxWidth: 180 }}>
                                <InsertDriveFileIcon sx={{ fontSize: 14, color: "success.main", flexShrink: 0 }} />
                                <Typography variant="caption" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "success.main", fontWeight: 500 }}>
                                    {file.name}
                                </Typography>
                            </Box>
                        </Tooltip>
                    ))}
                </Box>
            ) : <Typography variant="caption" color="text.secondary">No {title.toLowerCase()} uploaded</Typography>}
        </Box>
    );
}

export default function StockViewPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const stock = (location.state as StockViewLocationState | null)?.stock;
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleConfirmDelete = () => {
        if (!id) return;
        navigate("/stocks/stock-list", { replace: true, state: { deletedStockId: id } });
    };

    return (
        <Stack spacing={1.5}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>View Stock</Typography>
                    {(stock?.stock_id || id) && (
                        <Typography variant="h5" sx={{ fontWeight: 700, color: "primary.main" }}>
                            {stock?.stock_id ?? id}
                        </Typography>
                    )}
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/stocks/edit/${id}`, { state: { stock } })}
                        disabled={!stock}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => setDeleteDialogOpen(true)}
                        disabled={!stock || !id}
                    >
                        Delete
                    </Button>
                </Box>
            </Box>

            {!stock ? (
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography color="text.secondary">
                        Stock {id ?? "details"} could not be loaded. Open this page from the Stock Followup table.
                    </Typography>
                </Paper>
            ) : (
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" }, gap: 0.5 }}>
                    
                    <Paper elevation={2} 
                        sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5,  }}>
                        <SectionHeader title="Stock Details" icon={<Inventory2OutlinedIcon />} />
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
                            <ReadOnlyField label="Stock ID" value={stock.stock_id} />
                            <ReadOnlyField label="Station" value={stock.station} />
                            <ReadOnlyField label="Vessel" value={stock.vessel} />
                            <ReadOnlyField label="Client" value={stock.client} />
                            <ReadOnlyField label="Supplier" value={stock.supplier} />
                            <ReadOnlyField label="PO Number" value={stock.po_no} />
                            <ReadOnlyField label="Arrival Date" value={stock.arrival_date} />
                            <ReadOnlyField label="Entry Date" />
                            <ReadOnlyField label="Country of Origin" />
                            <ReadOnlyField label="Cargo Status" value={stock.stock_status} />
                            <ReadOnlyField label="Cargo Description" />
                            <ReadOnlyField label="HS Code" />
                            <ReadOnlyField label="Currency" value="USD" />
                            <ReadOnlyField label="Cargo Value" value={stock.value.toLocaleString()} />
                            <ReadOnlyField label="Mode of Arrival" />
                            <ReadOnlyField label="EU Reference" value={stock.existing_manifest} />
                            <ReadOnlyField label="Transit ID No" value={stock.transit_no} />
                            <ReadOnlyField label="Storage Type" />
                        </Box>
                    </Paper>

                    <Paper elevation={2} sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5,maxHeight: 495, overflowY: "auto" }}>
                        <SectionHeader title=" Attachments & Charges" icon={<Inventory2OutlinedIcon />} />
                        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 3 }}>
                            <FormControl>
                                <FormLabel>Pickup Charges</FormLabel>
                                <RadioGroup row value="">
                                    <FormControlLabel value="yes" control={<Radio disabled />} label="Yes" />
                                    <FormControlLabel value="no" control={<Radio disabled />} label="No" />
                                </RadioGroup>
                            </FormControl>
                            <FormControlLabel control={<Checkbox disabled />} label="Fumigation" />
                        </Box>

                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
                            <ReadOnlyFiles title="Documents" files={stock.docs} />
                            <ReadOnlyFiles title="Images" files={stock.images} />
                        </Box>

                        <TextField label="Comments / Remarks" multiline minRows={3} value="" disabled fullWidth sx={inputSx} />

                        <Box component={Paper} variant="outlined" sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
                            <SectionHeader title="Charges" icon={<AttachMoneyOutlinedIcon />} />
                            <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            {["Description", "Agent", "Invoice No", "Currency", "Charges"].map((label) => (
                                            <TableCell key={label} sx={{ fontWeight: 600, whiteSpace: "nowrap", textAlign: "center" }}>{label}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            {["", "", "", "", ""].map((_, index) => (
                                                <TableCell key={index} sx={{ minWidth: 110, p: 0.75 }}>
                                                    <TextField size="small" fullWidth disabled value="" sx={inputSx} />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Paper>

                    <Paper elevation={2} sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1, gridColumn: { xs: "span 1", md: "span 2" } }}>
                        <SectionHeader title="Cargo Details" icon={<Box component="img" src={CargoSvg} alt="" sx={{ width: 36, height: 26, objectFit: "contain" }} />} />
                        <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        {["Length", "Width", "Height", "Pieces", "Weight", "DG", "Repacking", "Medicine", "Package Type", "CBM", "CWT AIR", "CWT COUR", "WHL"].map((label) => (
                                            <TableCell key={label} sx={{ fontWeight: 600, whiteSpace: "nowrap", textAlign: "center", px: 1 }}>{label}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell><TextField size="small" fullWidth disabled value="" sx={inputSx} /></TableCell>
                                        <TableCell><TextField size="small" fullWidth disabled value="" sx={inputSx} /></TableCell>
                                        <TableCell><TextField size="small" fullWidth disabled value="" sx={inputSx} /></TableCell>
                                        <TableCell><TextField size="small" fullWidth disabled value={stock.pkgs} sx={inputSx} /></TableCell>
                                        <TableCell><TextField size="small" fullWidth disabled value={stock.weight} sx={inputSx} /></TableCell>
                                        <TableCell align="center"><Checkbox disabled /></TableCell>
                                        <TableCell align="center"><Checkbox disabled /></TableCell>
                                        <TableCell align="center"><Checkbox disabled /></TableCell>
                                        <TableCell><TextField size="small" fullWidth disabled value="" sx={inputSx} /></TableCell>
                                        <TableCell><TextField size="small" fullWidth disabled value={stock.cbm.toFixed(2)} sx={inputSx} /></TableCell>
                                        <TableCell><TextField size="small" fullWidth disabled value="" sx={inputSx} /></TableCell>
                                        <TableCell><TextField size="small" fullWidth disabled value="" sx={inputSx} /></TableCell>
                                        <TableCell><TextField size="small" fullWidth disabled value="" sx={inputSx} /></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>
            )}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                aria-labelledby="delete-stock-title"
                aria-describedby="delete-stock-description"
                fullWidth
                maxWidth="xs"
                slotProps={{ paper: { sx: { borderRadius: 3, p: 1,mb:50, boxShadow: (theme) => theme.shadows[10] } } }}
            >
                <DialogTitle
                    id="delete-stock-title"
                    component="div"
                    sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, pt: 3, pb: 1, }}
                >
                    <Box
                        sx={(theme) => ({
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            display: "grid",
                            placeItems: "center",
                            bgcolor: alpha(theme.palette.error.main, 0.12),
                            color: "error.main",
                            boxShadow: `0 0 0 8px ${alpha(theme.palette.error.main, 0.06)}`,
                        })}
                    >
                        <DeleteOutlinedIcon sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="h6" component="h2" fontWeight={700}>Delete stock?</Typography>
                </DialogTitle>
                <DialogContent sx={{ textAlign: "center", pb: 1, }}>
                    <Typography id="delete-stock-description" variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        Are you sure you want to delete{" "}
                        <Box component="span" sx={{ fontWeight: 600, color: "error.main" }}>
                            {stock?.stock_id ?? id}
                        </Box>
                        ? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pt: 2, pb: 3, gap: 1.5 }}>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        variant="outlined"
                        color="inherit"
                        fullWidth
                        sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, borderColor: "divider" }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                        fullWidth
                        autoFocus
                        disableElevation
                        disabled={!id}
                        sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
