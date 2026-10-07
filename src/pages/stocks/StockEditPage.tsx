import { useState, type ChangeEvent, type ReactNode } from "react";
import {
    Box, Button, Checkbox, FormControlLabel, IconButton, MenuItem, Paper, Stack, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, Tooltip, Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CargoSvg from "../../assets/Cargo_svg.svg";
import type { StockFollowupRow } from "./components/StockFollowupTable";

type EditLocationState = { stock?: StockFollowupRow };
type StockFile = StockFollowupRow["docs"][number];

function SectionHeader({ title, icon }: { title: string; icon: ReactNode }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, pb: 0.75, borderBottom: "2px solid", borderColor: "divider" }}>
            <Box sx={{ display: "flex", color: "#000", "& svg": { fontSize: 26, color: "#000" } }}>{icon}</Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{title}</Typography>
        </Box>
    );
}

function FileList({ title, files, onRemove }: { title: string; files: StockFile[]; onRemove: (index: number) => void }) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 1, p: 1.5, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{title}</Typography>
            {files.length ? (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {files.map((file, index) => (
                        <Tooltip key={`${file.url}-${index}`} title={file.name}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, pl: 1, pr: 0.25, py: 0.25, borderRadius: 1, border: "1px solid", borderColor: "success.light", bgcolor: "rgba(46,125,50,0.06)", maxWidth: 220 }}>
                                <InsertDriveFileIcon sx={{ fontSize: 14, color: "success.main", flexShrink: 0 }} />
                                <Typography variant="caption" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "success.main", fontWeight: 500 }}>{file.name}</Typography>
                                <IconButton size="small" aria-label={`Remove ${file.name}`} onClick={() => onRemove(index)} sx={{ p: 0.25, color: "text.secondary", flexShrink: 0 }}>
                                    <CloseIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                            </Box>
                        </Tooltip>
                    ))}
                </Box>
            ) : <Typography variant="caption" color="text.secondary">No {title.toLowerCase()} uploaded</Typography>}
        </Box>
    );
}

