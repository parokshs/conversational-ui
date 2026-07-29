/**
 * CWP brand rules for Thesys slide artifact generation.
 * Layout details loaded at runtime from .agents/skills/cwp_template/references/
 */
export const CWP_BRAND_PROMPT = `
CWP BRAND (The Changing Workplace):

COLORS:
- Primary blue #1767D2 — title slide background, insight-slide header bars
- Body text #2B2B2B on white; secondary #3F3F3F
- Analytics single-series chart bars: #CC4678 (rose/magenta)
- Two-series charts: #CC4678 primary, #FF9933 secondary

TYPOGRAPHY: Roboto throughout (see skill layout guide for per-slide-type sizes).

ENTERPRISE POLISH:
- No sparse slides or large empty body areas
- One visual + one recommendation per insight slide
- Quiet chart gridlines; caption axes on analytics charts
`.trim();

export const CWP_CHART_PALETTE = {
  singleSeries: "#CC4678",
  twoSeries: ["#CC4678", "#FF9933"] as const,
} as const;

/**
 * Chat UI chart colors (BarChartV2, MiniChart, etc.).
 * Crayon picks palette[floor(n/2)] for one series and palette[mid±1] for two —
 * order must stay [maroon, maroon, orange] so singles and pairs match PPT slides.
 */
export const CWP_UI_CHART_PALETTE = [
  CWP_CHART_PALETTE.twoSeries[0],
  CWP_CHART_PALETTE.singleSeries,
  CWP_CHART_PALETTE.twoSeries[1],
] as const;

export const CWP_SLIDES_THEME = {
  font: "Roboto, sans-serif",
  primaryText: "#2B2B2B",
  secondaryText: "#3F3F3F",
  slidesBg: "#FFFFFF",
  headerBlue: "#1767D2",
} as const;
