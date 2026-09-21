import type { ReactNode } from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutlineIcon";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FollowTheSignsIcon from "@mui/icons-material/FollowTheSigns";
import HistoryIcon from "@mui/icons-material/History";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PeopleIcon from "@mui/icons-material/People";
import ContactsIcon from "@mui/icons-material/Contacts";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import BusinessIcon from "@mui/icons-material/Business";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import ConnectingAirportsIcon from "@mui/icons-material/ConnectingAirports";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import WarehouseIcon from "@mui/icons-material/Warehouse";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ArticleIcon from "@mui/icons-material/Article";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PaymentsIcon from "@mui/icons-material/Payments";
import PaidIcon from "@mui/icons-material/Paid";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import DescriptionIcon from "@mui/icons-material/Description";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import SummarizeIcon from "@mui/icons-material/Summarize";
import BarChartIcon from "@mui/icons-material/BarChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupIcon from "@mui/icons-material/Group";
import PostAddIcon from "@mui/icons-material/PostAdd";
import CheckCircleOutlineIcon from "@mui/icons-material/TaskAlt";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { Box, Button, Grow, ListItemButton, Paper, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";



export interface NavigationMenu {
    label: string;
    children: NavigationChild[];
    subChildren?: NavigationChild[];
    icon?: ReactNode;
}

export interface NavigationChild {
    label: string;
    path?: string;
    children?: NavigationChild[];
    icon?: ReactNode;
}

export const navigationMenus: NavigationMenu[] = [
    {
        label: "Stocks",
        children: [
            {
                label: "Create Stock",
                path: "/stocks/create-stock",
                icon: <AddBoxIcon fontSize="small" />,
            },
            {
                label: "Stock List",
                path: "/stocks/stock-list",
                icon: <ListAltIcon fontSize="small" />,
            },
            {
                label: "Follow Up",
                path: "/stocks/follow-up",
                icon: <FollowTheSignsIcon fontSize="small" />,
            },
            {
                label: "Stock History",
                path: "/stocks/history",
                icon: <HistoryIcon fontSize="small" />,
            },
        ],
    },
    {
        label: "Manifest",
        children: [
            {
                label: "Manifested",
                path: "/manifest/manifest-list",
                icon: <ChecklistRtlIcon fontSize="small" />,
            },
            {
                label: "Manifest Create",
                path: "/manifest/manifest-create",
                icon: <AddBoxIcon fontSize="small" />,
            },
        ],
    },

    {
        label: "Jobs",
        children: [
            {
                label: "Pre Alert-Stage 1",
                path: "/jobs/pre-alert-stage-1",
                icon: <NotificationsActiveIcon fontSize="small" />,
            },
            {
                label: "Pre Alert-Stage 2",
                path: "/jobs/pre-alert-stage-2",
                icon: <NotificationsActiveIcon fontSize="small" />,
            },
            {
                label: "Pre Alert-Stage 3",
                path: "/jobs/pre-alert-stage-3",
                icon: <NotificationsActiveIcon fontSize="small" />,
            },
            {
                label: "Pre Alert-Stage 4",
                path: "/jobs/pre-alert-stage-4",
                icon: <NotificationsActiveIcon fontSize="small" />,
            },
        ],
    },
    {
        label: "Quotes",
        children: [
            {
                label: "Create",
                path: "/quotes/create",
                icon: <PostAddIcon fontSize="small" />,
            },
            {
                label: "Confirm",
                path: "/quotes/confirm",
                icon: <CheckCircleOutlineIcon fontSize="small" />,
            },
            {
                label: "Follow Up",
                path: "/quotes/follow-up",
                icon: <TrackChangesIcon fontSize="small" />,
            },
            {
                label: "All Requests",
                path: "/quotes/all-requests",
                icon: <FormatListBulletedIcon fontSize="small" />,
            },
        ],
    },
    {
        label: "Finance",
        children: [
            {
                label: "Sale Invoice",
                path: "/finance/sale-invoice",
                icon: <ReceiptIcon fontSize="small" />,
            },
            {
                label: "Vendor Invoice",
                path: "/finance/vendor-invoice",
                icon: <ReceiptLongIcon fontSize="small" />,
            },
            {
                label: "Client Receipt",
                path: "/finance/client-receipt",
                icon: <PaidIcon fontSize="small" />,
            },
            {
                label: "Vendor Payment",
                path: "/finance/vendor-payment",
                icon: <PaymentsIcon fontSize="small" />,
            },
            {
                label: "AP Update",
                path: "/finance/ap-update",
                icon: <SyncAltIcon fontSize="small" />,
            },
            {
                label: "Invoice Report",
                path: "/finance/invoice-report",
                icon: <AssessmentIcon fontSize="small" />,
            },
            {
                label: "Expenses",
                path: "/finance/expenses",
                icon: <AccountBalanceWalletIcon fontSize="small" />,
            },
            {
                label: "Proforma Invoices",
                path: "/finance/proforma-invoices",
                icon: <DescriptionIcon fontSize="small" />,
            },
            {
                label: "Proforma Invoice Receipts",
                path: "/finance/proforma-invoice-receipts",
                icon: <NoteAddIcon fontSize="small" />,
            },
        ],
    },
    {
        label: "Report",
        children: [
            {
                label: "AP Report",
                path: "/report/ap-report",
                icon: <SummarizeIcon fontSize="small" />,
            },
            {
                label: "AR Report",
                path: "/report/ar-report",
                icon: <BarChartIcon fontSize="small" />,
            },
            {
                label: "Profit and Loss",
                path: "/report/profit-and-loss",
                icon: <TrendingUpIcon fontSize="small" />,
            },
            {
                label: "Client Summary",
                path: "/report/client-summary",
                icon: <GroupIcon fontSize="small" />,
            },
        ],
    },
    {
        label: "Master",
        children: [
            {
                label: "Users",
                path: "/master/users",
                icon: <PeopleIcon fontSize="small" />,
            },
            {
                label: "Contact List",
                path: "/master/contact-list",
                icon: <ContactsIcon fontSize="small" />,
            },
            {
                label: "Vessels",
                path: "/master/vessels",
                icon: <DirectionsBoatIcon fontSize="small" />,
            },
            {
                label: "Vendors",
                path: "/master/vendors",
                icon: <BusinessIcon fontSize="small" />,
            },
            {
                label: "Banks",
                path: "/master/banks",
                icon: <AccountBalanceIcon fontSize="small" />,
            },
            {
                label: "Tariff Master",
                path: "/master/tariff-master",
                icon: <RequestQuoteIcon fontSize="small" />,
            },
            {
                label: "Airport Codes",
                path: "/master/airport-codes",
                icon: <ConnectingAirportsIcon fontSize="small" />,
            },
            {
                label: "Currency",
                path: "/master/currency",
                icon: <CurrencyExchangeIcon fontSize="small" />,
            },
            {
                label: "Cargo",
                path: "/master/cargo",
                icon: <LocalShippingOutlinedIcon fontSize="small" />,
            },
            {
                label: "Hub",
                path: "/master/hub",
                icon: <WarehouseIcon fontSize="small" />,
            },
            {
                label: "Finance Master",
                children: [
                    {
                        label: "Gl Code Parents",
                        path: "/master/finance-master/gl-code-parent",
                        icon: <AccountTreeIcon fontSize="small" />,
                    },
                    {
                        label: "Gl Code Children",
                        path: "/master/finance-master/gl-code-child",
                        icon: <FolderOpenIcon fontSize="small" />,
                    },
                    {
                        label: "Gl Code Sub Children",
                        path: "/master/finance-master/gl-code-subchild",
                        icon: <ArticleIcon fontSize="small" />,
                    },
                ],
            },
        ],
    },
];

const navItemSx = (active: boolean) => (theme: any) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    px: 2,
    py: 0.8,
    borderRadius: 1,
    cursor: "pointer",
    color: active ? theme.palette.secondary.main : theme.palette.text.primary,
    fontWeight: active ? 700 : 400,
    fontSize: "0.875rem",
    "&:hover": {
        backgroundColor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
        color: theme.palette.secondary.main,
    },
});

