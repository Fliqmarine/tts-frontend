import {
    Badge, Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent,
    DialogTitle, IconButton, Paper, Popover, Table, TableBody, TableCell,
    TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useState, type ChangeEvent, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { alpha } from "@mui/material/styles";
import type { Filters } from "./StockFollowupFilter";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useLocation, useNavigate } from "react-router-dom";

export type FileItem = { name: string; url: string };

const demoImages: FileItem[] = [
    { name: "cargo-front.jpg", url: "https://picsum.photos/id/1011/800/600" },
    { name: "cargo-side.jpg", url: "https://picsum.photos/id/1015/800/600" },
    { name: "damage.png", url: "https://picsum.photos/id/1016/800/600" },
];

const demoData = [
    {
        id: 1, station: "ICN-TTS-E 1", stock_id: "ICN-TTS-E0525",
        vessel: "SOYANA (EX OCEAN AMBER) (EX OCEAN EMBRACE) 1",
        existing_manifest: "TTS-NB-26-09-1134 ... (1)",
        client: "MINATO MARINE SOLUTIONS L.L.C-FZ",
        po_no: "MM-26-0002779, MM-26-0003403",
        supplier: "MINATO MARINE SOLUTIONS",
        pkgs: 10, weight: 100, cbm: 1.0, value: 1000, transit_no: "Transit 1",
        arrival_date: "2023-08-15", stock_status: "Pending",
        docs: [
            { name: "invoice.pdf", url: "/files/invoice.pdf" },
            { name: "packing-list.pdf", url: "/files/packing-list.pdf" },
        ] as FileItem[],
        images: [...demoImages, ...demoImages, ...demoImages] as FileItem[],
    },
    {
        id: 2, station: "Station 2", stock_id: "STK-0002", vessel: "Vessel 2",
        existing_manifest: "Manifest 2", client: "Client 2", po_no: "PO456",
        supplier: "Supplier 2", pkgs: 15, weight: 150, cbm: 1.5, value: 1500,
        transit_no: "Transit 1", arrival_date: "2023-08-20", stock_status: "Completed",
        docs: [{ name: "bill-of-lading.pdf", url: "/files/bol.pdf" }] as FileItem[],
        images: [] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
    {
        id: 3, station: "Station 3", stock_id: "STK-0003", vessel: "Vessel 3",
        existing_manifest: "Manifest 3", client: "Client 3", po_no: "PO789",
        supplier: "Supplier 3", pkgs: 20, weight: 200, cbm: 2.0, value: 2000,
        transit_no: "Transit 1", arrival_date: "2023-08-25", stock_status: "In Progress",
        docs: [] as FileItem[],
        images: [{ name: "container.jpg", url: "https://picsum.photos/id/1018/800/600" }] as FileItem[],
    },
];

export type StockFollowupRow = (typeof demoData)[number];
type Row = StockFollowupRow;

const openFile = (file: FileItem) => window.open(file.url, "_blank", "noopener,noreferrer");

const downloadFile = async (file: FileItem) => {
    const save = (href: string, newTab = false) => {
        const a = document.createElement("a");
        a.href = href;
        a.download = file.name;
        if (newTab) a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        a.remove();
    };
    try {
        const res = await fetch(file.url);
        const blob = await res.blob();
        const href = URL.createObjectURL(blob);
        save(href);
        setTimeout(() => URL.revokeObjectURL(href), 1000);
    } catch {
        save(file.url, true); // fallback when fetch is blocked (CORS)
    }
};

// Only used for filter matching ("A, B" matches either A or B). Not used for display anymore.
const splitValues = (v?: string | null) =>
    (v ?? "").split(",").map((s) => s.trim()).filter(Boolean);


// Icon with count badge; click opens a list with per-file and "Download all" actions
export function FileCell({ files, type }: { files: FileItem[]; type: "doc" | "image" }) {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

    if (!files.length) {
        return <Typography variant="body2" color="text.disabled" sx={{ fontSize: "inherit" }}>—</Typography>;
    }

    const isDoc = type === "doc";
    const Icon = isDoc ? PictureAsPdfIcon : PhotoLibraryIcon;
    const color = isDoc ? "error" : "primary";
    const noun = isDoc ? "document" : "image";
    const label = `${files.length} ${noun}${files.length > 1 ? "s" : ""}`;

    // Browsers can block many downloads fired at once, so go one by one with a short gap
    const handleDownloadAll = async () => {
        setProgress({ done: 0, total: files.length });
        for (let i = 0; i < files.length; i++) {
            await downloadFile(files[i]);
            setProgress({ done: i + 1, total: files.length });
            await new Promise((r) => setTimeout(r, 400));
        }
        setProgress(null);
    };

    return (
        <>
            <Tooltip title={label} arrow>
                <IconButton size="small" color={color} aria-label={label} onClick={(e) => setAnchor(e.currentTarget)} sx={{ p: 0.5 }}>
                    <Badge
                        badgeContent={files.length}
                        color={color}
                        max={99}
                        sx={{ "& .MuiBadge-badge": { fontSize: "0.58rem", height: 15, minWidth: 15, px: 0.5, right: -4, top: -2 } }}
                    >
                        <Icon sx={{ fontSize: "1.2rem" }} />
                    </Badge>
                </IconButton>
            </Tooltip>

            <Popover
                open={Boolean(anchor)}
                anchorEl={anchor}
                onClose={() => setAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                slotProps={{ paper: { sx: { width: isDoc ? 340 : 400, maxHeight: 420, borderRadius: 2 } } }}
            >
                {/* Header: count + Download all */}
                <Box
                    sx={{
                        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1,
                        px: 2, py: 1, borderBottom: "1px solid", borderColor: "divider",
                        position: "sticky", top: 0, bgcolor: "background.paper", zIndex: 1,
                    }}
                >
                    <Typography variant="subtitle2">
                        {isDoc ? "Documents" : "Images"} ({files.length})
                    </Typography>
                    <Button
                        size="small"
                        variant="contained"
                        color={color}
                        disableElevation
                        disabled={Boolean(progress)}
                        startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: "16px !important" }} />}
                        onClick={handleDownloadAll}
                        sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.7rem", borderRadius: 1.5, py: 0.25 }}
                    >
                        {progress ? `Downloading ${progress.done}/${progress.total}` : "Download all"}
                    </Button>
                </Box>

                {isDoc ? (
                    <Box sx={{ py: 0.5 }}>
                        {files.map((file, i) => (
                            <Box key={`${file.url}-${i}`} sx={{ display: "flex", alignItems: "center", gap: 1, px: 2, py: 0.75, "&:hover": { bgcolor: "action.hover" } }}>
                                <PictureAsPdfIcon color="error" fontSize="small" />
                                <Typography variant="body2" noWrap sx={{ flex: 1 }} title={file.name}>{file.name}</Typography>
                                <Tooltip title="Open" arrow>
                                    <IconButton size="small" onClick={() => openFile(file)}><OpenInNewIcon sx={{ fontSize: 16 }} /></IconButton>
                                </Tooltip>
                                <Tooltip title="Download" arrow>
                                    <IconButton size="small" onClick={() => downloadFile(file)}><FileDownloadOutlinedIcon sx={{ fontSize: 16 }} /></IconButton>
                                </Tooltip>
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Box sx={{ p: 1.5, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1 }}>
                        {files.map((file, i) => (
                            <Box
                                key={`${file.url}-${i}`}
                                sx={{
                                    position: "relative", aspectRatio: "1", borderRadius: 1, overflow: "hidden",
                                    border: "1px solid", borderColor: "divider", cursor: "pointer",
                                }}
                                onClick={() => openFile(file)}
                                title={`${file.name} (click to open)`}
                            >
                                <Box component="img" src={file.url} alt={file.name} loading="lazy" sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                                {/* Always visible so single download is easy */}
                                <Tooltip title="Download" arrow>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => { e.stopPropagation(); downloadFile(file); }}
                                        sx={{ position: "absolute", right: 2, bottom: 2, p: 0.25, bgcolor: "rgba(0,0,0,.6)", color: "#fff", "&:hover": { bgcolor: "rgba(0,0,0,.85)" } }}
                                    >
                                        <FileDownloadOutlinedIcon sx={{ fontSize: 14 }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        ))}
                    </Box>
                )}
            </Popover>
        </>
    );
}

type StatusColor = "success" | "warning" | "info";

const statusColor = (status: string): StatusColor =>
    status === "Completed" ? "success" : status === "Pending" ? "warning" : "info";

// ---------- Column definitions (one place for label, default width, alignment, content) ----------
type Column = {
    key: string;
    label: string;
    width: number;                       // default width in px (user can drag to change)
    align?: "left" | "right" | "center";
    bold?: boolean;
    text?: (row: Row) => string;         // plain text cell -> truncated with "..." + full text on hover
    node?: (row: Row) => ReactNode;      // custom cell (chip, icons)
};

const columns: Column[] = [
    { key: "station", label: "Station", width: 120, bold: true, text: (r) => r.station },
    { key: "stock_id", label: "Stock ID", width: 130, text: (r) => r.stock_id },
    { key: "stock_status", label: "Status", width: 110,
        node: (r) => (
            <Chip
                size="small"
                color={statusColor(r.stock_status)}
                variant="outlined"
                icon={<FiberManualRecordIcon sx={{ fontSize: "8px !important" }} />}
                label={r.stock_status}
                sx={(t) => ({
                    height: 20,
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    borderRadius: "18px",
                    bgcolor: alpha(t.palette[statusColor(r.stock_status)].main, 0.08),
                    "& .MuiChip-label": { px: 0.75 },
                })}
            />
        ),
    },
    { key: "vessel", label: "Vessel", width: 170, text: (r) => r.vessel },
    { key: "client", label: "Client", width: 170, text: (r) => r.client },
    { key: "po_no", label: "PO No", width: 150, text: (r) => r.po_no },
    { key: "supplier", label: "Supplier", width: 160, text: (r) => r.supplier },
    { key: "pkgs", label: "Pkgs", width: 70, align: "right", text: (r) => String(r.pkgs) },
    { key: "weight", label: "Weight", width: 90, align: "right", text: (r) => `${r.weight.toLocaleString()} kg` },
    { key: "cbm", label: "CBM", width: 90, align: "right", text: (r) => `${r.cbm.toFixed(2)} m³` },
    { key: "value", label: "Value", width: 100, align: "right", text: (r) => `$${r.value.toLocaleString()}` },
    { key: "transit_no", label: "Transit No", width: 110, text: (r) => r.transit_no },
    { key: "arrival_date", label: "Arrival Date", width: 110, text: (r) => r.arrival_date },
    { key: "docs", label: "Docs", width: 80, align: "center", node: (r) => <FileCell files={r.docs} type="doc" /> },
    { key: "images", label: "Images", width: 80, align: "center", node: (r) => <FileCell files={r.images} type="image" /> },
    { key: "existing_manifest", label: "Existing Manifest", width: 160, text: (r) => r.existing_manifest },
];

const CHECKBOX_COL_WIDTH = 44;
const ACTIONS_COL_WIDTH = 210;
const MIN_COL_WIDTH = 60;
// MUI controls and action buttons set a practical minimum of about 40px per row.
const ROW_HEIGHT = 34;
const HEADER_HEIGHT = 42;
const TOTAL_COLS = columns.length + 2; //* + checkbox + actions

const defaultWidths = Object.fromEntries(columns.map((c) => [c.key, c.width])) as Record<string, number>;

interface StockFollowupTableProps {
    filters?: Filters;
}

export default function StockFollowupTable({ filters }: StockFollowupTableProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const [rows, setRows] = useState<Row[]>(() => {
        const updatedStock = (location.state as { updatedStock?: Row } | null)?.updatedStock;
        return updatedStock ? demoData.map((row) => row.id === updatedStock.id ? updatedStock : row) : demoData;
    });
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [pages, setPages] = useState(0);
    const [selected, setSelected] = useState<number[]>([]);
    const [widths, setWidths] = useState<Record<string, number>>(defaultWidths);
    const [approveTarget, setApproveTarget] = useState<Row | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);

    // Drag the divider in the header to resize a column. Double-click it to reset that column.
    const startResize = (key: string, e: ReactMouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const startX = e.clientX;
        const startWidth = widths[key];

        const onMove = (ev: MouseEvent) =>
            setWidths((w) => ({ ...w, [key]: Math.max(MIN_COL_WIDTH, startWidth + ev.clientX - startX) }));

        const onUp = () => {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };

        // eslint-disable-next-line react-hooks/immutability
        document.body.style.cursor = "col-resize";
        // eslint-disable-next-line react-hooks/immutability
        document.body.style.userSelect = "none";
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
    };

    const resetWidth = (key: string) => setWidths((w) => ({ ...w, [key]: defaultWidths[key] }));

    const totalWidth =
        CHECKBOX_COL_WIDTH + ACTIONS_COL_WIDTH + columns.reduce((sum, c) => sum + widths[c.key], 0);

    const hasValue = (raw: string, selectedValue?: string) =>
        !selectedValue || splitValues(raw).includes(selectedValue);

    const searchTerm = filters?.search?.trim().toLowerCase() ?? "";

    const filteredData = rows.filter((row) => {
        const searchableText = [
            row.station, row.stock_id, row.existing_manifest, row.vessel, row.client, row.po_no,
            row.supplier, row.transit_no, row.stock_status,
            ...row.docs.map((f) => f.name),
            ...row.images.map((f) => f.name),
            String(row.pkgs), String(row.weight), String(row.cbm), String(row.value),
        ].join(" ").toLowerCase();

        return (
            searchableText.includes(searchTerm) &&
            hasValue(row.client, filters?.client) &&
            hasValue(row.station, filters?.station) &&
            hasValue(row.vessel, filters?.vessel) &&
            hasValue(row.supplier, filters?.supplier) &&
            hasValue(row.po_no, filters?.po_number) &&
            hasValue(row.transit_no, filters?.transit_number) &&
            (!filters?.status || row.stock_status === filters.status)
        );
    });

    const lastPage = Math.max(0, Math.ceil(filteredData.length / rowsPerPage) - 1);
    const currentPage = Math.min(pages, lastPage);
    const paginateData = filteredData.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);

    const currentPageIds = paginateData.map((row) => row.id);
    const allOnPageSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selected.includes(id));
    const someOnPageSelected = currentPageIds.some((id) => selected.includes(id)) && !allOnPageSelected;
    const handleConfirmApprove = () => {
        if (!approveTarget) return;
        setRows((current) => current.map((row) =>
            row.id === approveTarget.id ? { ...row, stock_status: "Completed" } : row
        ));
        setApproveTarget(null);
    };

    const handleSelectAll = () => {
        if (allOnPageSelected) {
            setSelected((prev) => prev.filter((id) => !currentPageIds.includes(id)));
        } else {
            setSelected((prev) => [...new Set([...prev, ...currentPageIds])]);
        }
    };

    const handleSelectRow = (id: number) =>
        setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

    const handleExport = () => alert(`Exporting ${selected.length} items (Placeholder)`);

    const handleChangePage = (_: unknown, newPage: number) => setPages(newPage);

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPages(0);
    };

    const handleApprove = (row: Row) => setApproveTarget(row);
    const handleCloseApprove = () => setApproveTarget(null);
    const handleConfirmDelete = () => {
        if (!deleteTarget) return;
        const remainingRows = rows.filter((row) => row !== deleteTarget);
        setRows(remainingRows);
        setSelected((prev) => prev.filter((id) => id !== deleteTarget.id));
        setPages((page) => Math.min(page, Math.max(0, Math.ceil((filteredData.length - 1) / rowsPerPage) - 1)));
        setDeleteTarget(null);
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

            <Paper elevation={2} sx={{  borderRadius: "8px 8px 16px 16px", border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
                {/* maxHeight is what makes the sticky header work – adjust 260px to your layout */}
                <TableContainer sx={{ maxHeight: HEADER_HEIGHT + ROW_HEIGHT * 15, overflow: "auto" }}>
                    <Table
                        size="small"
                        stickyHeader
                        sx={(t) => {
                            const hoverTint = `linear-gradient(${t.palette.action.hover}, ${t.palette.action.hover})`;
                            const selectedTint = `linear-gradient(${alpha(t.palette.primary.main, 0.08)}, ${alpha(t.palette.primary.main, 0.08)})`;
                            return {
                                tableLayout: "fixed",   // widths come from <colgroup>, so ellipsis + resizing work
                                width: totalWidth,
                                minWidth: "100%",
                                "& .MuiTableCell-root": {
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",   // long text -> "..."
                                    borderColor: t.palette.divider,
                                    px: 1,
                                },

                                // Header
                                "& .MuiTableCell-head": {
                                    fontWeight: 700,
                                    fontSize: "0.62rem",
                                    textTransform: "uppercase",
                                    letterSpacing: 0.4,
                                    lineHeight: 1.2,
                                    color: t.palette.text.primary,
                                    backgroundColor: t.palette.background.paper,
                                    backgroundImage: hoverTint,
                                    borderBottom: `2px solid ${t.palette.divider}`,
                                    py: 0.75,
                                },
                                // Body: same fixed height for every row
                                "& .MuiTableCell-body": { fontSize: "0.68rem", lineHeight: 1.3, py: 0, height: ROW_HEIGHT },

                                // Compact checkboxes
                                "& .MuiCheckbox-root": { p: 0.5 },
                                "& .MuiCheckbox-root .MuiSvgIcon-root": { fontSize: "1.1rem" },

                                // Cells that hold badges/popover triggers must not clip them
                                "& .no-clip": { overflow: "visible" },

                                // Row hover / selected
                                "& .MuiTableBody-root .MuiTableRow-root:hover": { backgroundColor: t.palette.action.hover },
                                "& .MuiTableBody-root .MuiTableRow-root.Mui-selected": { backgroundColor: alpha(t.palette.primary.main, 0.08) },

                                // Resize divider in header
                                "& .col-resizer": {
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    height: "100%",
                                    width: 10,
                                    cursor: "col-resize",
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    userSelect: "none",
                                    touchAction: "none",
                                    "&::after": {
                                        content: '""',
                                        width: 2,
                                        height: "60%",
                                        alignSelf: "center",
                                        borderRadius: 1,
                                        backgroundColor: t.palette.divider,
                                        transition: "background-color .15s",
                                    },
                                    "&:hover::after": { backgroundColor: t.palette.primary.main },
                                },

                                // Sticky Actions column
                                "& .col-actions": {
                                    position: "sticky",
                                    right: 0,
                                    backgroundColor: t.palette.background.paper,
                                    boxShadow: "-6px 0 8px -6px rgba(0,0,0,0.25)",
                                    overflow: "visible",
                                },
                                "& .MuiTableCell-head.col-actions": { zIndex: 5, backgroundImage: hoverTint },
                                "& .MuiTableBody-root .col-actions": { zIndex: 2 },
                                "& .MuiTableBody-root .MuiTableRow-root:hover .col-actions": { backgroundImage: hoverTint },
                                "& .MuiTableBody-root .MuiTableRow-root.Mui-selected .col-actions": { backgroundImage: selectedTint },
                            };
                        }}
                    >
                        <colgroup>
                            <col style={{ width: CHECKBOX_COL_WIDTH }} />
                            {columns.map((c) => (
                                <col key={c.key} style={{ width: widths[c.key] }} />
                            ))}
                            <col style={{ width: ACTIONS_COL_WIDTH }} />
                        </colgroup>

                        <TableHead sx={{ height: HEADER_HEIGHT }}>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox size="small" indeterminate={someOnPageSelected} checked={allOnPageSelected} onChange={handleSelectAll} />
                                </TableCell>

                                {columns.map((c) => (
                                    <TableCell key={c.key} align={c.align} title={c.label}>
                                        {c.label}
                                        <Box
                                            className="col-resizer"
                                            onMouseDown={(e) => startResize(c.key, e)}
                                            onDoubleClick={() => resetWidth(c.key)}
                                        />
                                    </TableCell>
                                ))}

                                <TableCell align="center" className="col-actions">Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {paginateData.map((row) => {
                                const isApproved = row.stock_status === "Completed";
                                return (
                                <TableRow key={row.id} hover selected={selected.includes(row.id)}>
                                    <TableCell padding="checkbox" sx={{ pl: 1.5 }}>
                                        <Checkbox size="small" checked={selected.includes(row.id)} onChange={() => handleSelectRow(row.id)} />
                                    </TableCell>

                                    {columns.map((c) => {
                                        const text = c.text?.(row);
                                        return (
                                            <TableCell
                                                key={c.key}
                                                align={c.align}
                                                className={c.node ? "no-clip" : undefined}
                                                title={text}   // full value on hover when it's cut with "..."
                                                sx={c.bold ? { fontWeight: 600 } : undefined}
                                            >
                                                {c.node ? c.node(row) : text}
                                            </TableCell>
                                        );
                                    })}

                                    <TableCell align="center" className="col-actions">
                                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 0.25 }}>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="success"
                                                disableElevation
                                                disabled={isApproved}
                                                startIcon={isApproved ? <DoneAllIcon /> : <CheckCircleIcon />}
                                                onClick={() => handleApprove(row)}
                                                sx={(t) => ({
                                                    textTransform: "none",
                                                    fontWeight: 600,
                                                    fontSize: "0.65rem",
                                                    height: 24,
                                                    minWidth: 0,
                                                    px: 1,
                                                    borderRadius: "14px",
                                                    whiteSpace: "nowrap",
                                                    color: t.palette.success.dark,
                                                    bgcolor: alpha(t.palette.success.main, 0.12),
                                                    border: "1px solid",
                                                    borderColor: alpha(t.palette.success.main, 0.4),
                                                    "& .MuiButton-startIcon": { mr: 0.4, ml: 0, "& > *:first-of-type": { fontSize: 14 } },
                                                    "&:hover": {
                                                        bgcolor: t.palette.success.main,
                                                        color: t.palette.success.contrastText,
                                                        borderColor: t.palette.success.main,
                                                    },
                                                    "&.Mui-disabled": {
                                                        color: t.palette.success.main,
                                                        bgcolor: alpha(t.palette.success.main, 0.06),
                                                        borderColor: alpha(t.palette.success.main, 0.2),
                                                        opacity: 0.75,
                                                    },
                                                })}
                                            >
                                                {isApproved ? "Approved" : "Approve"}
                                            </Button>
                                            {[
                                                { title: "View", color: "info", Icon: VisibilityIcon },
                                                { title: "Log", color: "secondary", Icon: HistoryOutlinedIcon },
                                                { title: "Edit", color: "primary", Icon: EditIcon },
                                                { title: "Delete", color: "error", Icon: DeleteIcon },
                                            ].map(({ title, color, Icon }) => (
                                                <Tooltip key={title} title={title} arrow>
                                                    <IconButton
                                                        size="small"
                                                        color={color as "info" | "secondary" | "primary" | "error"}
                                                        aria-label={title.toLowerCase()}
                                                        onClick={title === "View"
                                                            ? () => navigate(`/stocks/view/${row.id}`, { state: { stock: row } })
                                                            : title === "Edit"
                                                                ? () => navigate(`/stocks/edit/${row.id}`, { state: { stock: row } })
                                                                : title === "Delete"
                                                                    ? () => setDeleteTarget(row)
                                                                    : undefined}
                                                        sx={{ p: 0.4 }}
                                                    >
                                                        <Icon sx={{ fontSize: "0.95rem" }} />
                                                    </IconButton>
                                                </Tooltip>
                                            ))}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                                );
                            })}

                            {paginateData.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={TOTAL_COLS} align="center" sx={{ py: 6, color: "text.secondary" }}>
                                        No records found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={filteredData.length}
                    page={currentPage}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[15, 30, 50, 100]}
                    sx={{ borderTop: "1px solid", borderColor: "divider" }}
                />

            </Paper>
            <Dialog
                open={approveTarget !== null}
                onClose={handleCloseApprove}
                aria-labelledby="approve-stock-dialog-title"
                aria-describedby="approve-stock-dialog-description"
                slotProps={{ paper: { sx: { width: 400, maxWidth: "calc(100% - 32px)", borderRadius: 3,mb: 20 } } }}
            >
                <DialogContent sx={{ textAlign: "center", pt: 3.5, pb: 1 }}>
                    <Box
                        sx={(t) => ({
                            width: 56, height: 56, mx: "auto", mb: 2, borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            bgcolor: alpha(t.palette.success.main, 0.12),
                            color: "success.main",
                        })}
                    >
                        <CheckCircleIcon sx={{ fontSize: 32 }} />
                    </Box>

                    <Typography id="approve-stock-dialog-title" variant="h6" sx={{ fontWeight: 700 }}>
                        Confirm Approval
                    </Typography>
                    <Typography id="approve-stock-dialog-description" variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Are you sure you would like to approve this stock <br />{approveTarget?.stock_id && (
                            <> (<Box component="span" sx={{ color: "primary.main", fontWeight: 700 }}>{approveTarget.stock_id}</Box>)</>
                        )}?
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ px: 5, pb: 4, pt: 3, gap: 1 }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        onClick={handleCloseApprove}
                        sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, borderColor: "error.main" }}
                    >
                        Cancel
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        disableElevation
                        autoFocus
                        onClick={handleConfirmApprove}
                        startIcon={<CheckCircleIcon />}
                        sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, ml: "0 !important" }}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={deleteTarget !== null}
                onClose={() => setDeleteTarget(null)}
                aria-labelledby="delete-stock-title"
                aria-describedby="delete-stock-description"
                fullWidth
                maxWidth="xs"
                slotProps={{ paper: { sx: { borderRadius: 3, p: 1, boxShadow: (theme) => theme.shadows[10] } } }}
            >
                <DialogTitle
                    id="delete-stock-title"
                    component="div"
                    sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, pt: 3, pb: 1 }}
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
                <DialogContent sx={{ textAlign: "center", pb: 1 }}>
                    <Typography id="delete-stock-description" variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        Are you sure you want to delete{" "}
                        {deleteTarget?.stock_id ? (
                            <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
                                {deleteTarget.stock_id}
                            </Box>
                        ) : (
                            "this stock record"
                        )}
                        ? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pt: 2, pb: 3, gap: 1.5 }}>
                    <Button onClick={() => setDeleteTarget(null)} variant="outlined" color="inherit" fullWidth sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, borderColor: "divider" }}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" fullWidth autoFocus disableElevation sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
