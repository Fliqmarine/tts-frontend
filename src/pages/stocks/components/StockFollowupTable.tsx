import {
    Box, Button, Checkbox, Chip, Collapse, IconButton, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Fragment, useState, useRef } from "react";
import type { Filters } from "./StockFollowupFilter";
import { Divider } from "@mui/material"; // add to your existing @mui/material import
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ScaleOutlinedIcon from "@mui/icons-material/ScaleOutlined";
import ViewInArOutlinedIcon from "@mui/icons-material/ViewInArOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";



const demoData = [
    {
        id: 1, station: "Item 1", stock_id: "Pending, vessel: Vessel 1", existing_manifest: "Manifest 1", client: "Client 1", po_no: "PO123", supplier: "2023-08-15", pkgs: 10, weight: 100, cbm: 1.0, value: 1000, transit_no: "Transit 1", arrival_date: "2023-08-15", stock_status: "Pending",
        docs: [
            { name: "invoice.pdf", url: "/files/invoice.pdf" },
            { name: "packing-list.pdf", url: "/files/packing-list.pdf" },
        ] as FileItem[],
        images: [
            { name: "cargo-front.jpg", url: "https://picsum.photos/id/1011/800/600" },
            { name: "cargo-side.jpg", url: "https://picsum.photos/id/1015/800/600" },
            { name: "damage.png", url: "https://picsum.photos/id/1016/800/600" },
        ] as FileItem[],
    },
    {
        id: 2, station: "Item 2", stock_id: "Completed", existing_manifest: "Manifest 2", client: "Client 2", po_no: "PO456", supplier: "2023-08-20", pkgs: 15, weight: 150, cbm: 1.5, value: 1500, transit_no: "Transit 1", arrival_date: "2023-08-20", stock_status: "Completed",
        docs: [{ name: "bill-of-lading.pdf", url: "/files/bol.pdf" }] as FileItem[],
        images: [] as FileItem[],
    },
    {
        id: 3, station: "Item 3", stock_id: "In Progress", existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789", supplier: "2023-08-25", pkgs: 20, weight: 200, cbm: 2.0, value: 2000, transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
];

type FileItem = { name: string; url: string };//* for Doc and Image files, if needed in the future

const openFile = (file: FileItem) => window.open(file.url, "_blank", "noopener,noreferrer");
const downloadFile = async (file: FileItem) => {
    try {
        // fetch as blob so download works even for cross-origin files
        const res = await fetch(file.url);
        const blob = await res.blob();
        const href = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = href;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(href);
    } catch {
        // fallback if fetch is blocked (CORS)
        const a = document.createElement("a");
        a.href = file.url;
        a.download = file.name;
        a.target = "_blank";
        a.click();
    }
};

function FileIcons({ files, type }: { files: FileItem[]; type: "doc" | "image" }) {
    const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    if (!files.length) {
        return <Typography variant="body2" color="text.disabled">—</Typography>;
    }

    // single click = open, double click = download
    const handleClick = (file: FileItem) => {
        if (clickTimer.current) clearTimeout(clickTimer.current);
        clickTimer.current = setTimeout(() => openFile(file), 250);
    };

    const handleDoubleClick = (file: FileItem) => {
        if (clickTimer.current) clearTimeout(clickTimer.current);
        downloadFile(file);
    };

    const Icon = type === "doc" ? PictureAsPdfIcon : PhotoLibraryIcon;
    const color = type === "doc" ? "error.main" : "primary.main"; // red PDF, blue gallery

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
            {files.map((file) => (
                <Tooltip
                    key={file.url}
                    arrow
                    title={
                        <Box>
                            <Typography variant="caption" sx={{ display: "block", fontWeight: 600 }}>{file.name}</Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>Click: open · Double-click: download</Typography>
                        </Box>
                    }
                >
                    <IconButton
                        size="small"
                        onClick={() => handleClick(file)}
                        onDoubleClick={() => handleDoubleClick(file)}
                        sx={{ p: 0.25, color }}
                        aria-label={file.name}
                    >
                        <Icon sx={{ fontSize: 22 }} />
                    </IconButton>
                </Tooltip>
            ))}
        </Box>
    );
}


type Row = (typeof demoData)[number];

interface StockFollowupTableProps {
    filters?: Filters;
}

const statusColor = (status: string) =>
    status === "Completed" ? "success" : status === "Pending" ? "warning" : "info";

// Sticky right column (Actions)
const stickyRight = {
    position: "sticky",
    right: 0,
    bgcolor: "background.paper",
    boxShadow: "-4px 0 6px -4px rgba(0,0,0,0.15)",
    whiteSpace: "nowrap",
} as const;

