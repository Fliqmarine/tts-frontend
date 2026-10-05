import type { CSSProperties, HTMLAttributes } from "react";
import { createTheme, alpha, type PaletteMode } from "@mui/material/styles";

/* ─────────────────────────────────────────────────────────────
 *  TTS Blue & White Theme — v8 (compact, light + dark)
 *  SaaS dashboard style (blue sidebar, white cards, soft shadows)
 *
 *  Brand   : #3D5AFE (electric blue)  #FFFFFF (white)  #F4F6FB (mist)
 *  Density : compact fields, tight table rows, small buttons/chips
 *
 *  Usage:
 *    Wrap the app in <ColorModeProvider> (ColorModeContext.tsx), which calls
 *    getTtsTheme(mode) and renders ThemeProvider + CssBaseline for you.
 * #3dfe8a
 * ───────────────────────────────────────────────────────────── */

/* ── Per-mode design tokens ── */
const tokens = {
    light: {
        palette: {
            primary: { main: "#3D5AFE", light: "#7B8FFF", dark: "#2A3ECF", contrastText: "#FFFFFF" },
            secondary: { main: "#6C5CE7", light: "#9C90F5", dark: "#4C3FC0", contrastText: "#FFFFFF" },
            error: { main: "#F2545B" },
            warning: { main: "#FFB020" },
            success: { main: "#3DD598" },
            info: { main: "#2F80ED" },
            background: { default: "#f5f6fe", paper: "#FFFFFF" },
            text: { main:"#3D5AFE",primary: "#1A1F36", secondary: "#6B7280" },
            divider: "#c2ccfd",
        },
        accent: "#3D5AFE", // icons, hover tint, scrollbar hover
        appBar: "#FFFFFF",
        appBarBorder: "#E7E9F3",
        appBarShadow: "0 1px 3px rgba(20,20,43,0.06)",
        sidebarBg: "linear-gradient(180deg, #4C6AFF 0%, #3D5AFE 60%, #2A3ECF 100%)",
        sidebarText: "#FFFFFF",
        sidebarTextMuted: "rgba(255,255,255,0.72)",
        sidebarActiveBg: "#FFFFFF",
        sidebarActiveText: "#3D5AFE",
        sidebarHoverBg: "rgba(255,255,255,0.12)",
        tableHeadBg: "#F4F6FB",
        tableHeadText: "#6B7280",
        tableHeadBorder: "#9cadff",
        tableRowLine: "rgba(54, 26, 26, 0.1)",
        inputBg: "#FFFFFF",
        inputBorder: "#b9bdca",
        inputBorderHover: "#B7C0F5",
        inputBorderFocus: "#3D5AFE",
        surfaceBorder: "#EDEFF7",
        surfaceShadow: "0 1px 4px rgba(20,20,43,0.06)",
        cardShadow: "0 6px 18px rgba(61,90,254,0.10)",
        menuBg: "#FFFFFF",
        menuBorder: "rgba(20,20,43,0.08)",
        menuShadow: "0 10px 28px rgba(20,20,43,0.12)",
        tooltipBg: "#1A1F36",
        scrollTrack: "#fddce6",
        scrollThumb: "#C7CEEB",
        scrollThumbHover: "#3D5AFE",
        switchOff: "#C4C9DC",
        buttonShadow: "0 2px 8px rgba(61,90,254,0.25)",
        buttonShadowHover: "0 4px 14px rgba(61,90,254,0.5)",
    },
    dark: {
        palette: {
            primary: { main: "#6B82FF", light: "#93A5FF", dark: "#3D5AFE", contrastText: "#FFFFFF" },
            secondary: { main: "#8F7BFF", light: "#B2A4FF", dark: "#6C5CE7", contrastText: "#FFFFFF" },
            error: { main: "#FF6B6F" },
            warning: { main: "#FFC24B" },
            success: { main: "#4FE3B0" },
            info: { main: "#6EA8FF" },
            background: { default: "#0E1330", paper: "#161B3D" },
            text: { primary: "#EDEFFA", secondary: "#9AA0C3" },
            divider: "#242A54",
        },
        accent: "#8CA0FF",
        appBar: "#161B3D",
        appBarBorder: "#242A54",
        appBarShadow: "0 2px 10px rgba(0,0,0,0.4)",
        sidebarBg: "linear-gradient(180deg, #1B215A 0%, #131A4A 55%, #0E1330 100%)",
        sidebarText: "#EDEFFA",
        sidebarTextMuted: "rgba(237,239,250,0.65)",
        sidebarActiveBg: "#3D5AFE",
        sidebarActiveText: "#FFFFFF",
        sidebarHoverBg: "rgba(255,255,255,0.08)",
        tableHeadBg: "#1B2150",
        tableHeadText: "#C7CDEE",
        tableHeadBorder: "#2A3166",
        tableRowLine: "rgba(237,239,250,0.07)",
        inputBg: "#161B3D",
        inputBorder: "#2A3166",
        inputBorderHover: "#44508F",
        inputBorderFocus: "#6B82FF",
        surfaceBorder: "#242A54",
        surfaceShadow: "0 1px 4px rgba(0,0,0,0.35)",
        cardShadow: "0 6px 18px rgba(0,0,0,0.4)",
        menuBg: "#161B3D",
        menuBorder: "rgba(139,151,255,0.2)",
        menuShadow: "0 10px 28px rgba(0,0,0,0.5)",
        tooltipBg: "#1B2150",
        scrollTrack: "#10143A",
        scrollThumb: "#2F386E",
        scrollThumbHover: "#6B82FF",
        switchOff: "#4A5180",
        buttonShadow: "0 2px 6px rgba(0,0,0,0.4)",
        buttonShadowHover: "0 3px 10px rgba(0,0,0,0.5)",
    },
} as const;

