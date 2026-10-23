import { Theme } from "../types/theme";

export const lightTheme: Theme = {
  background: "#FCFCFC",
  bgGradient: "linear-gradient(135deg, #f4f4f5, #ffffff)",
  bgCard: "linear-gradient(135deg, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.45))",
  accent: "#F97316",             // Vibrant Orange accent
  accentSecondary: "#3B82F6",    // Blue secondary
  surface: "rgba(255, 255, 255, 0.92)",
  surface2: "#F4F4F5",
  text: "#18181B",
  textSecondary: "#3F3F46",
  textMuted: "#71717A",
  textPlaceholder: "#A1A1AA",
  border: "rgba(0, 0, 0, 0.09)",
  borderHover: "#F97316",
  gridColor: "rgba(0, 0, 0, 0.04)",
  glassBorder: "rgba(0, 0, 0, 0.08)",
  glassHighlight: "rgba(255, 255, 255, 0.9)",
  headerBg: "rgba(252, 252, 252, 0.85)",
  tagBg: "rgba(249, 115, 22, 0.08)",
  tagBorder: "rgba(249, 115, 22, 0.22)",
  codeBackground: "#F4F4F5",
  selection: "rgba(249, 115, 22, 0.18)",
  selectionText: "inherit",
  hoverOverlay: "rgba(249, 115, 22, 0.04)",
  categoryBg: "rgba(0, 0, 0, 0.04)",
  categoryHoverBg: "rgba(249, 115, 22, 0.1)",
  categoryActiveBg: "#F97316",
  categoryActiveText: "#FFFFFF",
  categoryText: "#3F3F46",
};

export const darkTheme: Theme = {
  background: "#09090B",
  bgGradient: "linear-gradient(135deg, #000000, #09090B)",
  bgCard: "linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02))",
  accent: "#16a34a",             // Terminal green accent
  accentSecondary: "#16a34a",
  surface: "rgba(20, 22, 21, 0.92)",
  surface2: "#141714",
  text: "#EDE8E5",              // Warm, glare-free book off-white (easy on eyes)
  textSecondary: "#D4D4D8",     // Clean, legible zinc-slate
  textMuted: "#A1A1AA",         // Readable metadata & dates
  textPlaceholder: "#71717A",
  border: "rgba(255, 255, 255, 0.12)",
  borderHover: "#16a34a",
  gridColor: "rgba(22, 163, 74, 0.06)",
  glassBorder: "rgba(255, 255, 255, 0.08)",
  glassHighlight: "rgba(255, 255, 255, 0.12)",
  headerBg: "rgba(9, 9, 11, 0.85)",
  tagBg: "rgba(22, 163, 74, 0.12)",
  tagBorder: "rgba(22, 163, 74, 0.35)",
  codeBackground: "#0d0f0d",
  selection: "rgba(22, 163, 74, 0.25)",
  selectionText: "inherit",
  hoverOverlay: "rgba(22, 163, 74, 0.04)",
  categoryBg: "rgba(255, 255, 255, 0.06)",
  categoryHoverBg: "rgba(22, 163, 74, 0.14)",
  categoryActiveBg: "#16a34a",
  categoryActiveText: "#09090B",
  categoryText: "#D4D4D8",
};
