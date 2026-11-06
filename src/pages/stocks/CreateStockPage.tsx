import { Avatar,Alert, Box, Button, Checkbox, Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, IconButton, MenuItem, Paper, Radio, RadioGroup, Select, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextareaAutosize, TextField, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import DangerousOutlinedIcon from '@mui/icons-material/DangerousOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import MedicationOutlinedIcon from '@mui/icons-material/MedicationOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import CargoSvg from '../../assets/Cargo_svg.svg';
import React, { forwardRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import { styled } from "@mui/material/styles";
import type { TextFieldProps } from "@mui/material";
import PhoneInput, { getCountries } from "react-phone-number-input";
import type { Value } from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";
import "react-phone-number-input/style.css";
import { createContact } from "../master/contact-list/services/contact.service";
import type { CreateContactRequest } from "../master/contact-list/types/contact.types";
import type { StockCargoColumn, 
              StockCargoRow, 
              StockChargeColumn, 
              StockChargeRow, 
              StockCreatePageProps, 
              StockSectionHeaderProps 
            } from "./types/Stocks.types";

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

const PhoneInputField = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => (
    <TextField label="Telephone" {...props} inputRef={ref} />
));
PhoneInputField.displayName = "PhoneInputField";

const SECTION_HEADER_SX = {
    display: "flex",
    alignItems: "center",
    color: "primary",
    borderBottom: "2px solid",
    borderColor: "divider",
    pb: 0.75,
} as const;

function SectionHeader({ title, icon, required = false }: StockSectionHeaderProps) {
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

const cargoDetailsEmptyRow = (): StockCargoRow => ({
    id: crypto.randomUUID(),
    length: "", width: "", height: "", pieces: "", weight: "",
    dg: false, repackingRequired: false, medicine: false, packageType: "",
    cbm: "", cwtAir: "", cwtCourier: "", whl: "",
});

const readOnlyFields = ["cbm", "cwtAir", "cwtCourier"];

const columns: StockCargoColumn[] = [
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

const chargesEmptyRow = (): StockChargeRow => ({
    id: crypto.randomUUID(),
    description: "", agent: "", invoiceNo: "", currency: "", charges: "",
});

const chargesColumns: StockChargeColumn[] = [
    { key: "description", label: "Description", type: "text" },
    { key: "agent", label: "Agent", type: "text" },
    { key: "invoiceNo", label: "Invoice No", type: "text" },
    { key: "currency", label: "Currency", type: "text" },
    { key: "charges", label: "Charges", type: "text" },
];

//* For Date Fields
const hidePlaceholderSx = (hasValue: boolean) => ({
  '& input[type="date"]::-webkit-datetime-edit': {
    color: hasValue ? 'inherit' : 'transparent',
    WebkitTextFillColor: hasValue ? 'inherit' : 'transparent',
  },
  '& input[type="date"]:focus::-webkit-datetime-edit': {
    color: 'inherit',
    WebkitTextFillColor: 'inherit',
  },
});


function CreateStockPage({ onChange }: StockCreatePageProps) {
    const theme = useTheme();
    //* Below 900px (md) tables are replaced with stacked cards
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const [supplier, setSupplier] = useState("");
    const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);
    const [isSavingSupplier, setIsSavingSupplier] = useState(false);
    const [supplierForm, setSupplierForm] = useState({ companyName: "", email: "", phone: "", country: "" });
    const [supplierSnackbar, setSupplierSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });

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

    const handleFieldChangeCargo = (id: string, key: keyof StockCargoRow, value: StockCargoRow[keyof StockCargoRow]) => {
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

    const handleFieldChangeCharge = (id: string, key: keyof StockChargeRow, value: string) => {
        const next = chargeRows.map((r) => (r.id === id ? { ...r, [key]: value } : r));
        setChargeRows(next);
        onChange?.({ charges: next });
    };

    const hasDocs = uploadedFiles.some(f => !f.type.startsWith('image/'));
    const hasImages = uploadedFiles.some(f => f.type.startsWith('image/'));
    const documentFiles = uploadedFiles.filter(f => !f.type.startsWith('image/'));
    const imageFiles = uploadedFiles.filter(f => f.type.startsWith('image/'));



    const [arrivalDate, setArrivalDate] = useState('');
    const [entryDate, setEntryDate] = useState('');

    const handleCreateSupplier = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSavingSupplier(true);
        try {
            const supplierContact: CreateContactRequest = {
                groupId: "Supplier",
                companyName: supplierForm.companyName,
                email: supplierForm.email,
                phone: supplierForm.phone,
                country: supplierForm.country,
            };
            await createContact(supplierContact);
            setSupplier(supplierForm.companyName);
            setSupplierForm({ companyName: "", email: "", phone: "", country: "" });
            setSupplierDialogOpen(false);
            setSupplierSnackbar({ open: true, message: "Supplier contact created.", severity: "success" });
        } catch (error: unknown) {
            const message =
                (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                "Failed to create supplier contact. Please try again.";
            setSupplierSnackbar({ open: true, message, severity: "error" });
        } finally {
            setIsSavingSupplier(false);
        }
    };

    const renderUploadedFiles = (files: File[]) => files.length > 0 && (
        <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignContent: 'flex-start',
            gap: 0.5,
        }}>
            {files.map((file) => {
                const fileIndex = uploadedFiles.indexOf(file);

                return (
                    <Tooltip disableInteractive key={`${file.name}-${fileIndex}`} title={file.name}>
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
                                maxWidth: '100%',
                                minWidth: 0,
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
                                    maxWidth: { xs: 160, sm: 180 },
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

    /* ---------- Shared cargo field renderer (table cell + mobile card) ---------- */
    const renderCargoField = (row: StockCargoRow, col: StockCargoColumn, withLabel = false) => {
        const label = withLabel ? `${col.label}${col.required ? " *" : ""}` : undefined;

        if (col.type === "select") {
            if (withLabel) {
                return (
                    <TextField
                        select size="small" fullWidth label={label}
                        value={row[col.key]}
                        onChange={(e) => handleFieldChangeCargo(row.id, col.key, e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        SelectProps={{ displayEmpty: true }}
                    >
                        <MenuItem value=""><em>Select</em></MenuItem>
                        {packageTypes.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                        ))}
                    </TextField>
                );
            }
            return (
                <Select
                    size="small" fullWidth displayEmpty
                    value={row[col.key]}
                    onChange={(e) => handleFieldChangeCargo(row.id, col.key, e.target.value)}
                >
                    <MenuItem value=""><em>Select</em></MenuItem>
                    {packageTypes.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                </Select>
            );
        }

        const isReadOnly = readOnlyFields.includes(col.key);
        return (
            <TextField
                size="small" fullWidth
                label={label}
                value={String(row[col.key])}
                disabled={isReadOnly}
                sx={isReadOnly ? { "& .MuiOutlinedInput-root": { bgcolor: "grey.200" } } : undefined}
                onChange={(e) => handleFieldChangeCargo(row.id, col.key, e.target.value)}
            />
        );
    };

    /* ---------- Mobile cards ---------- */
    const renderCargoCard = (row: StockCargoRow, index: number) => (
        <Paper key={row.id} variant="outlined" sx={{ p: 1.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Cargo #{index + 1}</Typography>
                <IconButton color="error" size="small" onClick={() => handleRemoveCargo(row.id)} aria-label="Remove cargo detail">
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
                {columns.filter((c) => c.type !== "checkbox").map((col) => (
                    <Box
                        key={col.key}
                        sx={{ gridColumn: col.type === "select" ? "span 2" : "span 1", minWidth: 0 }}
                    >
                        {renderCargoField(row, col, true)}
                    </Box>
                ))}
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", columnGap: 2, mt: 1 }}>
                {columns.filter((c) => c.type === "checkbox").map((col) => (
                    <FormControlLabel
                        key={col.key}
                        control={
                            <Checkbox
                                size="small"
                                checked={!!row[col.key]}
                                onChange={(e) => handleFieldChangeCargo(row.id, col.key, e.target.checked)}
                            />
                        }
                        label={
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                {col.icon}
                                <Typography variant="body2">{col.label}</Typography>
                            </Box>
                        }
                    />
                ))}
            </Box>
        </Paper>
    );

    const renderChargeCard = (row: StockChargeRow, index: number) => (
        <Paper key={row.id} variant="outlined" sx={{ p: 1.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Charge #{index + 1}</Typography>
                <IconButton color="error" size="small" onClick={() => handleRemoveCharge(row.id)} aria-label="Remove charge">
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
                {chargesColumns.map((col) => (
                    <Box
                        key={col.key}
                        sx={{ gridColumn: col.key === "description" ? "span 2" : "span 1", minWidth: 0 }}
                    >
                        <TextField
                            size="small" fullWidth
                            label={col.label}
                            required={pickupCharges === "yes"}
                            value={row[col.key]}
                            onChange={(e) => handleFieldChangeCharge(row.id, col.key, e.target.value)}
                        />
                    </Box>
                ))}
            </Box>
        </Paper>
    );

    return (
        <Stack sx={{ width: "100%", minWidth: 0 }}>
            {/* Page header */}
            <Box
                sx={{
                    display: "flex", flexDirection: "row", flexWrap: "wrap",
                    justifyContent: "space-between", alignItems: "center",
                    gap: 1.5, mb: 2,
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: 600,}}>
                    Create Stock
                </Typography>
                <Box sx={{ display: "flex", gap: { xs: 1, sm: 2 }, width: { xs: "100%", sm: "auto" } }}>
                    <Button variant="outlined" color="error" sx={{ flex: { xs: 1, sm: "none" } }}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" sx={{ flex: { xs: 1, sm: "none" } }}>
                        Save
                    </Button>
                </Box>
            </Box>

            {/* minmax(0, …) lets grid columns shrink so wide content can't push the page sideways */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) minmax(0, 2fr)" },
                    gap: { xs: 1.5, md: 0.5 },
                    width: "100%",
                }}
            >
                {/* Column 1: Stock entry details */}
                <Box component={Paper} elevation={3} sx={{ p: { xs: 1.5, sm: 2 }, display: "flex", flexDirection: "column", gap: 1.5, minWidth: 0 }}>
                    <Box sx={{ mb: 1 }}>
                        <SectionHeader
                            title="Stock Details"
                            icon={<Inventory2OutlinedIcon sx={{ fontSize: 26 }} />}
                        />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Box>
                            <TextField size="small" label="Station" fullWidth required />
                        </Box>
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1 }}>
                            <TextField size="small" label="Vessel" fullWidth required />
                            <TextField size="small" label="Client" fullWidth required disabled />
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <TextField
                                    size="small"
                                    label="Supplier"
                                    fullWidth
                                    required
                                    value={supplier}
                                    onChange={(event) => setSupplier(event.target.value)}
                                />
                                <Tooltip title="Create supplier contact" disableInteractive>
                                    <IconButton
                                        color="primary"
                                        size="small"
                                        aria-label="Create supplier contact"
                                        onClick={() => setSupplierDialogOpen(true)}
                                        sx={{
                                            width: 20,
                                            height: 30,
                                            flexShrink: 0,
                                            border: 0.5,
                                            borderColor: "primary.main",
                                            "&:hover": {
                                                bgcolor: "primary.main",
                                                color: "primary.contrastText",
                                            },
                                        }}
                                    >
                                        <AddIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <TextField size="small" label="PO Number" fullWidth required />
                            <TextField size="small" label="Arrival Date" fullWidth required  type="date" value={arrivalDate}
                                onChange={(e) => setArrivalDate(e.target.value)}
                                sx={hidePlaceholderSx(!!arrivalDate)}/>
                            <TextField size="small" label="Entry Date" fullWidth required disabled type="date" value={entryDate}
                                onChange={(e) => setEntryDate(e.target.value)}
                                sx={hidePlaceholderSx(!!entryDate)}/>
                            <TextField size="small" label="Country of Origin" fullWidth required />
                            <TextField size="small" label="Cargo Status" fullWidth required />
                            <TextField size="small" label="Cargo Description" fullWidth />
                            <TextField size="small" label="HS Code" fullWidth required />
                            <TextField size="small" label="Currency" fullWidth required />
                            <TextField size="small" label="Cargo Value" fullWidth />
                            <TextField size="small" label="Mode of Arrival" fullWidth required />
                            <TextField size="small" label="EU Reference" fullWidth required />
                            <TextField size="small" label="Transit ID No" fullWidth required />
                            <TextField size="small" label="Storage Type" fullWidth />
                        </Box>
                    </Box>
                </Box>

                {/* Column 2: Attachments & charges */}
                <Box
                    component={Paper}
                    elevation={3}
                    sx={{
                        p: { xs: 1, sm: 1.5 },
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.2,
                        minWidth: 0,
                        // Only cap the height on desktop; on mobile let the page scroll naturally
                        maxHeight: { xs: "none", md: 495 },
                        overflowY: { xs: "visible", md: "auto" },
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <SectionHeader
                            title="Attachments & Charges"
                            icon={<Inventory2OutlinedIcon sx={{ fontSize: 26 }} />}
                        />
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: { xs: "flex-start", sm: "center" },
                            flexWrap: "wrap",
                            columnGap: 2,
                            mt: 0.5,
                        }}
                    >
                        <FormControl sx={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                            <FormLabel>Pickup Charges</FormLabel>
                            <RadioGroup
                                row
                                value={pickupCharges}
                                onChange={(event) => setPickupCharges(event.target.value)}
                                name="charges"
                                sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1, ml: { xs: 0, sm: 2 } }}
                            >
                                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                <FormControlLabel value="no" control={<Radio />} label="No" />
                            </RadioGroup>
                        </FormControl>

                        <FormControlLabel control={<Checkbox />} label="Fumigation" />
                    </Box>

                    <Box
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            mt: 1,
                            border: isDragging ? '2px dashed' : '2px dashed transparent',
                            borderColor: isDragging ? 'primary.main' : 'transparent',
                            bgcolor: isDragging ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
                            borderRadius: 1,
                            p: isDragging ? 1 : 0,
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 1.5 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 1, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1, minWidth: 0 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Documents</Typography>
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
                                {documentFiles.length > 0 ? renderUploadedFiles(documentFiles) : (
                                    <Typography variant="caption" color="text.secondary">No documents uploaded</Typography>
                                )}
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 1, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1, minWidth: 0 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Images</Typography>
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
                                {imageFiles.length > 0 ? renderUploadedFiles(imageFiles) : (
                                    <Typography variant="caption" color="text.secondary">No images uploaded</Typography>
                                )}
                            </Box>
                        </Box>

                        {isDragging && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
                                <Typography variant="caption" color="primary">
                                    Drop files to upload
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    <Box sx={{ mt: 0.5, display: "flex", flexDirection: "column" }}>
                        <TextareaAutosize
                            minRows={3}
                            placeholder="Comments / Remarks"
                            style={{
                                width: "100%",
                                boxSizing: "border-box",
                                padding: "10px",
                                borderColor: "#ccc",
                                borderRadius: "10px",
                                fontFamily: "inherit",
                                resize: "vertical",
                            }}
                        />
                    </Box>

                    {/* Charges */}
                    <Box
                        component={Paper}
                        elevation={3}
                        sx={{
                            p: 1,
                            mt: 0.5,
                            display: "flex",
                            flexDirection: "column",
                            border: "1px solid #000000",
                            minWidth: 0,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                                gap: 1,
                                mb: 1,
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

                        {isMobile ? (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                {chargeRows.length === 0 ? (
                                    <Typography align="center" color="text.secondary" sx={{ py: 3 }}>No records</Typography>
                                ) : (
                                    chargeRows.map((row, i) => renderChargeCard(row, i))
                                )}
                            </Box>
                        ) : (
                            <TableContainer component={Paper} elevation={3} variant="outlined" sx={{ overflowX: "auto" }}>
                                <Table size="small" sx={{ minWidth: 650 }}>
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
                                                                value={row[col.key]}
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
                        )}
                    </Box>
                </Box>

                {/* Full-width row: Cargo Details */}
                <Box
                    component={Paper}
                    elevation={3}
                    sx={{
                        p: { xs: 1.5, sm: 2 },
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        minWidth: 0,
                        gridColumn: { xs: "span 1", md: "span 2" },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 1,
                        }}
                    >
                        <SectionHeader
                            title="Cargo Details"
                            icon={<Box component="img" src={CargoSvg} alt="Cargo" sx={{ width: 48, height: 30 }} />}
                        />
                        <Button size="small" startIcon={<AddIcon />} variant="outlined" onClick={handleAddCargo}>
                            Add Cargo Detail
                        </Button>
                    </Box>

                    {isMobile ? (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                            {cargoRows.length === 0 ? (
                                <Typography align="center" color="text.secondary" sx={{ py: 3 }}>No records</Typography>
                            ) : (
                                cargoRows.map((row, i) => renderCargoCard(row, i))
                            )}
                        </Box>
                    ) : (
                        <TableContainer component={Paper} variant="outlined" sx={{ overflowX: "auto" }}>
                            <Table size="small" sx={{ minWidth: 1100 }}>
                                <TableHead>
                                    <TableRow>
                                        {columns.map((col) => (
                                            <TableCell
                                                key={col.key}
                                                sx={{
                                                    fontWeight: 600,
                                                    whiteSpace: "nowrap",
                                                    px: 1,
                                                    textAlign: "center",
                                                }}
                                            >
                                                {col.icon ? (
                                                    <Tooltip disableInteractive title={col.label} arrow>
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
                                                                checked={row[col.key] as boolean}
                                                                onChange={(e) => handleFieldChangeCargo(row.id, col.key, e.target.checked)}
                                                            />
                                                        ) : (
                                                            renderCargoField(row, col)
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
                    )}
                </Box>
            </Box>

            <Dialog
                open={supplierDialogOpen}
                onClose={() => {
                    if (!isSavingSupplier) setSupplierDialogOpen(false);
                }}
                fullWidth
                maxWidth="sm"
                slotProps={{ paper: { sx: { minHeight: 200 } } }}
                sx={{ mb:40 }}
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                        pb: 2,
                        borderBottom: 1,
                        borderColor: "divider",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar
                            variant="rounded"
                            sx={{
                                bgcolor: "primary.main",
                                color: "primary.contrastText",
                                width: 44,
                                height: 44,
                            }}
                        >
                            <LocalShippingOutlinedIcon />
                        </Avatar>
                        <Typography variant="h6" component="span" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                            New Supplier
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                        <Button
                            variant="outlined"
                            color="error"
                            disabled={isSavingSupplier}
                            onClick={() => {
                                setSupplierDialogOpen(false);
                                setSupplierForm({ companyName: "", email: "", phone: "", country: "" });
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            form="create-supplier-form"
                            variant="contained"
                            disabled={isSavingSupplier}
                        >
                            {isSavingSupplier ? "Saving…" : "Create"}
                        </Button>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box
                        component="form"
                        id="create-supplier-form"
                        onSubmit={handleCreateSupplier}
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            gap: 2,
                            pt: 1,
                            mt:1,
                        }}
                    >
                        <TextField
                            label="Name"
                            value={supplierForm.companyName}
                            onChange={(event) => setSupplierForm((current) => ({ ...current, companyName: event.target.value }))}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Email"
                            type="email"
                            value={supplierForm.email}
                            onChange={(event) => setSupplierForm((current) => ({ ...current, email: event.target.value }))}
                            required
                            fullWidth
                        />
                        <Box
                            sx={{
                                minWidth: 0, // prevents the phone input from overflowing its grid cell
                                "& .PhoneInput": { display: "flex", width: "100%" },
                                "& .PhoneInputCountry": { mr: 1 },
                            }}
                        >
                            <PhoneInput
                                international
                                value={supplierForm.phone as Value}
                                onChange={(phone) => setSupplierForm((current) => ({ ...current, phone: phone || "" }))}
                                inputComponent={PhoneInputField}
                                required
                                style={{ width: "100%" }}
                            />
                        </Box>
                        <TextField
                            select
                            label="Country"
                            value={supplierForm.country}
                            onChange={(event) => setSupplierForm((current) => ({ ...current, country: event.target.value }))}
                            fullWidth
                        >
                            {getCountries().map((countryCode) => (
                                <MenuItem key={countryCode} value={countryCode}>
                                    {(en as Record<string, string>)[countryCode] || countryCode}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </DialogContent>
                
            </Dialog>
            <Snackbar
                open={supplierSnackbar.open}
                autoHideDuration={4000}
                onClose={() => setSupplierSnackbar((current) => ({ ...current, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSupplierSnackbar((current) => ({ ...current, open: false }))}
                    severity={supplierSnackbar.severity}
                    variant="filled"
                >
                    {supplierSnackbar.message}
                </Alert>
            </Snackbar>

        </Stack>
    );
}

export default CreateStockPage;
