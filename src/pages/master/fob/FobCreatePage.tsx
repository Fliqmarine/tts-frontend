import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    IconButton,
    InputAdornment,
    MenuItem,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/Delete";

import {
    CLIENT_TYPES,
    COUNTRIES,
    CURRENCIES,
    DEFAULT_FOB_TEMPLATE,
    getClientTypeLabel,
    getCurrency,
} from "./types/fob.types";
import type { CreateFobPayload, FobItem, FobSection, FobSectionKey } from "./types/fob.types";
import { createFob, getErrorMessage } from "./services/fob.api";

/* ----------------------------- Form state ----------------------------- */

type FormRow = { id: string; description: string; rate: string; remarks: string };
type FormSection = { key: FobSectionKey; title: string; rows: FormRow[] };
type FormErrors = { clientType?: string; country?: string; currency?: string; form?: string };

let rowCounter = 0;
const nextId = () => `row-${++rowCounter}`;
const emptyRow = (): FormRow => ({ id: nextId(), description: "", rate: "", remarks: "" });

const buildFormSections = (): FormSection[] =>
    DEFAULT_FOB_TEMPLATE.map((s) => ({
        key: s.key,
        title: s.title,
        rows: s.items.map((i) => ({
            id: nextId(),
            description: i.description,
            rate: i.rate === null ? "" : String(i.rate),
            remarks: i.remarks,
        })),
    }));

/* ------------------------------ Styling -------------------------------- */

// Palette taken from the FLIQ Marine letterhead
const PRIMARY = "#3D5AFE";
const NAVY = "#1e2a5e";
const HEADING_BG = "#e9eefb"; // card heading bars
const SECTION_BG = "#c6d8fa"; // section title rows in the table
const GRID = "1px solid #c9ced6";
const cellSx = { border: GRID, p: 0, verticalAlign: "middle" } as const;

const cellInputSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: 0,
        fontSize: 14,
        "& fieldset": { border: "none" },
        "&:hover": { backgroundColor: "#f5f8ff" },
        "&.Mui-focused": { backgroundColor: "#fff", outline: "2px solid #1a56db", outlineOffset: -2 },
    },
    "& .MuiOutlinedInput-input": { py: 0.1, px: 1 },
} as const;

const cardSx = { borderRadius: 2, borderColor: "#d7ddea", bgcolor: "#fff", overflow: "hidden" } as const;

/** Card with a coloured heading bar on top and padded content below */
function Card({
    title,
    action,
    children,
    sx,
}: {
    title: string;
    action?: ReactNode;
    children: ReactNode;
    sx?: object;
}) {
    return (
        <Paper variant="outlined" sx={{ ...cardSx, ...sx }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    px: { xs: 2, md: 3 },
                    py: 1.5,
                    bgcolor: HEADING_BG,
                    borderBottom: "1px solid #d7ddea",
                    borderLeft: `4px solid ${PRIMARY}`,
                }}
            >
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: NAVY }}>
                    {title}
                </Typography>
                {action}
            </Box>
            <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>
        </Paper>
    );
}

/* ------------------------------- Page --------------------------------- */