export default function StockEditPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const initialStock = (location.state as EditLocationState | null)?.stock;
    const [stock, setStock] = useState<StockFollowupRow | null>(initialStock ?? null);

    const updateText = (key: keyof StockFollowupRow, value: string) => {
        setStock((current) => current ? { ...current, [key]: value } as StockFollowupRow : current);
    };
    const updateNumber = (key: "pkgs" | "weight" | "cbm" | "value", value: string) => {
        setStock((current) => current ? { ...current, [key]: value === "" ? 0 : Number(value) } : current);
    };
    const addFiles = (key: "docs" | "images", event: ChangeEvent<HTMLInputElement>) => {
        const addedFiles = Array.from(event.target.files ?? []).map((file) => ({ name: file.name, url: URL.createObjectURL(file) }));
        if (addedFiles.length) {
            setStock((current) => current ? { ...current, [key]: [...current[key], ...addedFiles] } : current);
        }
        event.target.value = "";
    };
    const removeFile = (key: "docs" | "images", index: number) => {
        const file = stock?.[key][index];
        if (file?.url.startsWith("blob:")) URL.revokeObjectURL(file.url);
        setStock((current) => current ? { ...current, [key]: current[key].filter((_, fileIndex) => fileIndex !== index) } : current);
    };

    const handleSave = () => {
        if (!stock) return;
        navigate("/stocks/follow-up", { state: { updatedStock: stock } });
    };

    const textFields: { label: string; key: keyof StockFollowupRow }[] = [
        { label: "Stock ID", key: "stock_id" },
        { label: "Station", key: "station" },
        { label: "Vessel", key: "vessel" },
        { label: "Client", key: "client" },
        { label: "Supplier", key: "supplier" },
        { label: "PO Number", key: "po_no" },
        { label: "Arrival Date", key: "arrival_date" },
        { label: "Existing Manifest", key: "existing_manifest" },
        { label: "Transit ID No", key: "transit_no" },
    ];

    return (
        <Stack spacing={1.5}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>Edit Stock</Typography>
                    {(stock?.stock_id || id) && (
                        <Typography variant="h5" sx={{ fontWeight: 700, color: "primary.main" }}>
                            {stock?.stock_id ?? id}
                        </Typography>
                    )}
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button variant="outlined" color="error" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handleSave} disabled={!stock}>Save</Button>
                </Box>
            </Box>

            {!stock ? (
                <Paper sx={{ p: 3 }}>
                    <Typography color="text.secondary">Stock details could not be loaded. Open Edit from the Stock Followup table.</Typography>
                </Paper>
            ) : (
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" }, gap: 0.5 }}>
                    <Paper elevation={2} sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
                        <SectionHeader title="Stock Details" icon={<Inventory2OutlinedIcon />} />
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
                            {textFields.map(({ label, key }) => (
                                <TextField key={key} size="small" label={label} fullWidth value={stock[key] as string} onChange={(event) => updateText(key, event.target.value)} />
                            ))}
                            <TextField select size="small" label="Cargo Status" fullWidth value={stock.stock_status} onChange={(event) => updateText("stock_status", event.target.value)}>
                                {["Pending", "In Progress", "Completed"].map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                            </TextField>
                            <TextField size="small" label="Country of Origin" fullWidth />
                            <TextField size="small" label="Cargo Description" fullWidth />
                            <TextField size="small" label="HS Code" fullWidth />
                            <TextField size="small" label="Currency" fullWidth value="USD" />
                            <TextField size="small" label="Cargo Value" fullWidth type="number" value={stock.value} onChange={(event) => updateNumber("value", event.target.value)} />
                            <TextField size="small" label="Mode of Arrival" fullWidth />
                            <TextField size="small" label="Storage Type" fullWidth />
                        </Box>
                    </Paper>

                    <Paper elevation={2} sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5, maxHeight: 495, overflowY: "auto" }}>
                        <SectionHeader title="Arrival & Attachments" icon={<Inventory2OutlinedIcon />} />
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                            <TextField select size="small" label="Pickup Charges" defaultValue="No" sx={{ minWidth: 180 }}>
                                <MenuItem value="Yes">Yes</MenuItem><MenuItem value="No">No</MenuItem>
                            </TextField>
                            <FormControlLabel control={<Checkbox />} label="Fumigation" />
                        </Box>
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
                            <FileList title="Documents" files={stock.docs} onRemove={(index) => removeFile("docs", index)} />
                            
                            <FileList title="Images" files={stock.images} onRemove={(index) => removeFile("images", index)} />
                        </Box>
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1 }}>
                            <Button component="label" variant="outlined" startIcon={<CloudUploadOutlinedIcon />}>
                                Add Documents
                                <input hidden type="file" multiple accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => addFiles("docs", event)} />
                            </Button>
                            <Button component="label" variant="outlined" startIcon={<CloudUploadOutlinedIcon />}>
                                Add Images
                                <input hidden type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={(event) => addFiles("images", event)} />
                            </Button>
                        </Box>
                        <TextField label="Comments / Remarks" multiline minRows={3} fullWidth />
                        <Box component={Paper} variant="outlined" sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
                            <SectionHeader title="Charges" icon={<AttachMoneyOutlinedIcon />} />
                            <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                    <TableHead><TableRow>{["Description", "Agent", "Invoice No", "Currency", "Charges"].map((label) => <TableCell key={label} sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>{label}</TableCell>)}</TableRow></TableHead>
                                    <TableBody><TableRow>{["description", "agent", "invoice", "currency", "charges"].map((field) => <TableCell key={field} sx={{ minWidth: 100, p: 0.75 }}><TextField size="small" fullWidth /></TableCell>)}</TableRow></TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Paper>

                    <Paper elevation={2} sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1, gridColumn: { xs: "span 1", md: "span 2" } }}>
                        <SectionHeader title="Cargo Details" icon={<Box component="img" src={CargoSvg} alt="" sx={{ width: 36, height: 26, objectFit: "contain" }} />} />
                        <TableContainer component={Paper} variant="outlined" sx={{ overflowX: "auto" }}>
                            <Table size="small" sx={{ minWidth: 1100 }}>
                                <TableHead><TableRow>{["Length", "Width", "Height", "Pieces", "Weight", "DG", "Repacking", "Medicine", "Package Type", "CBM", "CWT AIR", "CWT COUR", "WHL"].map((label) => <TableCell key={label} sx={{ fontWeight: 600, whiteSpace: "nowrap", textAlign: "center" }}>{label}</TableCell>)}</TableRow></TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell><TextField size="small" fullWidth /></TableCell>
                                        <TableCell><TextField size="small" fullWidth /></TableCell>
                                        <TableCell><TextField size="small" fullWidth /></TableCell>
                                        <TableCell><TextField size="small" type="number" fullWidth value={stock.pkgs} onChange={(event) => updateNumber("pkgs", event.target.value)} /></TableCell>
                                        <TableCell><TextField size="small" type="number" fullWidth value={stock.weight} onChange={(event) => updateNumber("weight", event.target.value)} /></TableCell>
                                        <TableCell align="center"><Checkbox /></TableCell>
                                        <TableCell align="center"><Checkbox /></TableCell>
                                        <TableCell align="center"><Checkbox /></TableCell>
                                        <TableCell><TextField size="small" fullWidth /></TableCell>
                                        <TableCell><TextField size="small" type="number" fullWidth value={stock.cbm} onChange={(event) => updateNumber("cbm", event.target.value)} /></TableCell>
                                        <TableCell><TextField size="small" fullWidth /></TableCell>
                                        <TableCell><TextField size="small" fullWidth /></TableCell>
                                        <TableCell><TextField size="small" fullWidth /></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>
            )}
        </Stack>
    );
}