const NestedMenuItemPopup = ({ item }: { item: NavigationChild }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const hasChildren = item.children && item.children.length > 0;
    const childActive = item.path ? location.pathname.startsWith(item.path) : false;

    if (!hasChildren) {
        return (
            <ListItemButton
                component={item.path ? Link : "div"}
                to={item.path || "#"}
                sx={navItemSx(childActive)}
                disableRipple={false}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, color: "inherit" }}>
                    {item.icon && (
                        <Box sx={{ color: "inherit", display: "flex", alignItems: "center", opacity: 0.75 }}>
                            {item.icon}
                        </Box>
                    )}
                    <Typography variant="body2" sx={{ color: "inherit", fontWeight: "inherit" }}>
                        {item.label}
                    </Typography>
                </Box>
            </ListItemButton>
        );
    }

    return (
        <Box
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            sx={{ position: "relative", width: "100%" }}
        >
            <ListItemButton sx={navItemSx(false)} disableRipple>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, color: "inherit" }}>
                    {item.icon && (
                        <Box sx={{ color: "inherit", display: "flex", alignItems: "center", opacity: 0.75 }}>
                            {item.icon}
                        </Box>
                    )}
                    <Typography variant="body2" sx={{ color: "inherit", fontWeight: "inherit" }}>
                        {item.label}
                    </Typography>
                </Box>
                <KeyboardArrowRightIcon fontSize="small" sx={{ ml: 1, color: "inherit" }} />
            </ListItemButton>

            {/* Invisible bridge + sub-panel */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: "100%",
                    zIndex: 1400,
                    pl: "6px",
                    pointerEvents: isOpen ? "auto" : "none",
                }}
            >
                <Grow in={isOpen} timeout={200} style={{ transformOrigin: "left top" }}>
                    <Paper
                        elevation={8}
                        sx={{ minWidth: 220, py: 0.5, borderRadius: 2, border: "1px solid rgba(0,0,0,0.06)" }}
                    >
                        {item.children!.map((child, index) => {
                            const isChildActive = child.path ? location.pathname.startsWith(child.path) : false;
                            return (
                                <ListItemButton
                                    key={child.path || index}
                                    component={child.path ? Link : "div"}
                                    to={child.path || "#"}
                                    sx={navItemSx(isChildActive)}
                                    disableRipple={false}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, color: "inherit" }}>
                                        {child.icon && (
                                            <Box sx={{ color: "inherit", display: "flex", alignItems: "center", opacity: 0.75 }}>
                                                {child.icon}
                                            </Box>
                                        )}
                                        <Typography variant="body2" sx={{ color: "inherit", fontWeight: "inherit" }}>
                                            {child.label}
                                        </Typography>
                                    </Box>
                                </ListItemButton>
                            );
                        })}
                    </Paper>
                </Grow>
            </Box>
        </Box>
    );
};

