import { createTheme } from "@mui/material/styles";

/* ─────────────────────────────────────────────
 *  TTS Red & Black Theme — v3 (compact)
 *  Primary  : #C62828  (logo red)
 *  Secondary: #1a1a2e  (near-black charcoal)
 *  Compact density: smaller fields, tighter table
 *  rows, smaller buttons/chips/menus across the board.
 * ──────────────────────────────────────────── */

const ttsTheme = createTheme({
    spacing: 8,

    palette: {
        mode: "dark",
        primary: {
            main: "#C62828",
            light: "#EF5350",
            dark: "#8E0000",
            contrastText: "#ffffff",
        },
        secondary: {
            main: "#1a1a2e",
            light: "#33334d",
            dark: "#0d0d17",
            contrastText: "#ffffff",
        },
        error: { main: "#e53935" },
        warning: { main: "#f59e0b" },
        success: { main: "#10b981" },
        info: { main: "#3b82f6" },
        background: {
            default: "#f5f6fa",
            paper: "#ffffff",
        },
        text: {
            primary: "#1a1a2e",
            secondary: "#64748b",
        },
        divider: "rgba(255,255,255,0.08)",
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

    shape: {
        borderRadius: 8,
    },

    components: {
        /* ── AppBar ── */
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
                    color: "#ffffff",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
                    borderBottom: "1px solid #C62828",
                    borderRadius: 0,
                    height: "48px",
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
                sizeSmall: {
                    padding: "2px 8px",
                    fontSize: "0.72rem",
                    minHeight: 26,
                },
                sizeLarge: {
                    padding: "7px 18px",
                    fontSize: "0.85rem",
                },
                contained: {
                    boxShadow: "0 2px 6px rgba(198,40,40,0.35)",
                    "&:hover": { boxShadow: "0 3px 10px rgba(198,40,40,0.5)" },
                },
                outlined: {
                    borderWidth: "1.5px",
                    "&:hover": { borderWidth: "1.5px" },
                },
            },
        },
        MuiButtonGroup: {
            styleOverrides: { root: { borderRadius: 6 } },
        },
        MuiFab: {
            styleOverrides: { root: { boxShadow: "0 3px 10px rgba(198,40,40,0.4)" } },
        },

        /* ── Paper / Cards ── */
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    backgroundImage: "none",
                },
                elevation1: {
                    boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
                    border: "1px solid rgba(255,255,255,0.06)",
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
                    border: "1px solid rgba(255,255,255,0.06)",
                },
            },
        },
        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: 14,
                    "&:last-child": { paddingBottom: 14 },
                },
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
                        color: "#c9c9c9",
                        backgroundColor: "#1c1c1c",
                        borderBottom: "2px solid rgba(198,40,40,0.4)",
                        padding: "6px 10px",
                    },
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    "&:nth-of-type(even)": {
                        backgroundColor: "rgba(255,255,255,0.02)",
                    },
                    "&:hover": {
                        backgroundColor: "rgba(198,40,40,0.08) !important",
                    },
                    transition: "background-color 0.15s ease",
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: "1px solid #0a0a0a28",
                    padding: "5px 10px",
                    fontSize: "0.78rem",
                },
                sizeSmall: {
                    padding: "3px 8px",
                    fontSize: "0.74rem",
                },
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
            defaultProps: {
                variant: "outlined",
                size: "small",
            },
            styleOverrides: {
                root: {
                    backgroundColor: "#f6f9fcff",
                    borderRadius: 6,
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: { fontSize: "0.8rem" },
                input: {
                    padding: "6px 10px",
                    fontSize: "0.78rem",
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    backgroundColor: "#ffffff",
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0, 0, 0, 0.23)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(198,40,40,0.5)",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#C62828",
                        borderWidth: "2px",
                    },
                },
                // root: {
                //     borderRadius: 8,
                //     "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                //         borderColor: "#C62828",
                //         borderWidth: "2px",
                //     },
                // },
                input: {
                    "&.MuiInputBase-inputSizeSmall": {
                        padding: "5px 8px",
                    },
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
            styleOverrides: {
                root: { fontSize: "0.68rem", marginLeft: 4 },
            },
        },
        MuiFormLabel: {
            styleOverrides: {
                root: { fontSize: "0.82rem", fontWeight: 500 },
            },
        },
        MuiSelect: {
            defaultProps: {
                IconComponent: (props: React.HTMLAttributes<SVGSVGElement>) => (
                    <svg
                        {...props}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        style={{
                            ...((props as { style?: React.CSSProperties }).style),
                            fill: "#C62828",
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
                select: {
                    padding: "6px 10px",
                    paddingRight: "36px !important",
                },
                icon: {
                    color: "#C62828",
                    fontSize: "1.3rem",
                    right: 6,
                    transition: "transform 0.2s ease",
                },
                iconOpen: {
                    transform: "rotate(180deg)",
                    color: "#C62828",
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: { root: { padding: 4 } },
        },
        MuiRadio: {
            styleOverrides: { root: { padding: 4 } },
        },
        MuiAutocomplete: {
            styleOverrides: {
                inputRoot: { padding: "2px 6px !important" },
                option: {
                    borderRadius: 5,
                    margin: "1px 4px",
                    padding: "5px 10px",
                    fontSize: "0.8rem",
                    color: "#1a1a2e",
                    "&:hover": {
                        backgroundColor: "rgba(198,40,40,0.06) !important"
                    },
                    '&[aria-selected="true"]': {
                        backgroundColor: "rgba(198,40,40,0.10) !important",
                        "&.Mui-focused, &.Mui-focusVisible": {
                            backgroundColor: "rgba(198,40,40,0.15) !important",
                        },
                    },
                    "&.Mui-focused": {
                        backgroundColor: "rgba(198,40,40,0.06) !important",
                    },
                },
                paper: {
                    borderRadius: 8,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    border: "1px solid rgba(0,0,0,0.08)",
                    marginTop: 4,
                    backgroundColor: "#ffffff",
                },
            },
        },

        /* ── Chips ── */
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 5,
                    fontWeight: 600,
                    fontSize: "0.72rem",
                    height: 24,
                },
                sizeSmall: {
                    height: 20,
                    fontSize: "0.66rem",
                },
                label: { padding: "0 8px" },
            },
        },

        /* ── Tooltips ── */
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: "#1a1a2e",
                    fontSize: "0.72rem",
                    borderRadius: 5,
                    padding: "5px 10px",
                },
                arrow: { color: "#1a1a2e" },
            },
        },

        /* ── Menus ── */
        MuiMenu: {
            styleOverrides: {
                paper: {
                    borderRadius: 8,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    border: "1px solid rgba(0,0,0,0.08)",
                    marginTop: 4,
                    backgroundColor: "#ffffff",
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
                    color: "#1a1a2e",
                    "&:hover": { backgroundColor: "rgba(198,40,40,0.06)" },
                    "&.Mui-selected": {
                        backgroundColor: "rgba(198,40,40,0.10)",
                        "&:hover": { backgroundColor: "rgba(198,40,40,0.15)" },
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
                    backgroundColor: "#141414",
                    backgroundImage: "none",
                },
            },
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: { fontSize: "1.05rem", fontWeight: 700, padding: "16px 20px 10px" },
            },
        },
        MuiDialogContent: {
            styleOverrides: { root: { padding: "6px 20px" } },
        },
        MuiDialogActions: {
            styleOverrides: { root: { padding: "10px 20px 16px" } },
        },

        /* ── Tabs ── */
        MuiTabs: {
            styleOverrides: {
                root: { minHeight: 38 },
                indicator: { height: 2, borderRadius: "2px 2px 0 0" },
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
                },
            },
        },

        /* ── Avatar ── */
        MuiAvatar: {
            styleOverrides: {
                root: { width: 32, height: 32, fontSize: "0.85rem" },
            },
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

        /* ── Switch (Toggle) ── */
        MuiSwitch: {
            styleOverrides: {
                switchBase: {
                    color: "#9ca3af", // Grey thumb for inactive
                },
                track: {
                    opacity: 0.4,
                    backgroundColor: "#6b7280", // Grey track for inactive
                    ".Mui-checked.Mui-checked + &": {
                        opacity: 0.6, // Keep standard opacity for success/primary when active
                    },
                },
            },
        },

        /* ── Scrollbar (dark, matches theme) ── */
        MuiCssBaseline: {
            styleOverrides: {
                // Global dark scrollbar
                "*::-webkit-scrollbar": { width: 8, height: 8 },
                "*::-webkit-scrollbar-track": { background: "rgba(198, 40, 40, 0.45)" }, // Red bar (track)
                "*::-webkit-scrollbar-thumb": {
                    background: "#000000", // Black button (thumb)
                    borderRadius: 4,
                },
                "*::-webkit-scrollbar-thumb:hover": { background: "#1a1a1a" },

                // Light scrollbar inside white Select/Menu dropdowns
                ".MuiMenu-paper::-webkit-scrollbar": { width: 6 },
                ".MuiMenu-paper::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                    borderRadius: 4,
                },
                ".MuiMenu-paper::-webkit-scrollbar-thumb": {
                    background: "#c0c0c0",
                    borderRadius: 4,
                    border: "1px solid #f1f1f1",
                },
                ".MuiMenu-paper::-webkit-scrollbar-thumb:hover": {
                    background: "#909090",
                },
                ".MuiPopover-paper::-webkit-scrollbar": { width: 6 },
                ".MuiPopover-paper::-webkit-scrollbar-track": {
                    background: "#f1f1f1",
                    borderRadius: 4,
                },
                ".MuiPopover-paper::-webkit-scrollbar-thumb": {
                    background: "#c0c0c0",
                    borderRadius: 4,
                    border: "1px solid #f1f1f1",
                },
                ".MuiPopover-paper::-webkit-scrollbar-thumb:hover": {
                    background: "#909090",
                },
                "input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active, textarea:-webkit-autofill, textarea:-webkit-autofill:hover, textarea:-webkit-autofill:focus, textarea:-webkit-autofill:active": {
                    WebkitBoxShadow: "0 0 0 1000px #ffffff inset !important",
                    boxShadow: "0 0 0 1000px #ffffff inset !important",
                    WebkitTextFillColor: "#1a1a2e !important",
                    caretColor: "#1a1a2e !important",
                    borderRadius: "6px",
                    transition: "background-color 5000s ease-in-out 0s",
                },
            },
        },
    },
});

export default ttsTheme;