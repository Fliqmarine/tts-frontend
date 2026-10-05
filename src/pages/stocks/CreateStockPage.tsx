import { Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, IconButton, MenuItem, Paper, Radio, RadioGroup, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextareaAutosize, TextField, Tooltip, Typography } from "@mui/material";
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import DangerousOutlinedIcon from '@mui/icons-material/DangerousOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import AirportShuttleOutlinedIcon from '@mui/icons-material/AirportShuttleOutlined';
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { styled } from "@mui/material/styles";

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

const SECTION_HEADER_SX = {
    display: "flex",
    // flex: 1,
    alignItems: "center",
    color: "primary",
    borderBottom: "2px solid",
    borderColor: "divider",
    pb: 0.75,
} as const;

function SectionHeader({ title, icon, required = false }: { title: string, icon?: React.ReactNode, required?: boolean }) {
    return (
        <Box sx={SECTION_HEADER_SX}>
            {icon && (
                <Box sx={{ display: 'flex', mr: 1, '& svg, & *': { color: 'primary !important' } }}>
                    {icon}
                </Box>
            )}
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {title}
                {required && <Box component="span" sx={{ color: "error.main" }}> *</Box>}
            </Typography>
            
        </Box>
    );
}

const packageTypes = [
    { value: "carton", label: "Carton" },
    { value: "wooden_pallet", label: "Wooden Pallet" },
    { value: "plastic_pallet", label: "Plastic Pallet" },
    { value: "crate", label: "Crate" },
    { value: "wooden_casing", label: "Wooden Casing" },
    { value: "documents", label: "Documents" },
    { value: "bundle_pipes", label: "Bundle Pipes" },
];

const cargoDetailsEmptyRow = () => ({
    id: crypto.randomUUID(),
    length: "", width: "", height: "", pieces: "", weight: "",
    dg: false, repackingRequired: false, medicine: false, packageType: "",
    cbm: "", cwtAir: "", cwtCourier: "", whl: "",
});

const readOnlyFields = ["cbm", "cwtAir", "cwtCourier"];

const columns = [
    { key: "length", label: "Length", required: true, type: "text" },
    { key: "width", label: "Width", required: true, type: "text" },
    { key: "height", label: "Height", required: true, type: "text" },
    { key: "pieces", label: "Pieces", required: true, type: "text" },
    { key: "weight", label: "Weight", required: true, type: "text" },
    { key: "dg", label: "Dg", type: "checkbox", icon: <DangerousOutlinedIcon fontSize="small" sx={{ color: "warning.main" }} /> },
    { key: "repackingRequired", label: "Repacking", type: "checkbox", icon: <AutorenewOutlinedIcon fontSize="small" color="success" /> },
    { key: "medicine", label: "Medicine", type: "checkbox", icon: <MedicationOutlinedIcon fontSize="small" color="error" /> },
    { key: "packageType", label: "Package Type", required: true, type: "select" },
    { key: "cbm", label: "CBM", type: "text" },
    { key: "cwtAir", label: "CWT AIR", type: "text" },
    { key: "cwtCourier", label: "CWT COUR", type: "text" },
    { key: "whl", label: "WHL", type: "text" },
];

const chargesEmptyRow = () => ({
    id: crypto.randomUUID(),
    description: "", agent: "", invoiceNo: "", currency: "", charges: "",
});

const chargesColumns = [
    { key: "description", label: "Description", type: "text" },
    { key: "agent", label: "Agent", type: "text" },
    { key: "invoiceNo", label: "Invoice No", type: "text" },
    { key: "currency", label: "Currency", type: "text" },
    { key: "charges", label: "Charges", type: "text" },
];

