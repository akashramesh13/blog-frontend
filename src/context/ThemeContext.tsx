import React, { createContext, ReactNode, useContext, useLayoutEffect } from "react";
import { Theme, ThemeMode } from "../types/theme";
import { lightTheme } from "../styles/themes";

type ThemeContextType = {
  themeMode: ThemeMode;
  resolvedTheme: "light" | "dark" | "catppuccin";
  setThemeMode: (mode: ThemeMode) => void;
};

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

function updateFavicon(): void {
  const accentColor = "#111111"; 
  const bgColor = "#FFFFFF";
  const textColor = "#111111";

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
  useLayoutEffect(() => {
    applyTheme(lightTheme);
    document.documentElement.setAttribute("data-theme", "light");
    updateFavicon();
  }, []);

  return (
    <ThemeContext.Provider value={{ themeMode: "light", resolvedTheme: "light", setThemeMode: () => {} }}>
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