function DetailItem({ icon, label, value }: { icon?: React.ReactNode; label: string; value: React.ReactNode }) {
    return (
        <Paper
            // elevation={1.5}
            sx={{ display: "flex", alignItems: "center", gap: 1.25, flexShrink: 0,borderRadius: 1.5, px: 1.5, py: 0.75, bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
            {icon && (
                <Box
                    sx={{
                        width: 32, height: 32, borderRadius: 1.5, display: "grid", placeItems: "center",
                        bgcolor: "background.paper", border: "1px solid", borderColor: "divider",
                        color: "primary.main", "& svg": { fontSize: 18 },
                    }}
                >
                    {icon}
                </Box>
            )}
            <Box>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", lineHeight: 1.2, textTransform: "uppercase", letterSpacing: 0.6, fontSize: "0.65rem" }}
                >
                    {label}
                </Typography>
                <Typography component="div" variant="body2" sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                    {value}
                </Typography>
            </Box>
        </Paper>
    );
}

export default function StockFollowupTable({ filters }: StockFollowupTableProps) {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [pages, setPages] = useState(0);
    const [selected, setSelected] = useState<number[]>([]);
    const [expanded, setExpanded] = useState<number[]>([]);

    const searchTerm = filters?.search.trim().toLowerCase() ?? "";
    const filteredData = demoData.filter((row) => {
        const searchableText = [
            row.station, row.stock_id, row.existing_manifest, row.client, row.po_no,
            row.supplier, row.transit_no, row.stock_status,
            ...row.docs.map((f) => f.name),
            ...row.images.map((f) => f.name),
            String(row.pkgs), String(row.weight), String(row.cbm), String(row.value),
        ].join(" ").toLowerCase();

        return (
            searchableText.includes(searchTerm) &&
            (!filters?.client || row.client === filters.client) &&
            (!filters?.station || row.station === filters.station) &&
            (!filters?.supplier || row.supplier === filters.supplier) &&
            (!filters?.po_number || row.po_no === filters.po_number) &&
            (!filters?.transit_number || row.transit_no === filters.transit_number) &&
            (!filters?.status || row.stock_status === filters.status)
        );
    });

    const paginateData = filteredData.slice(pages * rowsPerPage, pages * rowsPerPage + rowsPerPage);

    const currentPageIds = paginateData.map((row) => row.id);
    const allOnPageSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selected.includes(id));
    const someOnPageSelected = currentPageIds.some((id) => selected.includes(id)) && !allOnPageSelected;

    const handleSelectAll = () => {
        if (allOnPageSelected) {
            setSelected((prev) => prev.filter((id) => !currentPageIds.includes(id)));
        } else {
            setSelected((prev) => [...new Set([...prev, ...currentPageIds])]);
        }
    };

    const handleSelectRow = (id: number) =>
        setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    const toggleExpand = (id: number) =>
        setExpanded((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    const handleExport = () => alert(`Exporting ${selected.length} items (Placeholder)`);

    const handleChangePage = (_: unknown, newPage: number) => setPages(newPage);

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPages(0);
    };

    const TOTAL_COLS = 10; // checkbox + expand + 6 data + status + actions

    const renderDetails = (row: Row) => {
        const items = [
            { icon: <Inventory2OutlinedIcon />, label: "Pkgs", value: row.pkgs },
            { icon: <ScaleOutlinedIcon />, label: "Weight", value: `${row.weight.toLocaleString()} kg` },
            { icon: <ViewInArOutlinedIcon />, label: "CBM", value: `${row.cbm.toFixed(2)} m³` },
            { icon: <PaymentsOutlinedIcon />, label: "Value", value: `$${row.value.toLocaleString()}` },
            { icon: <LocalShippingOutlinedIcon />, label: "Transit No", value: row.transit_no },
            { icon: <EventOutlinedIcon />, label: "Arrival Date", value: row.arrival_date },
            { label: "Doc", value: <FileIcons files={row.docs} type="doc" /> },
            { label: "Image", value: <FileIcons files={row.images} type="image" /> },
        ];

        return (
            <Box
                
                sx={{
                    display: "flex",
                    flexWrap: "nowrap",
                    alignItems: "center",
                    gap: 2.5,
                    py: 0.5,
                    px: 1,
                    overflowX: "auto",
                    borderLeft: "4px solid",
                    borderLeftColor: `${statusColor(row.stock_status)}.main`, // matches the status colour
                    borderRight: "4px solid",
                    borderRightColor: `${statusColor(row.stock_status)}.main`, // matches the status colour
                    borderRadius: 2,
                }}
            >
                {items.map((item, i) => (
                    <Fragment key={item.label}>
                        <DetailItem {...item} />
                        {i < items.length - 1 && <Divider orientation="vertical" flexItem />}
                    </Fragment>
                ))}
            </Box>
        );
    };

    return (
        <Box>
            {selected.length > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1, mb: 1, bgcolor: "action.hover", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                        {selected.length} items selected
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button variant="contained" size="small" color="success" startIcon={<FileDownloadOutlinedIcon />} onClick={handleExport} sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 2.5 }}>
                            Export Excel
                        </Button>
                        <Button variant="contained" size="small" color="secondary" startIcon={<FileDownloadOutlinedIcon />} onClick={handleExport} sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 2.5 }}>
                            Export PDF
                        </Button>
                    </Box>
                </Box>
            )}

            <Paper elevation={2} sx={{ mt: 2, borderRadius: "8px 8px 16px 16px", border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
                <TableContainer sx={{ overflowX: "auto" }}>
                    <Table
                        size="small"
                        stickyHeader
                        sx={{
                            minWidth: 900,
                            "& .MuiTableCell-head": {
                                fontWeight: 700,
                                fontSize: "0.72rem",
                                textTransform: "uppercase",
                                letterSpacing: 0.6,
                                color: "text.primary",
                                whiteSpace: "nowrap",
                                bgcolor: "action.hover",
                            },
                            "& .MuiTableCell-body": { fontSize: "0.85rem" },
                            "& .MuiTableBody-root .MuiTableRow-root": {
                                backgroundColor: "background.paper",
                            },
                            "& .MuiTableRow-root.expanded > .MuiTableCell-root": {
                                borderBottom: "none",
                                bgcolor: "action.selected",
                            },
                        }}
                                            >
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox" sx={{ pl: 1.5 }}>
                                    <Checkbox size="small" indeterminate={someOnPageSelected} checked={allOnPageSelected} onChange={handleSelectAll} />
                                </TableCell>
                                <TableCell padding="checkbox" />
                                <TableCell>Station</TableCell>
                                <TableCell>Stock ID</TableCell>
                                <TableCell>Existing Manifest</TableCell>
                                <TableCell>Client</TableCell>
                                <TableCell>PO No</TableCell>
                                <TableCell>Supplier</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right" sx={{ ...stickyRight, zIndex: 4, width: 190, minWidth: 190 }}>
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {paginateData.map((row) => {
                                const isOpen = expanded.includes(row.id);
                                return (
                                    <Fragment key={row.id}>
                                        <TableRow hover selected={selected.includes(row.id)} className={isOpen ? "expanded" : ""}>
                                            <TableCell padding="checkbox" sx={{ pl: 1.5 }}>
                                                <Checkbox size="small" checked={selected.includes(row.id)} onChange={() => handleSelectRow(row.id)} />
                                            </TableCell>
                                            <TableCell padding="checkbox">
                                                <Tooltip title={isOpen ? "Hide details" : "More details"}>
                                                    <IconButton size="small" onClick={() => toggleExpand(row.id)}>
                                                        {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>{row.station}</TableCell>
                                            <TableCell sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={row.stock_id}>
                                                {row.stock_id}
                                            </TableCell>
                                            <TableCell>{row.existing_manifest}</TableCell>
                                            <TableCell>{row.client}</TableCell>
                                            <TableCell>{row.po_no}</TableCell>
                                            <TableCell>{row.supplier}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    size="small"
                                                    color={statusColor(row.stock_status)}
                                                    variant="outlined"
                                                    icon={<FiberManualRecordIcon sx={{ fontSize: "10px !important" }} />}
                                                    label={row.stock_status}
                                                    sx={{ fontWeight: 600, borderRadius: "18px" }}
                                                />
                                            </TableCell>
                                            <TableCell align="right" sx={{ ...stickyRight, zIndex: 2, width: 190, minWidth: 190 }}>
                                                <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 0.5 }}>
                                                    <Button size="small" color="success" variant="contained" sx={{ textTransform: "none" }}>
                                                        Approve
                                                    </Button>
                                                    <IconButton size="small" color="primary" aria-label="edit">
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton size="small" color="error" aria-label="delete">
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                        </TableRow>

                                        {/* Expandable details row */}
                                        <TableRow>
                                            <TableCell colSpan={TOTAL_COLS} sx={{ py: 0, borderBottom: isOpen ? undefined : "none" }}>
                                                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                                    <Paper elevation={2} sx={{ my: 1, bgcolor: "action.hover", borderRadius: 2 }}>
                                                        {renderDetails(row)}
                                                    </Paper>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </Fragment>
                                );
                            })}

                            {paginateData.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={TOTAL_COLS} align="center" sx={{ py: 4, color: "text.secondary" }}>
                                        No records found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Outside the scroll container so it never scrolls sideways */}
                <TablePagination
                    component="div"
                    count={filteredData.length}
                    page={pages}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[10, 15, 25, 50, 100]}
                    sx={{ borderTop: "1px solid", borderColor: "divider" }}
                />
            </Paper>
        </Box>
    );
}