export default function FobCreatePage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Pre-fill from the index page ("Create FOB for this selection")
    const initialClient = searchParams.get("clientType") ?? "";
    const initialCountry = searchParams.get("country");

    const [clientType, setClientType] = useState<string>(
        CLIENT_TYPES.some((c) => c.value === initialClient) ? initialClient : ""
    );
    const [country, setCountry] = useState<string | null>(
        initialCountry && COUNTRIES.includes(initialCountry) ? initialCountry : null
    );
    const [currencyCode, setCurrencyCode] = useState<string>("");
    const [sections, setSections] = useState<FormSection[]>(buildFormSections);

    const [errors, setErrors] = useState<FormErrors>({});
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });

    const currency = useMemo(() => getCurrency(currencyCode), [currencyCode]);
    const ready = Boolean(clientType && country && currency);

    /* ---- row helpers ---- */
    const updateRow = (key: FobSectionKey, id: string, patch: Partial<FormRow>) =>
        setSections((prev) =>
            prev.map((s) =>
                s.key === key ? { ...s, rows: s.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)) } : s
            )
        );

    const addRow = (key: FobSectionKey) =>
        setSections((prev) => prev.map((s) => (s.key === key ? { ...s, rows: [...s.rows, emptyRow()] } : s)));

    const removeRow = (key: FobSectionKey, id: string) =>
        setSections((prev) =>
            prev.map((s) => (s.key === key ? { ...s, rows: s.rows.filter((r) => r.id !== id) } : s))
        );

    const changeRate = (key: FobSectionKey, id: string, value: string) => {
        if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) updateRow(key, id, { rate: value });
    };

    /* ---- save ---- */
    const handleSave = async () => {
        const nextErrors: FormErrors = {};
        if (!clientType) nextErrors.clientType = "Select a client type";
        if (!country) nextErrors.country = "Select a country";
        if (!currency) nextErrors.currency = "Select a currency";

        // Build the payload from the form rows
        const payloadSections: FobSection[] = [];
        let hasRate = false;
        let rowProblem = "";

        for (const s of sections) {
            const items: FobItem[] = [];
            for (const r of s.rows) {
                const description = r.description.trim();
                const rate = r.rate.trim();
                const remarks = r.remarks.trim();

                if (!description && !rate && !remarks) continue; // blank row, skip

                if (!description) {
                    rowProblem = `"${s.title}" has a row with a rate or remarks but no description.`;
                    continue;
                }
                if (rate !== "" && !Number.isFinite(Number(rate))) {
                    rowProblem = `"${s.title}" has a row with an invalid rate.`;
                    continue;
                }
                if (rate !== "") hasRate = true;
                items.push({ description, rate: rate === "" ? null : Number(rate), remarks });
            }
            if (items.length) payloadSections.push({ key: s.key, title: s.title, items });
        }

        if (rowProblem) nextErrors.form = rowProblem;
        else if (!hasRate) nextErrors.form = "Enter at least one rate before saving.";

        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) return;
        if (!country || !currency) return;

        const payload: CreateFobPayload = {
            clientType,
            country,
            currency: currency.code,
            sections: payloadSections,
        };

        try {
            setSaving(true);
            await createFob(payload);
            setToast({ open: true, message: "FOB saved", severity: "success" });
            // Go to the index page already filtered to what was just saved
            navigate(
                `/master/fob?clientType=${encodeURIComponent(payload.clientType)}&country=${encodeURIComponent(payload.country)}`
            );
        } catch (err) {
            setToast({ open: true, message: getErrorMessage(err), severity: "error" });
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setSections(buildFormSections());
        setErrors({});
    };

    return (
        <Box>
            {/* Page heading banner */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: { xs: "stretch", md: "center" },
                    justifyContent: "space-between",
                    gap: 2,
                    width: "100%",
                    mb: 3,
                }}
            >
                <Box sx={{ display: "flex", gap: 1.5 }}>
                    <Typography
                        variant="h5" sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.2 }}
                    >
                        Create FOB
                    </Typography>
                </Box>
                <Button variant="outlined" color="error" onClick={() => navigate("/master/fob")} disabled={saving}>
                    Cancel
                </Button>
                
            </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        alignItems: { xs: "stretch", md: "center" },
                        gap: 2,
                        width: "100%",
                        maxWidth: { md: 760 },
                        mb:1
                        // ml: { md: "auto" },
                    }}
                >
                    <TextField
                        select
                        fullWidth
                        size="small"
                        sx={{ bgcolor: "#fff", borderRadius: 1 }}
                        label="Client type"
                        value={clientType}
                        onChange={(e) => setClientType(e.target.value)}
                        error={Boolean(errors.clientType)}
                        helperText={errors.clientType}
                    >
                        {CLIENT_TYPES.map((c) => (
                            <MenuItem key={c.value} value={c.value}>
                                {c.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Autocomplete
                        fullWidth
                        size="small"
                        sx={{ bgcolor: "#fff", borderRadius: 1 }}
                        options={COUNTRIES}
                        value={country}
                        onChange={(_, value) => {
                            setCountry(value);
                            setCurrencyCode("");
                            setErrors((current) => ({ ...current, country: undefined, currency: undefined }));
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Country"
                                error={Boolean(errors.country)}
                                helperText={errors.country}
                            />
                        )}
                    />

                    <TextField
                        select
                        fullWidth
                        size="small"
                        sx={{ bgcolor: "#fff", borderRadius: 1 }}
                        label="Currency"
                        value={currencyCode}
                        onChange={(e) => setCurrencyCode(e.target.value)}
                        disabled={!country}
                        error={Boolean(errors.currency)}
                        helperText={errors.currency}
                    >
                        {CURRENCIES.map((c) => (
                            <MenuItem key={c.code} value={c.code}>
                                {c.code} — {c.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>


            {!ready && (
                <Paper variant="outlined" sx={{ ...cardSx, p: 3, textAlign: "center" }}>
                    <Typography color="text.secondary">
                        Select a client type, country and currency to start entering rates.
                    </Typography>
                </Paper>
            )}

            {/* Rate sheet */}
            {ready && (
                <Card
                    title="FOB Selling Charges – Air Export"
                    action={
                        <Chip
                            size="small"
                            label={`${getClientTypeLabel(clientType)} · ${country} · ${currency?.code}`}
                            sx={{ bgcolor: NAVY, color: "#fff", fontWeight: 600 }}
                        />
                    }
                >
                    {errors.form && (
                        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrors((e) => ({ ...e, form: undefined }))}>
                            {errors.form}
                        </Alert>
                    )}

                    <TableContainer sx={{ border: GRID, borderRadius: 0.8 }}>
                        <Table size="small" sx={{ minWidth: 760, borderCollapse: "collapse" }}>
                            <TableHead>
                                <TableRow >
                                    <TableCell
                                        sx={{ ...cellSx, px: 1.5, py: 1, fontWeight: 700, width: "38%", textAlign: "center" }}
                                    >
                                        Description
                                    </TableCell>
                                    <TableCell
                                        sx={{ ...cellSx, px: 1.5, py: 1, fontWeight: 700, width: "18%", textAlign: "center" }}
                                    >
                                        Rate
                                    </TableCell>
                                    <TableCell sx={{ ...cellSx, px: 1.5, py: 1, fontWeight: 700, textAlign: "center" }}>
                                        Remarks
                                    </TableCell>
                                    <TableCell sx={{ ...cellSx, width: 48}} />
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {sections.map((section) => (
                                    <SectionRows
                                        key={section.key}
                                        section={section}
                                        currencySymbol={currency?.symbol ?? ""}
                                        onChange={updateRow}
                                        onRateChange={changeRate}
                                        onAdd={addRow}
                                        onRemove={removeRow}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* <Divider sx={{ my: 3 }} /> */}

                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", gap: 1.5, mt: 2 }}>
                        <Button variant="outlined" color="error" onClick={() => navigate("/master/fob")} disabled={saving}>
                            Cancel
                        </Button>
                        <Button variant="outlined" color="inherit" onClick={handleReset} disabled={saving}>
                            Reset
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSave}
                            disabled={saving}
                            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : undefined}
                            sx={{ bgcolor: "primary" }}
                        >
                            {saving ? "Saving..." : "Save FOB"}
                        </Button>
                    </Box>
                </Card>
            )}

            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={() => setToast((t) => ({ ...t, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert severity={toast.severity} variant="filled" onClose={() => setToast((t) => ({ ...t, open: false }))}>
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

/* --------------------------- Section (header + rows) --------------------------- */

type SectionRowsProps = {
    section: FormSection;
    currencySymbol: string;
    onChange: (key: FobSectionKey, id: string, patch: Partial<FormRow>) => void;
    onRateChange: (key: FobSectionKey, id: string, value: string) => void;
    onAdd: (key: FobSectionKey) => void;
    onRemove: (key: FobSectionKey, id: string) => void;
};

function SectionRows({ section, currencySymbol, onChange, onRateChange, onAdd, onRemove }: SectionRowsProps) {
    return (
        <>
            <TableRow sx={{ backgroundColor: SECTION_BG }}>
                <TableCell
                    colSpan={3}
                    sx={{
                        ...cellSx,
                        px: 1.5,
                        py: 1,
                        fontWeight: 700,
                        textAlign: "center",
                        color: NAVY,
                        backgroundColor: SECTION_BG,
                    }}
                >
                    {section.title}
                </TableCell>
                <TableCell sx={{ ...cellSx, textAlign: "center", backgroundColor: SECTION_BG }}>
                    <Tooltip title="Add row" disableInteractive>
                        <IconButton
                            size="small"
                            onClick={() => onAdd(section.key)}
                            aria-label={`Add row to ${section.title}`}
                            sx={{ color: NAVY }}
                        >
                            <AddIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>

            {section.rows.map((r) => (
                <TableRow key={r.id} sx={{ "&:hover": { backgroundColor: "#fafbfd" } }}>
                    <TableCell sx={cellSx}>
                        <TextField
                            fullWidth
                            multiline
                            value={r.description}
                            onChange={(e) => onChange(section.key, r.id, { description: e.target.value })}
                            placeholder="Description"
                            sx={cellInputSx}
                        />
                    </TableCell>
                    <TableCell sx={cellSx}>
                        <TextField
                            fullWidth
                            value={r.rate}
                            onChange={(e) => onRateChange(section.key, r.id, e.target.value)}
                            placeholder="0.00"
                            slotProps={{
                                htmlInput: { inputMode: "decimal" },
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ mr: 0.5 }}>
                                            {currencySymbol}
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={cellInputSx}
                        />
                    </TableCell>
                    <TableCell sx={cellSx}>
                        <TextField
                            fullWidth
                            multiline
                            value={r.remarks}
                            onChange={(e) => onChange(section.key, r.id, { remarks: e.target.value })}
                            placeholder="Remarks"
                            sx={cellInputSx}
                        />
                    </TableCell>
                    <TableCell sx={{ ...cellSx, textAlign: "center" }}>
                        <Tooltip title="Remove row" disableInteractive>
                            <IconButton color="error" size="small" onClick={() => onRemove(section.key, r.id)} aria-label="Remove row">
                                <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
}