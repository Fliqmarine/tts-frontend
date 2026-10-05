import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import type { ReactNode } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import type { PaletteMode } from "@mui/material";
import { getTtsTheme } from "./ttsTheme";

interface ColorModeContextValue {
    mode: PaletteMode;
    toggleMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextValue | undefined>(
    undefined
);

const STORAGE_KEY = "tts-portal-theme-mode";

function getInitialMode(): PaletteMode {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === "dark" || stored === "light") return stored;
    } catch {
        // Storage can be blocked (private mode, strict browser settings)
    }
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<PaletteMode>(getInitialMode);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, mode);
        } catch {
            // ignore – the choice just won't persist
        }
    }, [mode]);

    const toggleMode = useCallback(
        () => setMode((prev) => (prev === "light" ? "dark" : "light")),
        []
    );

    const theme = useMemo(() => getTtsTheme(mode), [mode]);
    const value = useMemo(() => ({ mode, toggleMode }), [mode, toggleMode]);

    return (
        <ColorModeContext.Provider value={value}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useColorMode() {
    const ctx = useContext(ColorModeContext);
    if (!ctx) {
        throw new Error("useColorMode must be used within a ColorModeProvider");
    }
    return ctx;
}