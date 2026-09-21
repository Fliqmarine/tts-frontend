import type { CSSProperties, HTMLAttributes } from "react";
import { createTheme, alpha, type PaletteMode } from "@mui/material/styles";

/* ─────────────────────────────────────────────────────────────
 *  TTS Dark Teal & Gold Theme — v7 (compact, light + dark)
 *  Executive + maritime
 *
 *  Brand   : #073B3A (deep teal)  #C9A227 (gold)  #F5F7F4 (mist)
 *  Density : compact fields, tight table rows, small buttons/chips
 *
 *  Usage:
 *    Wrap the app in <ColorModeProvider> (ColorModeContext.tsx), which calls
 *    getTtsTheme(mode) and renders ThemeProvider + CssBaseline for you.
 * ───────────────────────────────────────────────────────────── */

/* ── Per-mode design tokens ── */
const tokens = {
    light: {
        palette: {
            primary: { main: "#073B3A", light: "#2F6462", dark: "#04292A", contrastText: "#FFFFFF" },
            secondary: { main: "#C9A227", light: "#DDBF5C", dark: "#9A7C15", contrastText: "#1B1500" },
            error: { main: "#C0574F" },
            warning: { main: "#E08A2E" },
            success: { main: "#3E9B72" },
            info: { main: "#2F7FA8" },
            background: { default: "#F5F7F4", paper: "#FFFFFF" },
            text: { primary: "#10221F", secondary: "#51635F" },
            divider: "#DCE3DF",
        },
        accent: "#073B3A", // icons, hover tint, scrollbar hover
        appBar: "linear-gradient(135deg, #0B4F4D 0%, #073B3A 100%)",
        appBarBorder: "#C9A227",
        appBarShadow: "0 2px 10px rgba(4,41,42,0.25)",
        tableHeadBg: "#0B4F4D",
        tableHeadText: "#FFFFFF",
        tableHeadBorder: "#C9A227",
        tableRowLine: "rgba(16,34,31,0.10)",
        inputBg: "#FFFFFF",
        inputBorder: "#D3DCD8",
        inputBorderHover: "#5E8A87",
        inputBorderFocus: "#073B3A",
        surfaceBorder: "#DCE3DF",
        surfaceShadow: "0 1px 4px rgba(7,59,58,0.10)",
        cardShadow: "0 2px 10px rgba(7,59,58,0.12)",
        menuBg: "#FFFFFF",
        menuBorder: "rgba(7,59,58,0.12)",
        menuShadow: "0 8px 24px rgba(4,41,42,0.14)",
        tooltipBg: "#073B3A",
        scrollTrack: "#E6ECE9",
        scrollThumb: "#5E8A87",
        scrollThumbHover: "#073B3A",
        switchOff: "#7C8C88",
        buttonShadow: "0 2px 6px rgba(7,59,58,0.25)",
        buttonShadowHover: "0 3px 10px rgba(7,59,58,0.35)",
    },
    dark: {
        palette: {
            primary: { main: "#2F8F89", light: "#5FB5AF", dark: "#073B3A", contrastText: "#FFFFFF" },
            secondary: { main: "#D4AF37", light: "#E3C766", dark: "#C9A227", contrastText: "#1B1500" },
            error: { main: "#E07A72" },
            warning: { main: "#E6A04A" },
            success: { main: "#4FBF95" },
            info: { main: "#5AB0D8" },
            background: { default: "#051A1A", paper: "#0A2727" },
            text: { primary: "#E9F0ED", secondary: "#9DB3AE" },
            divider: "#1D3F3D",
        },
        accent: "#5FB5AF",
        appBar: "linear-gradient(135deg, #073B3A 0%, #04292A 100%)",
        appBarBorder: "#D4AF37",
        appBarShadow: "0 2px 12px rgba(0,0,0,0.5)",
        tableHeadBg: "#0F4644",
        tableHeadText: "#F3EBCB",
        tableHeadBorder: "#D4AF37",
        tableRowLine: "rgba(233,240,237,0.08)",
        inputBg: "#0D2F2E",
        inputBorder: "#25514E",
        inputBorderHover: "#3E8580",
        inputBorderFocus: "#5FB5AF",
        surfaceBorder: "#1D3F3D",
        surfaceShadow: "0 1px 4px rgba(0,0,0,0.35)",
        cardShadow: "0 2px 10px rgba(0,0,0,0.4)",
        menuBg: "#0D2F2E",
        menuBorder: "rgba(95,181,175,0.20)",
        menuShadow: "0 8px 24px rgba(0,0,0,0.5)",
        tooltipBg: "#0F4644",
        scrollTrack: "#082222",
        scrollThumb: "#2F6F6A",
        scrollThumbHover: "#5FB5AF",
        switchOff: "#6F8781",
        buttonShadow: "0 2px 6px rgba(0,0,0,0.4)",
        buttonShadowHover: "0 3px 10px rgba(0,0,0,0.5)",
    },
} as const;