export default function NavigationMenu() {
    const location = useLocation();
    const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

    const isMenuActive = (menu: (typeof navigationMenus)[number]) =>
        menu.children.some((child) => {
            if (child.path && location.pathname.startsWith(child.path)) return true;
            if (child.children) {
                return child.children.some((c) => c.path && location.pathname.startsWith(c.path));
            }
            return false;
        });

    return (
        <>
            {navigationMenus.map((menu) => {
                const active = isMenuActive(menu);
                const isOpen = hoveredMenu === menu.label;

                return (
                    <Box
                        key={menu.label}
                        onMouseEnter={() => setHoveredMenu(menu.label)}
                        onMouseLeave={() => setHoveredMenu(null)}
                        sx={{ position: "relative" }}
                    >
                        <Button
                            endIcon={<KeyboardArrowDownIcon />}
                            sx={(theme: any) => ({
                                color: active || isOpen ? theme.palette.secondary.main : "#ffffff",
                                fontWeight: active ? 700 : 600,
                                fontSize: "0.775rem",
                                borderRadius: 0,
                                px: 2,
                                py: 1,
                                position: "relative",
                                transition: "all 0.2s ease",
                                "&::after": {
                                    content: '""',
                                    position: "absolute",
                                    bottom: 0,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    width: active || isOpen ? "100%" : "0%",
                                    height: "2px",
                                    backgroundColor: theme.palette.secondary.main,
                                    transition: "width 0.3s ease",
                                },
                                "&:hover": {
                                    color: theme.palette.secondary.main,
                                    backgroundColor: "rgba(255,255,255,0.08)",
                                },
                            })}
                        >
                            {menu.label}
                        </Button>

                        {/* Invisible bridge (pt) prevents gap from closing the menu */}
                        <Box
                            sx={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                zIndex: 1300,
                                pt: "6px",
                                pointerEvents: isOpen ? "auto" : "none",
                            }}
                        >
                            <Grow in={isOpen} timeout={200} style={{ transformOrigin: "top left" }}>
                                <Paper
                                    elevation={8}
                                    sx={{ minWidth: 180, py: 0.5, borderRadius: 2, border: "1px solid rgba(0,0,0,0.06)" }}
                                >
                                    {menu.children.map((child, index) => (
                                        <NestedMenuItemPopup key={child.label || index} item={child} />
                                    ))}
                                </Paper>
                            </Grow>
                        </Box>
                    </Box>
                );
            })}
        </>
    );
}