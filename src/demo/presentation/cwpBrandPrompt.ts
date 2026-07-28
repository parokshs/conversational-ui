/**
 * CWP / The Changing Workplace brand rules for slide artifact generation.
 * Source: .agents/skills/cwp_template/brand-style.md
 */
export const CWP_BRAND_PROMPT = `
CWP BRAND (The Changing Workplace) — apply to every slide:

Reference template: presentation/assets/CWP_Template.pptx (The Changing Workplace enterprise deck).
Match its professional, consulting-grade look: primary blue headers, Roboto typography, dense data layouts.

COLORS (use exactly; do not substitute purple/teal/navy gradients):
- Primary blue #1767D2 — title slides, section dividers, table headers, primary chart series
- Body text #2B2B2B on white; secondary #3F3F3F
- Chart accent order for multi-series: #1767D2, #FF9933, #D43900, #FFCC33, #049A0D, #9933CC
- Table headers: bold white text on solid #1767D2; body rows banded light blue tints (not gray zebra)

TYPOGRAPHY (Roboto throughout):
- Deck title ~42pt bold; section dividers ~32pt bold; slide header in blue bar ~20pt white
- Body ~14pt; secondary ~12pt; captions minimum 11pt — split slides instead of shrinking text

LAYOUT PATTERNS (mirror CWP template):
1. Title slide — primary blue background feel, white title lower-third, CWP helper text
2. Section divider — solid primary blue, single bold left-aligned section title
3. Content slide — white body, blue header bar with white slide title, structured content below
4. Table slide — header + compact banded-blue table sized to content
5. Closing — text-only recommendations, no decorative imagery

ENTERPRISE POLISH:
- No slide with only one giant stat and one sentence
- No large empty body areas — balance with chart, table, or bullets
- Charts: axis labels, title, brand accent colors; quiet gridlines
- Consistent left margin; dense but not cramped
- Maximum one short intro sentence per slide; detail in tables, charts, bullets
`.trim();

export const CWP_CHART_PALETTE = [
  "#1767D2",
  "#FF9933",
  "#D43900",
  "#FFCC33",
  "#049A0D",
  "#9933CC",
] as const;

export const CWP_SLIDES_THEME = {
  font: "Roboto, sans-serif",
  primaryText: "#2B2B2B",
  secondaryText: "#3F3F3F",
  slidesBg: "#FFFFFF",
} as const;
