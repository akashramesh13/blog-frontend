import { Theme } from "../types/theme";

export const lightTheme: Theme = {
  background: "#FDFBF7",
  accent: "#111111",             // Black accent
  surface: "#FDFBF7",
  surface2: "#F4F2EC",
  text: "#111111",
  textSecondary: "#555555",
  textMuted: "#888888",
  textPlaceholder: "#CCCCCC",
  border: "#EAEAEA",
  borderHover: "#111111",
  codeBackground: "#F4F2EC",
  selection: "rgba(0, 0, 0, 0.1)",
  selectionText: "inherit",
  hoverOverlay: "rgba(0, 0, 0, 0.03)",
  categoryBg: "#F9F9F9",
  categoryHoverBg: "rgba(0, 0, 0, 0.05)",
  categoryActiveBg: "#111111",
  categoryActiveText: "#FFFFFF",
  categoryText: "#555555",
};

export const darkTheme: Theme = lightTheme;
export const catppuccinTheme: Theme = lightTheme;
