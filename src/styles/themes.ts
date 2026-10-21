import { Theme } from "../types/theme";

export const lightTheme: Theme = {
  background: "#FCFCFC",
  accent: "#F97316",             // Vibrant Orange accent
  surface: "#FFFFFF",
  surface2: "#F4F4F5",
  text: "#18181B",
  textSecondary: "#52525B",
  textMuted: "#71717A",
  textPlaceholder: "#A1A1AA",
  border: "#E4E4E7",
  borderHover: "#F97316",
  codeBackground: "#F4F4F5",
  selection: "rgba(249, 115, 22, 0.14)", // Soft transparent orange
  selectionText: "inherit",
  hoverOverlay: "rgba(249, 115, 22, 0.025)",
  categoryBg: "#F4F4F5",
  categoryHoverBg: "rgba(249, 115, 22, 0.08)",
  categoryActiveBg: "#F97316",
  categoryActiveText: "#FFFFFF",
  categoryText: "#52525B",
};

export const darkTheme: Theme = {
  background: "#09090B",
  accent: "#16a34a",             // Slightly darkened green accent
  surface: "#0d0f0d",
  surface2: "#111411",
  text: "#E4E4E7",
  textSecondary: "#A1A1AA",
  textMuted: "#71717A",
  textPlaceholder: "#4B5563",
  border: "#1f2a1f",
  borderHover: "#16a34a",
  codeBackground: "#0d0f0d",
  selection: "rgba(22, 163, 74, 0.18)",
  selectionText: "inherit",
  hoverOverlay: "rgba(22, 163, 74, 0.025)",
  categoryBg: "#111411",
  categoryHoverBg: "rgba(22, 163, 74, 0.08)",
  categoryActiveBg: "#16a34a",
  categoryActiveText: "#09090B",
  categoryText: "#A1A1AA",
};

// Aliased to darkTheme to ensure no lavender theme is active
export const catppuccinTheme: Theme = darkTheme;

