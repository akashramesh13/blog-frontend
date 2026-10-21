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
  accent: "#F97316",             // Orange accent in dark theme
  surface: "#121316",
  surface2: "#181A1F",
  text: "#E4E4E7",
  textSecondary: "#A1A1AA",
  textMuted: "#71717A",
  textPlaceholder: "#4B5563",
  border: "#27272A",
  borderHover: "#F97316",
  codeBackground: "#121316",
  selection: "rgba(249, 115, 22, 0.16)",
  selectionText: "inherit",
  hoverOverlay: "rgba(249, 115, 22, 0.025)",
  categoryBg: "#181A1F",
  categoryHoverBg: "rgba(249, 115, 22, 0.08)",
  categoryActiveBg: "#F97316",
  categoryActiveText: "#09090B",
  categoryText: "#A1A1AA",
};

// Aliased to darkTheme to ensure no lavender theme is active
export const catppuccinTheme: Theme = darkTheme;

