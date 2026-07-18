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

function updateFavicon(themeName: "light" | "dark" | "terminal"): void {
  let accentColor = "#f5a97f"; // Catppuccin peach (dark default)
  let bgColor = "#1E1E1E";
  let textColor = "#ffffff";

  if (themeName === "light") {
    accentColor = "#f97316";
    bgColor = "#fcfcfc";
    textColor = "#18181b";
  } else if (themeName === "terminal") {
    accentColor = "#22c55e";
    bgColor = "#0A0A0A";
    textColor = "#ffffff";
  }

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" rx="24" fill="${bgColor}" />
  <text x="50" y="68" font-family="monospace, system-ui, -apple-system, sans-serif" font-size="46" font-weight="900" fill="${textColor}" text-anchor="middle" letter-spacing="-2">
    <tspan fill="${accentColor}">&lt;</tspan>P<tspan fill="${accentColor}">/&gt;</tspan>
  </text>
</svg>`.trim();

  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = url;
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
    updateFavicon(resolvedTheme);
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
