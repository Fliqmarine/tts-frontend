import { useEffect, useState } from "react";
import {
    AppBar,
    Box,
    Container,
    Toolbar,
    IconButton,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    Collapse,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
const logo = "/TTS_Logo.png";
import NavigationMenu, { navigationMenus } from "../config/MenuConfig";
import type { NavigationChild } from "../config/MenuConfig";
// import ProfileMenu from "./profile/ProfileMenu";

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
                sx={{ pl: 2 + level * 2, color: isActive ? "#C62828" : "inherit" }}
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
                                    // boxShadow: "0 4px 14px rgba(255, 255, 255, 0.5)",
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
                    <Box sx={{ display: "flex", gap: 2, flexShrink: 0 }}>
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
                    <Box component="img" src={logo} alt="TTS Portal" sx={{ height: 40 }} />
                </Box>
                <List sx={{ overflowY: "auto" }}>
                    {navigationMenus.map((menu, idx) => (
                        <MobileMenuGroup key={menu.label || idx} menu={menu} onClose={closeDrawer} />
                    ))}
                </List>
            </Drawer>
        </AppBar>
    );
}

export default TopBar;