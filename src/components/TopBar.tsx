import { useEffect, useState } from "react";
import {
    AppBar,
    Box,
    Collapse,
    Container,
    Drawer,
    FormControlLabel,
    FormGroup,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    Switch,
    Toolbar,
    Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import NavigationMenu, { navigationMenus } from "../config/MenuConfig";
import type { NavigationChild } from "../config/MenuConfig";
import { useColorMode } from "../theme/ColorModeContext"; 
// import ProfileMenu from "./profile/ProfileMenu";

const logo = "/TTS_Logo.png";

/* ── Dark-mode switch (sun / moon), themed to the teal & gold palette ── */
const SUN_PATH =
    "M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z";
const MOON_PATH =
    "M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z";

const svgUrl = (path: string, color: string) =>
    `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        color
    )}" d="${path}"/></svg>')`;

const ThemeModeSwitch = styled(Switch)(({ theme }) => {
    const isDark = theme.palette.mode === "dark";
    const gold = theme.palette.secondary.main;
    const trackColor = isDark ? "#2F6F6A" : "#B7C7C3";

    return {
        width: 62,
        height: 34,
        padding: 7,
        "& .MuiSwitch-switchBase": {
            margin: 1,
            padding: 0,
            transform: "translateX(6px)",
            "&.Mui-checked": {
                transform: "translateX(22px)",
                "& .MuiSwitch-thumb": {
                    backgroundColor: "#0F4644",
                    "&::before": { backgroundImage: svgUrl(MOON_PATH, gold) },
                },
                "& + .MuiSwitch-track": {
                    opacity: 1,
                    backgroundColor: trackColor,
                },
            },
        },
        "& .MuiSwitch-thumb": {
            backgroundColor: gold,
            width: 32,
            height: 32,
            "&::before": {
                content: "''",
                position: "absolute",
                width: "100%",
                height: "100%",
                left: 0,
                top: 0,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundImage: svgUrl(SUN_PATH, "#073B3A"),
            },
        },
        "& .MuiSwitch-track": {
            opacity: 1,
            backgroundColor: trackColor,
            borderRadius: 20 / 2,
        },
    };
});

/* ── Mobile drawer menu ── */
const MobileMenuNode = ({
    item,
    level = 0,
    onClose,
}: {
    item: NavigationChild;
    level?: number;
    onClose: () => void;
}) => {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const hasChildren = !!item.children?.length;
    const isActive = item.path ? location.pathname.startsWith(item.path) : false;

    const handleClick = () => {
        if (hasChildren) {
            setOpen((prev) => !prev);
        } else if (item.path) {
            onClose();
        }
    };

    return (
        <Box>
            <ListItemButton
                component={!hasChildren && item.path ? Link : "div"}
                to={!hasChildren && item.path ? item.path : "#"}
                onClick={handleClick}
                sx={(theme) => ({
                    pl: 2 + level * 2,
                    color: isActive
                        ? theme.palette.mode === "dark"
                            ? theme.palette.primary.light
                            : theme.palette.primary.main
                        : "inherit",
                })}
            >
                <ListItemText
                    primary={<span style={{ fontWeight: isActive ? 600 : 400 }}>{item.label}</span>}
                />
                {hasChildren ? (open ? <ExpandLess /> : <ExpandMore />) : null}
            </ListItemButton>
            {hasChildren && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {item.children!.map((child, idx) => (
                            <MobileMenuNode
                                key={child.path || idx}
                                item={child}
                                level={level + 1}
                                onClose={onClose}
                            />
                        ))}
                    </List>
                </Collapse>
            )}
        </Box>
    );
};

const MobileMenuGroup = ({
    menu,
    onClose,
}: {
    menu: { label: string; children: NavigationChild[] };
    onClose: () => void;
}) => {
    const [open, setOpen] = useState(false);

    return (
        <Box>
            <ListItemButton onClick={() => setOpen((prev) => !prev)} sx={{ pl: 2 }}>
                <ListItemText primary={<span style={{ fontWeight: 600 }}>{menu.label}</span>} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {menu.children.map((child, idx) => (
                        <MobileMenuNode key={child.path || idx} item={child} level={1} onClose={onClose} />
                    ))}
                </List>
            </Collapse>
        </Box>
    );
};

function TopBar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const { mode, toggleMode } = useColorMode();

    const handleDrawerToggle = () => setMobileOpen((prev) => !prev);
    const closeDrawer = () => setMobileOpen(false);

    // Close the drawer automatically on navigation, so it never lingers
    // open behind the new page after a link is tapped.
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    return (
        <AppBar position="sticky" elevation={2}>
            <Container maxWidth={false} disableGutters sx={{ px: { xs: 1, sm: 2 } }}>
                <Toolbar variant="dense" sx={{ display: "flex", justifyContent: "space-between", minHeight: { xs: 52, md: 56 } }}>
                    {/* Logo + Nav */}
                    <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>
                        <IconButton
                            color="inherit"
                            aria-label="open navigation menu"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 1, display: { md: "none" } }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Box
                            component={Link}
                            to="/dashboard"
                            sx={{
                                marginBottom: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-start",
                                transition: "box-shadow 0.2s ease, transform 0.2s ease",
                                filter: "brightness(0) invert(1)",
                                textDecoration: "none",
                                "&:hover": {
                                    transform: "scale(1.05)",
                                },
                            }}
                        >
                            <Box component="img" src={logo} alt="TTS Portal" sx={{ height: { xs: 26, md: 30 } }} />
                        </Box>

                        {/* Navigation Menus (Desktop Only) */}
                        <Box
                            sx={{
                                display: { xs: "none", md: "flex" },
                                ml: "35px",
                                alignItems: "center",
                            }}
                        >
                            <NavigationMenu />
                        </Box>
                    </Box>

                    {/* Right side */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
                        {/* Desktop toggle – on mobile the switch lives in the drawer */}
                        <Tooltip title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
                            <IconButton
                                color="inherit"
                                size="small"
                                aria-label="toggle dark mode"
                                onClick={toggleMode}
                                sx={{ display: { xs: "none", md: "inline-flex" } }}
                            >
                                {mode === "dark" ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
                            </IconButton>
                        </Tooltip>
                        {/* <ProfileMenu /> */}
                    </Box>
                </Toolbar>
            </Container>

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={closeDrawer}
                ModalProps={{ keepMounted: true }} // Better open performance on mobile.
                sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: "min(280px, 85vw)",
                    },
                }}
            >
                <Box
                    sx={{
                        p: 2,
                        display: "flex",
                        justifyContent: "center",
                        borderBottom: 1,
                        borderColor: "divider",
                    }}
                >
                    {/* The logo is dark artwork: turn it white on the dark drawer */}
                    <Box
                        component="img"
                        src={logo}
                        alt="TTS Portal"
                        sx={(theme) => ({
                            height: 40,
                            filter: theme.palette.mode === "dark" ? "brightness(0) invert(1)" : "none",
                        })}
                    />
                </Box>
                <List sx={{ overflowY: "auto" }}>
                    {navigationMenus.map((menu, idx) => (
                        <MobileMenuGroup key={menu.label || idx} menu={menu} onClose={closeDrawer} />
                    ))}
                </List>

                <FormGroup sx={{ px: 2, py: 1 }}>
                    <FormControlLabel
                        control={<ThemeModeSwitch checked={mode === "dark"} onChange={toggleMode} />}
                        label="Dark mode"
                    />
                </FormGroup>
            </Drawer>
        </AppBar>
    );
}

export default TopBar;