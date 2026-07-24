import { Theme } from "../types/theme";

export const lightTheme: Theme = {
  background: "#FCFCFC",         // White/Orange Portfolio Light
  accent: "#F97316",             // Orange accent
  surface: "#FFFFFF",
  surface2: "#F4F4F5",
  text: "#18181B",
  textSecondary: "#52525B",
  textMuted: "#71717A",
  textPlaceholder: "#A1A1AA",
  border: "#E4E4E7",
  borderHover: "#F97316",
  codeBackground: "#F4F4F5",
  selection: "rgba(249, 115, 22, 0.18)", // Soft transparent orange
  selectionText: "inherit",
  hoverOverlay: "rgba(249, 115, 22, 0.05)",
  categoryBg: "#F4F4F5",
  categoryHoverBg: "rgba(249, 115, 22, 0.1)",
  categoryActiveBg: "#F97316",
  categoryActiveText: "#FFFFFF",
  categoryText: "#52525B",
};

export const darkTheme: Theme = {
  background: "#09090B",         // Black/Green Portfolio Dark
  accent: "#22C55E",             // Green accent
  surface: "#121316",
  surface2: "#181A1F",
  text: "#E4E4E7",
  textSecondary: "#A1A1AA",
  textMuted: "#71717A",
  textPlaceholder: "#4B5563",
  border: "#27272A",
  borderHover: "#22C55E",
  codeBackground: "#121316",
  selection: "rgba(34, 197, 94, 0.2)", // Soft transparent green
  selectionText: "inherit",
  hoverOverlay: "rgba(34, 197, 94, 0.06)",
  categoryBg: "#181A1F",
  categoryHoverBg: "rgba(34, 197, 94, 0.12)",
  categoryActiveBg: "#22C55E",
  categoryActiveText: "#09090B",
  categoryText: "#A1A1AA",
};

export const catppuccinTheme: Theme = {
  background: "#24273A",         // Catppuccin Macchiato Slate/Peach
  accent: "#F5A97F",             // Peach accent
  surface: "#1E2030",
  surface2: "#2D3148",
  text: "#CAD3F5",
  textSecondary: "#A5ADCB",
  textMuted: "#8087A2",
  textPlaceholder: "#5B6078",
  border: "#363A4F",
  borderHover: "#F5A97F",
  codeBackground: "#1E2030",
  selection: "rgba(138, 173, 244, 0.22)", // Soft transparent Catppuccin blue
  selectionText: "inherit",
  hoverOverlay: "rgba(245, 169, 127, 0.06)",
  categoryBg: "#2D3148",
  categoryHoverBg: "rgba(245, 169, 127, 0.12)",
  categoryActiveBg: "#F5A97F",
  categoryActiveText: "#24273A",
  categoryText: "#A5ADCB",
};
