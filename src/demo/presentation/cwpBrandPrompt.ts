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
  brandAccents: ["#1767D2", "#FF9933", "#D43900", "#FFCC33", "#049A0D", "#9933CC"] as const,
};

/** Flat palette for chat UI charts (brand accents). */
export const CWP_UI_CHART_PALETTE = [...CWP_CHART_PALETTE.brandAccents] as const;

export const CWP_SLIDES_THEME = {
  font: "Roboto, sans-serif",
  primaryText: "#2B2B2B",
  secondaryText: "#3F3F3F",
  slidesBg: "#FFFFFF",
  headerBlue: "#1767D2",
} as const;