/* ── Theme factory ── */
export const getTtsTheme = (mode: PaletteMode) => {
    const t = tokens[mode];
    const hoverBg = alpha(t.accent, mode === "light" ? 0.06 : 0.12);
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

        shape: { borderRadius: 8 },

        components: {
            /* ── AppBar ── */
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        background: t.appBar,
                        color: "#FFFFFF",
                        boxShadow: t.appBarShadow,
                        borderBottom: `2px solid ${t.appBarBorder}`,
                        borderRadius: 0,
                    },
                },
            },
            MuiToolbar: {
                styleOverrides: {
                    root: {
                        minHeight: 48,
                        "@media (min-width:600px)": { minHeight: 48 },
                    },
                },
            },

            /* ── Buttons ── */
            MuiButton: {
                defaultProps: { disableElevation: true },
                styleOverrides: {
                    root: {
                        borderRadius: 6,
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
                        "&:hover": { boxShadow: t.buttonShadowHover },
                    },
                    outlined: {
                        borderWidth: "1.5px",
                        "&:hover": { borderWidth: "1.5px" },
                    },
                },
            },
            MuiButtonGroup: { styleOverrides: { root: { borderRadius: 6 } } },
            MuiFab: { styleOverrides: { root: { boxShadow: t.buttonShadow } } },

            /* ── Paper / Cards ── */
            MuiPaper: {
                styleOverrides: {
                    root: { borderRadius: 10, backgroundImage: "none" },
                    elevation1: {
                        boxShadow: t.surfaceShadow,
                        border: `1px solid ${t.surfaceBorder}`,
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 10,
                        boxShadow: t.cardShadow,
                        border: `1px solid ${t.surfaceBorder}`,
                    },
                },
            },
            MuiCardContent: {
                styleOverrides: {
                    root: { padding: 14, "&:last-child": { paddingBottom: 14 } },
                },
            },
            MuiCardHeader: {
                styleOverrides: {
                    root: { padding: "12px 16px" },
                    title: { fontSize: "0.95rem", fontWeight: 700 },
                    subheader: { fontSize: "0.78rem" },
                },
            },

            /* ── Table (compact rows) ── */
            MuiTableHead: {
                styleOverrides: {
                    root: {
                        "& .MuiTableCell-head": {
                            fontWeight: 700,
                            fontSize: "0.7rem",
                            textTransform: "uppercase" as const,
                            letterSpacing: "0.4px",
                            color: t.tableHeadText,
                            backgroundColor: t.tableHeadBg,
                            borderBottom: `2px solid ${t.tableHeadBorder}`,
                            padding: "6px 10px",
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
                        padding: "5px 10px",
                        fontSize: "0.78rem",
                    },
                    sizeSmall: { padding: "3px 8px", fontSize: "0.74rem" },
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
                    root: { backgroundColor: t.inputBg, borderRadius: 6 },
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
                        borderRadius: 6,
                        backgroundColor: t.inputBg,
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: t.inputBorder },
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: t.inputBorderHover },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: t.inputBorderFocus,
                            borderWidth: "2px",
                        },
                    },
                    input: {
                        "&.MuiInputBase-inputSizeSmall": { padding: "5px 8px" },
                    },
                },
            },
            MuiInputLabel: {
                styleOverrides: {
                    root: { fontSize: "0.78rem" },
                    sizeSmall: { fontSize: "0.76rem" },
                },
            },
            MuiFormHelperText: {
                styleOverrides: { root: { fontSize: "0.68rem", marginLeft: 4 } },
            },
            MuiFormLabel: {
                styleOverrides: { root: { fontSize: "0.82rem", fontWeight: 500 } },
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
                        borderRadius: 5,
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
                        borderRadius: 8,
                        boxShadow: t.menuShadow,
                        border: `1px solid ${t.menuBorder}`,
                        marginTop: 4,
                        backgroundColor: t.menuBg,
                    },
                },
            },

            /* ── Chips ── */
            MuiChip: {
                styleOverrides: {
                    root: { borderRadius: 5, fontWeight: 600, fontSize: "0.72rem", height: 24 },
                    sizeSmall: { height: 20, fontSize: "0.66rem" },
                    label: { padding: "0 8px" },
                },
            },

            /* ── Tooltips ── */
            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        backgroundColor: t.tooltipBg,
                        color: "#FFFFFF",
                        fontSize: "0.72rem",
                        borderRadius: 5,
                        padding: "5px 10px",
                    },
                    arrow: { color: t.tooltipBg },
                },
            },

            /* ── Menus ── */
            MuiMenu: {
                styleOverrides: {
                    paper: {
                        borderRadius: 8,
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
                        borderRadius: 5,
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
            MuiListItemButton: {
                styleOverrides: {
                    root: { borderRadius: 6, padding: "6px 12px", minHeight: 36 },
                },
            },
            MuiListItemText: {
                styleOverrides: {
                    primary: { fontSize: "0.85rem" },
                    secondary: { fontSize: "0.72rem" },
                },
            },

            /* ── IconButton ── */
            MuiIconButton: {
                styleOverrides: {
                    root: { borderRadius: 6, padding: 6, transition: "all 0.2s ease" },
                    sizeSmall: { padding: 4 },
                },
            },

            /* ── Dialogs ── */
            MuiDialog: {
                styleOverrides: {
                    paper: {
                        borderRadius: 12,
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

            /* ── Tabs (gold indicator) ── */
            MuiTabs: {
                styleOverrides: {
                    root: { minHeight: 38 },
                    indicator: {
                        height: 3,
                        borderRadius: "3px 3px 0 0",
                        backgroundColor: t.palette.secondary.main,
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
                        "&.Mui-selected": {
                            color: mode === "dark" ? t.palette.primary.light : t.palette.primary.main,
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
                    root: { borderRadius: 8, padding: "6px 14px", fontSize: "0.8rem" },
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
                            borderRadius: "6px",
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