/* ── Theme factory ── */
export const getTtsTheme = (mode: PaletteMode) => {
    const t = tokens[mode];
    const hoverBg = alpha(t.accent, mode === "light" ? 0.16 : 0.12);
    const selectedBg = alpha(t.accent, mode === "light" ? 0.10 : 0.20);
    const selectedHoverBg = alpha(t.accent, mode === "light" ? 0.15 : 0.28);
    const zebraBg = alpha(t.accent, mode === "light" ? 0.03 : 0.06);

    return createTheme({
        spacing: 8,

        palette: {
            mode,
            ...t.palette,
        },

        typography: {
            fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
            fontSize: 13,
            h1: { fontWeight: 800, letterSpacing: "-1px", fontSize: "2.25rem" },
            h2: { fontWeight: 800, letterSpacing: "-0.8px", fontSize: "1.9rem" },
            h3: { fontWeight: 700, letterSpacing: "-0.6px", fontSize: "1.6rem" },
            h4: { fontWeight: 700, letterSpacing: "-0.5px", fontSize: "1.35rem" },
            h5: { fontWeight: 700, letterSpacing: "-0.3px", fontSize: "1.15rem" },
            h6: { fontWeight: 600, fontSize: "1rem" },
            subtitle1: { fontWeight: 600, fontSize: "0.9rem" },
            subtitle2: { fontWeight: 600, fontSize: "0.82rem" },
            body1: { fontSize: "0.85rem" },
            body2: { fontSize: "0.78rem" },
            caption: { fontSize: "0.7rem" },
            button: { textTransform: "none" as const, fontWeight: 600, fontSize: "0.8rem" },
        },

        shape: { borderRadius: 10 },

        components: {
            /* ── AppBar (white top bar, matches the screenshot's header row) ── */
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        background: t.appBar,
                        color: t.palette.text.primary,
                        boxShadow: t.appBarShadow,
                        borderBottom: `1px solid ${t.appBarBorder}`,
                        borderRadius: 0,
                    },
                },
            },
            MuiToolbar: {
                styleOverrides: {
                    root: {
                        minHeight: 56,
                        "@media (min-width:600px)": { minHeight: 56 },
                    },
                },
            },

            /* ── Sidebar (Drawer) — blue gradient, white text, pill-style active item ── */
            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        background: t.sidebarBg,
                        color: t.sidebarText,
                        border: "none",
                    },
                },
            },
            MuiList: {
                styleOverrides: {
                    root: { padding: "4px 12px" },
                },
            },
            MuiListItemIcon: {
                styleOverrides: {
                    root: {
                        minWidth: 34,
                        color: "inherit",
                    },
                },
            },

            /* ── Buttons ── */
            MuiButton: {
                defaultProps: { disableElevation: true },
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        textTransform: "none" as const,
                        fontWeight: 600,
                        padding: "4px 12px",
                        fontSize: "0.78rem",
                        minHeight: 30,
                    },
                    sizeSmall: { padding: "2px 8px", fontSize: "0.72rem", minHeight: 26 },
                    sizeLarge: { padding: "7px 18px", fontSize: "0.85rem" },
                    contained: {
                        boxShadow: t.buttonShadow,
                        "&:hover": {
                            backgroundColor: t.palette.primary.dark,
                            boxShadow: t.buttonShadowHover,
                        },
                    },
                    outlined: {
                        borderWidth: "1.5px",
                        "&:hover": {
                            backgroundColor: hoverBg,
                            borderWidth: "1.5px",
                        },
                    },
                },
            },
            MuiButtonGroup: { styleOverrides: { root: { borderRadius: 8 } } },
            MuiFab: { styleOverrides: { root: { boxShadow: t.buttonShadow } } },

            /* ── Paper / Cards ── */
            MuiPaper: {
                styleOverrides: {
                    root: { borderRadius: 14, backgroundImage: "none" },
                    elevation1: {
                        boxShadow: t.surfaceShadow,
                        border: `1px solid ${t.surfaceBorder}`,
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 14,
                        boxShadow: t.cardShadow,
                        border: `1px solid ${t.surfaceBorder}`,
                    },
                },
            },
            MuiCardContent: {
                styleOverrides: {
                    root: { padding: 16, "&:last-child": { paddingBottom: 16 } },
                },
            },
            MuiCardHeader: {
                styleOverrides: {
                    root: { padding: "12px 16px" },
                    title: { fontSize: "0.95rem", fontWeight: 700 },
                    subheader: { fontSize: "0.78rem" },
                },
            },

            /* ── Table (compact rows, light header like the screenshot) ── */
            MuiTableHead: {
                styleOverrides: {
                    root: {
                        "& .MuiTableCell-head": {
                            fontWeight: 700,
                            fontSize: "0.68rem",
                            textTransform: "uppercase" as const,
                            letterSpacing: "0.4px",
                            color: t.tableHeadText,
                            backgroundColor: t.tableHeadBg,
                            borderBottom: `1px solid ${t.tableHeadBorder}`,
                            padding: "8px 10px",
                        },
                    },
                },
            },
            MuiTableRow: {
                styleOverrides: {
                    root: {
                        "&:nth-of-type(even)": { backgroundColor: zebraBg },
                        "&:hover": { backgroundColor: `${hoverBg} !important` },
                        transition: "background-color 0.15s ease",
                    },
                },
            },
            MuiTableCell: {
                styleOverrides: {
                    root: {
                        borderBottom: `1px solid ${t.tableRowLine}`,
                        padding: "6px 10px",
                        fontSize: "0.78rem",
                    },
                    sizeSmall: { padding: "4px 8px", fontSize: "0.74rem" },
                },
            },
            MuiTablePagination: {
                styleOverrides: {
                    root: { fontSize: "0.78rem" },
                    toolbar: { minHeight: 44, paddingLeft: 8, paddingRight: 8 },
                    selectLabel: { fontSize: "0.78rem" },
                    displayedRows: { fontSize: "0.78rem" },
                },
            },

            /* ── Inputs (small fields) ── */
            MuiTextField: {
                defaultProps: { variant: "outlined", size: "small" },
                styleOverrides: {
                    root: { backgroundColor: t.inputBg, borderRadius: 8 },
                },
            },
            MuiInputBase: {
                styleOverrides: {
                    root: { fontSize: "0.8rem" },
                    input: { padding: "6px 10px", fontSize: "0.78rem" },
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        backgroundColor: t.inputBg,
                        "&.Mui-disabled": {
                            backgroundColor: alpha(t.palette.text.primary, 0.05),
                        },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: t.inputBorder },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: t.inputBorderHover },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: t.inputBorderFocus,
                            borderWidth: "2px",
                        },
                        "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
                            borderColor: alpha(t.palette.text.primary, 0.1),
                        },
                    },
                    input: {
                        "&.MuiInputBase-inputSizeSmall": { padding: "5px 8px" },
                        "&.Mui-disabled": {
                            WebkitTextFillColor: alpha(t.palette.text.primary, 0.6),
                        },
                    },
                },
            },
            MuiInputLabel: {
                styleOverrides: {
                    root: {
                        fontSize: "0.78rem",
                        "& .MuiFormLabel-asterisk": {
                            color: t.palette.error.main,
                        },
                    },
                    sizeSmall: { fontSize: "0.76rem" },
                },
            },
            MuiFormHelperText: {
                styleOverrides: { root: { fontSize: "0.68rem", marginLeft: 4 } },
            },
            MuiFormLabel: {
                styleOverrides: {
                    root: {
                        fontSize: "0.82rem",
                        fontWeight: 500,
                        "& .MuiFormLabel-asterisk": {
                            color: t.palette.error.main,
                        },
                    },
                },
            },
            MuiSelect: {
                defaultProps: {
                    IconComponent: (props: HTMLAttributes<SVGSVGElement>) => (
                        <svg
                            {...props}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            style={{
                                ...((props as { style?: CSSProperties }).style),
                                fill: "currentColor",
                                marginRight: 6,
                                flexShrink: 0,
                                pointerEvents: "none",
                            }}
                        >
                            <path d="M7 10l5 5 5-5z" />
                        </svg>
                    ),
                },
                styleOverrides: {
                    select: { padding: "6px 10px", paddingRight: "36px !important" },
                    icon: {
                        color: t.accent,
                        fontSize: "1.3rem",
                        right: 6,
                        transition: "transform 0.2s ease",
                    },
                    iconOpen: { transform: "rotate(180deg)", color: t.accent },
                },
            },
            MuiCheckbox: { styleOverrides: { root: { padding: 4 } } },
            MuiRadio: { styleOverrides: { root: { padding: 4 } } },
            MuiAutocomplete: {
                styleOverrides: {
                    inputRoot: { padding: "2px 6px !important" },
                    option: {
                        borderRadius: 6,
                        margin: "1px 4px",
                        padding: "5px 10px",
                        fontSize: "0.8rem",
                        color: t.palette.text.primary,
                        "&:hover": { backgroundColor: `${hoverBg} !important` },
                        '&[aria-selected="true"]': {
                            backgroundColor: `${selectedBg} !important`,
                            "&.Mui-focused, &.Mui-focusVisible": {
                                backgroundColor: `${selectedHoverBg} !important`,
                            },
                        },
                        "&.Mui-focused": { backgroundColor: `${hoverBg} !important` },
                    },
                    paper: {
                        borderRadius: 10,
                        boxShadow: t.menuShadow,
                        border: `1px solid ${t.menuBorder}`,
                        marginTop: 4,
                        backgroundColor: t.menuBg,
                    },
                },
            },

            /* ── Chips (status pills — pending/dispatch/completed look) ── */
            MuiChip: {
                styleOverrides: {
                    root: { borderRadius: 6, fontWeight: 600, fontSize: "0.72rem", height: 24 },
                    sizeSmall: { height: 20, fontSize: "0.66rem" },
                    label: { padding: "0 8px" },
                    colorError: {
                        backgroundColor: alpha(t.palette.error.main, mode === "light" ? 0.12 : 0.22),
                        color: t.palette.error.main,
                    },
                    colorSuccess: {
                        backgroundColor: alpha(t.palette.success.main, mode === "light" ? 0.12 : 0.22),
                        color: mode === "light" ? "#1E9E75" : t.palette.success.main,
                    },
                    colorWarning: {
                        backgroundColor: alpha(t.palette.warning.main, mode === "light" ? 0.14 : 0.24),
                        color: mode === "light" ? "#B5720B" : t.palette.warning.main,
                    },
                    colorDefault: {
                        backgroundColor: alpha(t.palette.text.secondary, mode === "light" ? 0.10 : 0.18),
                        color: t.palette.text.secondary,
                    },
                },
            },

            /* ── Tooltips ── */
            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        backgroundColor: t.tooltipBg,
                        color: "#FFFFFF",
                        fontSize: "0.72rem",
                        borderRadius: 6,
                        padding: "5px 10px",
                    },
                    arrow: { color: t.tooltipBg },
                },
            },

            /* ── Menus ── */
            MuiMenu: {
                styleOverrides: {
                    paper: {
                        borderRadius: 10,
                        boxShadow: t.menuShadow,
                        border: `1px solid ${t.menuBorder}`,
                        marginTop: 4,
                        backgroundColor: t.menuBg,
                    },
                },
            },
            MuiMenuItem: {
                styleOverrides: {
                    root: {
                        borderRadius: 6,
                        margin: "1px 4px",
                        padding: "5px 10px",
                        fontSize: "0.8rem",
                        minHeight: 30,
                        color: t.palette.text.primary,
                        "&:hover": { backgroundColor: hoverBg },
                        "&.Mui-selected": {
                            backgroundColor: selectedBg,
                            "&:hover": { backgroundColor: selectedHoverBg },
                        },
                    },
                },
            },

            /* Sidebar nav items use ListItemButton — rounded pill, white when selected,
               translucent white on hover, matching the reference screenshot */
            MuiListItemButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 10,
                        padding: "9px 14px",
                        minHeight: 42,
                        marginBottom: 4,
                        color: t.sidebarTextMuted,
                        "&:hover": { backgroundColor: t.sidebarHoverBg, color: t.sidebarText },
                        "&.Mui-selected": {
                            backgroundColor: t.sidebarActiveBg,
                            color: t.sidebarActiveText,
                            boxShadow: mode === "light" ? "0 4px 12px rgba(20,20,43,0.18)" : "none",
                            "& .MuiListItemIcon-root": { color: t.sidebarActiveText },
                            "&:hover": { backgroundColor: t.sidebarActiveBg },
                        },
                    },
                },
            },
            MuiListItemText: {
                styleOverrides: {
                    primary: { fontSize: "0.85rem", fontWeight: 600 },
                    secondary: { fontSize: "0.72rem" },
                },
            },

            /* ── IconButton ── */
            MuiIconButton: {
                styleOverrides: {
                    root: { borderRadius: 8, padding: 6, transition: "all 0.2s ease" },
                    sizeSmall: { padding: 4 },
                },
            },

            /* ── Dialogs ── */
            MuiDialog: {
                styleOverrides: {
                    paper: {
                        borderRadius: 14,
                        backgroundColor: t.palette.background.paper,
                        backgroundImage: "none",
                    },
                },
            },
            MuiDialogTitle: {
                styleOverrides: {
                    root: { fontSize: "1.05rem", fontWeight: 700, padding: "16px 20px 10px" },
                },
            },
            MuiDialogContent: { styleOverrides: { root: { padding: "6px 20px" } } },
            MuiDialogActions: { styleOverrides: { root: { padding: "10px 20px 16px" } } },

            /* ── Tabs (blue underline indicator) ── */
            MuiTabs: {
                styleOverrides: {
                    root: { minHeight: 38 },
                    indicator: {
                        height: 3,
                        borderRadius: "3px 3px 0 0",
                        backgroundColor: t.palette.primary.main,
                    },
                },
            },
            MuiTab: {
                styleOverrides: {
                    root: {
                        textTransform: "none" as const,
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        minHeight: 38,
                        padding: "8px 14px",
                        color: t.palette.text.secondary,
                        "&.Mui-selected": {
                            color: t.palette.primary.main,
                        },
                    },
                },
            },

            /* ── Avatar ── */
            MuiAvatar: {
                styleOverrides: { root: { width: 32, height: 32, fontSize: "0.85rem" } },
            },

            /* ── Alerts ── */
            MuiAlert: {
                styleOverrides: {
                    root: { borderRadius: 10, padding: "6px 14px", fontSize: "0.8rem" },
                },
            },

            /* ── Badge ── */
            MuiBadge: {
                styleOverrides: {
                    badge: { fontSize: "0.62rem", height: 16, minWidth: 16, borderRadius: 8 },
                },
            },

            /* ── Switch ── */
            MuiSwitch: {
                styleOverrides: {
                    switchBase: { color: t.switchOff },
                    track: {
                        opacity: 0.4,
                        backgroundColor: t.switchOff,
                        ".Mui-checked.Mui-checked + &": { opacity: 0.6 },
                    },
                },
            },

            /* ── Global: scrollbars + autofill ── */
            MuiCssBaseline: {
                styleOverrides: {
                    html: { colorScheme: mode },
                    "*::-webkit-scrollbar": { width: 8, height: 8 },
                    "*::-webkit-scrollbar-track": { background: t.scrollTrack },
                    "*::-webkit-scrollbar-thumb": {
                        background: t.scrollThumb,
                        borderRadius: 4,
                    },
                    "*::-webkit-scrollbar-thumb:hover": { background: t.scrollThumbHover },

                    "input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active, textarea:-webkit-autofill, textarea:-webkit-autofill:hover, textarea:-webkit-autofill:focus, textarea:-webkit-autofill:active":
                    {
                        WebkitBoxShadow: `0 0 0 1000px ${t.inputBg} inset !important`,
                        boxShadow: `0 0 0 1000px ${t.inputBg} inset !important`,
                        WebkitTextFillColor: `${t.palette.text.primary} !important`,
                        caretColor: `${t.palette.text.primary} !important`,
                        borderRadius: "8px",
                        transition: "background-color 5000s ease-in-out 0s",
                    },
                },
            },
        },
    });
};

/** Alias so older imports of `getTheme` keep working */
export const getTheme = getTtsTheme;

/** Default export (light) so a legacy `import ttsTheme from "./ttsTheme"` still compiles */
export default getTtsTheme("light");