function CreateStockPage({ onChange }: any) {

    const [cargoRows, setCargoRows] = useState([cargoDetailsEmptyRow()]);
    const [chargeRows, setChargeRows] = useState([chargesEmptyRow()]);
    const [pickupCharges, setPickupCharges] = useState("no");

    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const newFiles = Array.from(e.dataTransfer.files ?? []);
        if (newFiles.length > 0) {
            setUploadedFiles((prev) => [...prev, ...newFiles]);
        }
    };

    //{{ cargo}}
    const handleAddCargo = () => {
        const next = [...cargoRows, cargoDetailsEmptyRow()];
        setCargoRows(next);
        onChange?.({ cargo: next });
    };

    const handleRemoveCargo = (id: string) => {
        const next = cargoRows.filter((r) => r.id !== id);
        setCargoRows(next);
        onChange?.({ cargo: next });
    };

    const handleFieldChangeCargo = (id: string, key: string, value: any) => {
        const next = cargoRows.map((r) => (r.id === id ? { ...r, [key]: value } : r));
        setCargoRows(next);
        onChange?.({ cargo: next });
    };
    // {{Charge}}
    const handleAddCharge = () => {
        const next = [...chargeRows, chargesEmptyRow()];
        setChargeRows(next);
        onChange?.({ charges: next });
    };

    const handleRemoveCharge = (id: string) => {
        const next = chargeRows.filter((r) => r.id !== id);
        setChargeRows(next);
        onChange?.({ charges: next });
    };

    const handleFieldChangeCharge = (id: string, key: string, value: any) => {
        const next = chargeRows.map((r) => (r.id === id ? { ...r, [key]: value } : r));
        setChargeRows(next);
        onChange?.({ charges: next });
    };

    const hasDocs = uploadedFiles.some(f => !f.type.startsWith('image/'));
    const hasImages = uploadedFiles.some(f => f.type.startsWith('image/'));
    const documentFiles = uploadedFiles.filter(f => !f.type.startsWith('image/'));
    const imageFiles = uploadedFiles.filter(f => f.type.startsWith('image/'));

    const renderUploadedFiles = (files: File[]) => files.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {files.map((file) => {
                const fileIndex = uploadedFiles.indexOf(file);

                return (
                    <Tooltip key={`${file.name}-${fileIndex}`} title={file.name}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                px: 1,
                                py: 0.25,
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'success.light',
                                bgcolor: 'rgba(46,125,50,0.06)',
                                maxWidth: 180,
                            }}
                        >
                            <InsertDriveFileIcon sx={{ fontSize: 13, color: 'success.main', flexShrink: 0 }} />
                            <Typography
                                variant="caption"
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    color: 'success.main',
                                    fontWeight: 500,
                                }}
                            >
                                {file.name}
                            </Typography>
                            <IconButton
                                size="small"
                                onClick={() => setUploadedFiles((prev) => prev.filter((_, index) => index !== fileIndex))}
                                sx={{ p: 0.15, ml: 0.25, flexShrink: 0 }}
                            >
                                <Typography variant="caption" sx={{ lineHeight: 1, color: 'text.secondary', fontSize: 10 }}>✕</Typography>
                            </IconButton>
                        </Box>
                    </Tooltip>
                );
            })}
        </Box>
    );

    return (
        <Stack>
            <Box
                sx={{
                    display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 1,
                    justifyContent: "space-between", alignItems: "center", mt: 1, mb: 2,
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: 600 }}>Create Stock</Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button variant="outlined">Cancel</Button>
                    <Button variant="contained">Save</Button>
                </Box>
            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
                    gap: 0.5,
                }}
            >
                {/* Column 1: Stock entry details (1fr) */}
                <Box component={Paper} elevation={3} sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <Box sx={{ mb: 1 }}>
                        <SectionHeader
                            title="Stock Details"
                            icon={<Inventory2OutlinedIcon sx={{ fontSize: 26 }} />}
                        />
                    </Box>
                    <Box sx={{ display: "flex",flexDirection: "column" , gap: 1.5 }}>
                        <Box> 
                            <TextField size="small" label="Station" fullWidth required />
                        </Box>
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
                            <TextField size="small" label="Vessel" fullWidth required />
                            <TextField size="small" label="Client" fullWidth required disabled />
                            <TextField size="small" label="Supplier" fullWidth required />
                            <TextField size="small" label="PO Number" fullWidth required />
                            <TextField size="small" label="Arrival Date" fullWidth required />
                            <TextField size="small" label="Entry Date" fullWidth required disabled />
                            <TextField size="small" label="Country of Origin" fullWidth required />
                            <TextField size="small" label="Cargo Status" fullWidth required />
                            <TextField size="small" label="Cargo Description" fullWidth required />
                            <TextField size="small" label="HS Code" fullWidth required disabled />
                            <TextField size="small" label="Currency" fullWidth required />
                            <TextField size="small" label="Cargo Value" fullWidth required />
                            <TextField size="small" label="Mode of Arrival" fullWidth required />
                            <TextField size="small" label="EU Reference" fullWidth required />
                            <TextField size="small" label="Transit ID No" fullWidth required />
                            <TextField
                            size="small"
                            label="Storage Type"
                            fullWidth
                            required
                        />
                        </Box>
                    </Box>
                </Box>

                {/* Column 2: Mode of arrival / uploads (2fr) */}
                <Box component={Paper} elevation={3} sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            // justifyContent: "space-between",
                            // mb: 1
                        }}
                    >
                        <SectionHeader
                            title="Stock Details"
                            icon={<Inventory2OutlinedIcon sx={{ fontSize: 26 }} />}
                        />
                        
                    </Box>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(6, 1fr)" },
                            gap: 1.5
                        }}>

                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "left", gap: 2, ml: 6 }}>
                        <FormControl sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
                            <FormLabel>Pickup Charges</FormLabel>
                            <RadioGroup
                                row
                                value={pickupCharges}
                                onChange={(event) => setPickupCharges(event.target.value)}
                                name="charges"
                                sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1, ml: 2 }}
                            >
                                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                <FormControlLabel value="no" control={<Radio />} label="No" />
                            </RadioGroup>
                        </FormControl>
                        
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center"
                            }}>
                            <Checkbox />
                            Fumigation
                        </Box>
                    </Box>
                    <Box

                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}

                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.75,
                            mt: 1,
                            border: isDragging ? '2px dashed' : '2px dashed transparent',
                            borderColor: isDragging ? 'primary.main' : 'transparent',
                            bgcolor: isDragging ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
                            borderRadius: 1,
                            p: isDragging ? 1 : 0,
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, pr: { sm: 1 }, pb: { xs: 1, sm: 0 }, borderRight: { xs: 0, sm: '1px solid' }, borderBottom: { xs: '1px solid', sm: 0 }, borderColor: 'divider' }}>
                                {/* <Typography variant="caption" sx={{ fontWeight: 600 }}>Documents</Typography> */}
                                <Button
                                    component="label"
                                    role={undefined}
                                    variant={hasDocs ? "outlined" : "contained"}
                                    tabIndex={-1}
                                    startIcon={hasDocs ? <CheckCircleIcon color="success" /> : <CloudUploadOutlinedIcon />}
                                    color={hasDocs ? "success" : "primary"}
                                >
                                    {hasDocs ? "Add more Docs" : "Upload Documents"}
                                    <VisuallyHiddenInput
                                        type="file"
                                        multiple
                                        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                        onChange={(event) => {
                                            const newFiles = Array.from(event.target.files ?? []);
                                            setUploadedFiles((prev) => [...prev, ...newFiles]);
                                            event.target.value = "";
                                        }}
                                    />
                                </Button>
                                {renderUploadedFiles(documentFiles)}
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, pl: { sm: 1 }, pt: { xs: 1, sm: 0 } }}>
                                {/* <Typography variant="caption" sx={{ fontWeight: 600 }}>Images</Typography> */}
                                <Button
                                    component="label"
                                    role={undefined}
                                    variant={hasImages ? "outlined" : "contained"}
                                    tabIndex={-1}
                                    startIcon={hasImages ? <CheckCircleIcon color="success" /> : <CloudUploadOutlinedIcon />}
                                    color={hasImages ? "success" : "primary"}
                                >
                                    {hasImages ? "Add more Images" : "Upload Images"}
                                    <VisuallyHiddenInput
                                        type="file"
                                        multiple
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={(event) => {
                                            const newFiles = Array.from(event.target.files ?? []);
                                            setUploadedFiles((prev) => [...prev, ...newFiles]);
                                            event.target.value = "";
                                        }}
                                    />
                                </Button>
                                {renderUploadedFiles(imageFiles)}
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
                            {isDragging && (
                                <Typography variant="caption" color="primary">
                                    Drop files to upload
                                </Typography>
                            )}
                            {uploadedFiles.length > 0 && (
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    {uploadedFiles.length} file{uploadedFiles.length > 1 ? "s" : ""} selected
                                </Typography>
                            )}
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            mt: 1,
                            flexGrow: 1,
                            display: "flex",
                            flexDirection: "column"
                        }}
                    >
                        <TextareaAutosize
                            minRows={4}
                            placeholder="Comments / Remarks"
                            style={{
                                width: "100%",
                                // flexGrow: 1,
                                padding: "10px",
                                borderColor: "#ccc",
                                borderRadius: "4px",
                                fontFamily: "inherit",
                                resize: "vertical"
                            }}
                        />
                    </Box>


                    {/* Full-width row: Charges */}
                    <Box
                        component={Paper}
                        elevation={3}
                        sx={{
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            gridColumn: { xs: "span 1", md: "span 1" },
                            border: "1px solid #000000",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                mb: 1,
                                // borderBottom: "2px solid",
                                // borderColor: "divider",
                            }}
                        >
                            <SectionHeader
                                title="Charges"
                                icon={<AttachMoneyOutlinedIcon sx={{ fontSize: 26 }} />}
                                required={pickupCharges === "yes"}
                            />
                            <Button size="small" startIcon={<AddIcon />} variant="outlined" onClick={handleAddCharge}>
                                Add Charges
                            </Button>
                        </Box>
                        <TableContainer component={Paper} elevation={3} variant="outlined">
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        {chargesColumns.map((col) => (
                                            <TableCell key={col.key} sx={{ fontWeight: 600, whiteSpace: "nowrap", textAlign: "center", px: 1 }}>
                                                {col.label}
                                            </TableCell>
                                        ))}
                                        <TableCell />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow sx={{ height: 16, "& td": { border: 0 } }}>
                                        <TableCell colSpan={chargesColumns.length + 1} sx={{ p: 0 }} />
                                    </TableRow>
                                    {chargeRows.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={chargesColumns.length + 1} align="center" sx={{ py: 3, color: "text.secondary" }}>No records</TableCell>
                                        </TableRow>
                                    ) : (
                                        chargeRows.map((row) => (
                                            <TableRow key={row.id}>
                                                {chargesColumns.map((col) => (
                                                    <TableCell key={col.key} sx={{ minWidth: 100, px: 1, py: 0.5, textAlign: "center" }}>
                                                        <TextField
                                                            size="small" fullWidth
                                                            required={pickupCharges === "yes"}
                                                            value={(row as any)[col.key]}
                                                            onChange={(e) => handleFieldChangeCharge(row.id, col.key, e.target.value)}
                                                        />
                                                    </TableCell>
                                                ))}
                                                <TableCell sx={{ position: 'sticky', right: 0, bgcolor: 'background.paper', zIndex: 1, p: 1, textAlign: 'center' }}>
                                                    <IconButton color="error" size="small" onClick={() => handleRemoveCharge(row.id)}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>



                {/* Full-width row: Cargo Details */}
                <Box
                    component={Paper}
                    elevation={3}
                    sx={{
                        p: 2,
                        display: "flex",
                        flexDirection:"column", gap: 1,
                        gridColumn: { xs: "span 1", md: "span 2" },
                        
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 1
                        }}
                    >
                        <SectionHeader
                            title="Cargo Details"
                            icon={<AirportShuttleOutlinedIcon sx={{ fontSize: 26 }} />}
                        />
                        <Button size="small" startIcon={<AddIcon />} variant="outlined" onClick={handleAddCargo}>
                            Add Cargo Detail
                        </Button>
                    </Box>
                    <TableContainer
                        component={Paper}
                        variant="outlined"
                        
                    >
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    {columns.map((col) => (
                                        <TableCell
                                            key={col.key}
                                            sx={{
                                                fontWeight: 600,
                                                whiteSpace: "nowrap",
                                                px: 1,
                                                textAlign: "center"
                                            }}
                                        >
                                            {col.icon ? (
                                                <Tooltip title={col.label} arrow>
                                                    <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>{col.icon}</Box>
                                                </Tooltip>
                                            ) : (
                                                <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {col.label}
                                                </Box>
                                            )}
                                            {col.required && <Box component="span" sx={{ color: "error.main" }}> *</Box>}
                                        </TableCell>
                                    ))}
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow sx={{ height: 16, "& td": { border: 0 } }}>
                                    <TableCell colSpan={columns.length + 1} sx={{ p: 0 }} />
                                </TableRow>
                                {cargoRows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 3, color: "text.secondary" }}>No records</TableCell>
                                    </TableRow>
                                ) : (
                                    cargoRows.map((row) => (
                                        <TableRow key={row.id}>
                                            {columns.map((col) => (
                                                <TableCell key={col.key} sx={{ minWidth: col.type === "checkbox" ? 30 : 60, px: 1, py: 0.5, textAlign: col.type === "checkbox" ? "center" : "left" }}>
                                                    {col.type === "checkbox" ? (
                                                        <Checkbox
                                                            size="small"
                                                            checked={!!(row as any)[col.key]}
                                                            onChange={(e) => handleFieldChangeCargo(row.id, col.key, e.target.checked)}
                                                        />
                                                    ) : col.type === "select" ? (
                                                        <Select
                                                            size="small" fullWidth displayEmpty
                                                            value={(row as any)[col.key]}
                                                            onChange={(e) => handleFieldChangeCargo(row.id, col.key, e.target.value)}
                                                        >
                                                            <MenuItem value=""><em>Select</em></MenuItem>
                                                            {packageTypes.map((opt) => (
                                                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                                            ))}
                                                        </Select>
                                                    ) : (
                                                        <TextField
                                                            size="small" fullWidth
                                                            value={(row as any)[col.key]}
                                                            disabled={readOnlyFields.includes(col.key)}
                                                            sx={readOnlyFields.includes(col.key) ? { "& .MuiOutlinedInput-root": { bgcolor: "grey.200" } } : undefined}
                                                            onChange={(e) => handleFieldChangeCargo(row.id, col.key, e.target.value)}
                                                        />
                                                    )}
                                                </TableCell>
                                            ))}
                                            <TableCell sx={{ position: 'sticky', right: 0, bgcolor: 'background.paper', zIndex: 1, p: 1, textAlign: 'center' }}>
                                                <IconButton color="error" size="small" onClick={() => handleRemoveCargo(row.id)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>


            </Box>
        </Stack>
    );
}

export default CreateStockPage;
