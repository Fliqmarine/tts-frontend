import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { CLIENT_TYPES, COUNTRIES, getClientTypeLabel, getCurrency } from "./types/fob.types";
import type { Fob } from "./types/fob.types";
import { getErrorMessage, getFob } from "./services/fob.api";

/* ------------------------------ Styling -------------------------------- */

const GRID = "1px solid #c9ced6";
const cellSx = { border: GRID, px: 1.5, py: 1, fontSize: 14, verticalAlign: "top" } as const;
const paperSx = { p: { xs: 2, md: 3 }, borderRadius: 2, borderColor: "#e2e6ee", bgcolor: "#fff" } as const;

const money = new Intl.NumberFormat("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ------------------------------- Page --------------------------------- */

export default function FobIndexPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // The URL is the source of truth, so a saved link / redirect from the create page just works
    const clientType = searchParams.get("clientType") ?? "";
    const country = searchParams.get("country") ?? "";

    const [lookup, setLookup] = useState<{ key: string; fob: Fob | null; error: string } | null>(null);

    const setFilter = (key: "clientType" | "country", value: string) => {
        const next = new URLSearchParams(searchParams);
        if (value) next.set(key, value);
        else next.delete(key);
        setSearchParams(next, { replace: true });
    };

    const hasSelection = Boolean(clientType && country);
    const lookupKey = hasSelection ? JSON.stringify([clientType, country]) : "";
    const loading = Boolean(lookupKey && lookup?.key !== lookupKey);
    const fob = lookup?.key === lookupKey ? lookup.fob : null;
    const error = lookup?.key === lookupKey ? lookup.error : "";

    // Load the FOB whenever both filters are selected
    useEffect(() => {
        if (!hasSelection) return;

        let cancelled = false;
        getFob({ clientType, country })
            .then((data) => {
                if (!cancelled) setLookup({ key: lookupKey, fob: data, error: "" });
            })
            .catch((err) => {
                if (!cancelled) {
                    setLookup({ key: lookupKey, fob: null, error: getErrorMessage(err) });
                }
            });

        return () => {
            cancelled = true;
        };
    }, [clientType, country, hasSelection, lookupKey]);

    const currency = useMemo(() => (fob ? getCurrency(fob.currency) : undefined), [fob]);

    const goToCreate = () => {
        const params = new URLSearchParams();
        if (clientType) params.set("clientType", clientType);
        if (country) params.set("country", country);
        navigate(`/master/fob/create${params.toString() ? `?${params}` : ""}`);
    };

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#f4f6fa", minHeight: "100%" }}>
            {/* Header */}
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography
                        variant="h5" sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.2 }}
                    >
                        FOB
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={goToCreate}>
                    Create FOB
                </Button>
            </Box>

            {/* Filters */}
            <Paper variant="outlined" sx={{ ...paperSx, mb: 3 }}>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, maxWidth: 640 }}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Client type"
                        value={clientType}
                        onChange={(e) => setFilter("clientType", e.target.value)}
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
                        options={COUNTRIES}
                        value={country || null}
                        onChange={(_, v) => setFilter("country", v ?? "")}
                        renderInput={(params) => <TextField {...params} label="Country" />}
                    />
                </Box>
            </Paper>

            {/* States */}
            {!hasSelection && (

                <Paper variant="outlined" sx={{ ...paperSx, textAlign: "center" }}>
                    <Typography color="text.secondary">
                        Select both a client type and a country to view the FOB.
                    </Typography>
                </Paper>
            )}

            {hasSelection && loading && (

                <Paper variant="outlined" sx={{ ...paperSx, textAlign: "center" }}>
                    <CircularProgress size={28} />
                </Paper>
            )}

            {hasSelection && !loading && error && <Alert severity="error">{error}</Alert>}

            {hasSelection && !loading && !error && !fob && (
                <Paper variant="outlined" sx={{ ...paperSx, textAlign: "center" }}>
                    <Typography sx={{ fontWeight: 600 }}>No FOB found</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                        {getClientTypeLabel(clientType)} · {country} doesn't have charges saved yet.
                    </Typography>
                    <Button variant="outlined" startIcon={<AddIcon />} onClick={goToCreate}>
                        Create FOB for this selection
                    </Button>
                </Paper>
            )}

            {/* Saved FOB (read-only sheet) */}
            {hasSelection && !loading && !error && fob && (
                <Paper variant="outlined" sx={paperSx}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            justifyContent: "space-between",
                            alignItems: { sm: "center" },
                            gap: 0.5,
                            mb: 2,
                        }}
                    >
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                FOB Selling Charges – Air Export
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {getClientTypeLabel(fob.clientType)} · {fob.country} · {fob.currency}
                            </Typography>
                        </Box>
                        
                        <Typography variant="caption" color="text.secondary">
                            Updated {new Date(fob.updatedAt).toLocaleDateString()}
                        </Typography>

                    </Box>

                    <TableContainer sx={{ border: GRID, borderRadius: 1 }}>
                        <Table size="small" sx={{ minWidth: 640, borderCollapse: "collapse" }}>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#e8ecf3" }}>
                                    <TableCell sx={{ ...cellSx, fontWeight: 700, width: "38%" }}>Description</TableCell>
                                    <TableCell sx={{ ...cellSx, fontWeight: 700, width: "18%", textAlign: "right" }}>
                                        Rate ({currency?.symbol ?? fob.currency})
                                    </TableCell>
                                    <TableCell sx={{ ...cellSx, fontWeight: 700 }}>Remarks</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {fob.sections
                                    .filter((s) => s.items.length > 0)
                                    .map((section) => (
                                        <SectionBlock key={section.key} title={section.title} items={section.items} />
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Paper>
            )}
        </Box>
    );
}

/* ------------------------------ Section block ------------------------------ */

function SectionBlock({ title, items }: { title: string; items: Fob["sections"][number]["items"] }) {
    return (
        <>
            <TableRow sx={{ backgroundColor: "#dbe4f5" }}>
                <TableCell colSpan={3} sx={{ ...cellSx, fontWeight: 700 }}>
                    {title}
                </TableCell>
            </TableRow>
            {items.map((item, i) => (
                <TableRow key={`${title}-${i}`} sx={{ "&:hover": { backgroundColor: "#fafbfd" } }}>
                    <TableCell sx={cellSx}>{item.description}</TableCell>
                    <TableCell sx={{ ...cellSx, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                        {item.rate === null ? "—" : money.format(item.rate)}
                    </TableCell>
                    <TableCell sx={cellSx}>{item.remarks}</TableCell>
                </TableRow>
            ))}
        </>
    );
}