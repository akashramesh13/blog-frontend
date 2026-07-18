import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { Theme, ThemeMode } from "../types/theme";
import { lightTheme, darkTheme, terminalTheme } from "../styles/themes";

type ThemeContextType = {
  themeMode: ThemeMode;
  resolvedTheme: "light" | "dark" | "terminal";
  setThemeMode: (mode: ThemeMode) => void;
};

const STORAGE_KEY = "blog-theme-mode";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(`--color-${camelToKebab(key)}`, value);
  });
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system" || stored === "terminal") {
      return stored;
    }
    return "system";
  });

  const [systemIsDark, setSystemIsDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  // Listen for OS theme changes
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const resolvedTheme: "light" | "dark" | "terminal" =
    themeMode === "system" ? (systemIsDark ? "dark" : "light") : themeMode;

  // Apply CSS custom properties before paint
  useLayoutEffect(() => {
    const themeMap = { light: lightTheme, dark: darkTheme, terminal: terminalTheme };
    const theme = themeMap[resolvedTheme];
    applyTheme(theme);
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [resolvedTheme]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  };

  return (
    <ThemeContext.Provider value={{ themeMode, resolvedTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}
