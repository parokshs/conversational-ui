import {
  CWP_CHART_PALETTE,
  CWP_SLIDES_THEME,
} from "@/demo/presentation/cwpBrandPrompt";

/** CWP primary blue — The Changing Workplace brand */
const CWP_PRIMARY = "#1767D2";

export const APP_BRAND = {
  name: "Conversational UI",
  /** Sidebar header + assistant avatar icon. Replace `public/logo.ico` with your own asset. */
  logoUrl: "/logo.png",
  accent: CWP_PRIMARY,
  accentHover: "#1256B0",
  accentPressed: "#0E4590",
  accentDisabled: "rgba(23, 103, 210, 0.4)",
  accentText: "#FFFFFF",
} as const;

export const brandTheme = {
  chatUserResponseBg: APP_BRAND.accent,
  chatUserResponseText: APP_BRAND.accentText,
  interactiveAccent: APP_BRAND.accent,
  interactiveAccentHover: APP_BRAND.accentHover,
  interactiveAccentPressed: APP_BRAND.accentPressed,
  interactiveAccentDisabled: APP_BRAND.accentDisabled,
  accentPrimaryText: APP_BRAND.accentText,
  defaultChartPalette: [...CWP_CHART_PALETTE],
  barChartPalette: [...CWP_CHART_PALETTE],
  lineChartPalette: [...CWP_CHART_PALETTE],
  areaChartPalette: [...CWP_CHART_PALETTE],
  pieChartPalette: [...CWP_CHART_PALETTE],
};

export const cwpSlidesTheme = {
  ...CWP_SLIDES_THEME,
  font: "var(--font-roboto), Roboto, sans-serif",
} as const;
