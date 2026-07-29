/**
 * Thesys slide rules mapped to cwp_template skill (SKILL.md + references/).
 */
export const CWP_SLIDE_TEMPLATES_PROMPT = `
SLIDE TEMPLATE RULES (Thesys c1/artifact/v-20260130 + cwp_template skill):

USE PRE-BUILT DATA ONLY — copy slideContent and actionPlanSlide fields exactly.
Follow references/analytics-layout-guide.md typography and references/browser-preview-mapping.md.

DECK SIZE: 6 slides — title + 4 section contentSlides + actionPlanSlide.

SLIDE SEQUENCE:
1. Title → variant "minimal", layout "title-bottom"
   title: DATA.title, subtitle: DATA.subtitle only — NO helperText, NO bgImageSrc
   Typography: 44pt bold title, 24pt subtitle (layout guide)
2. Americas → contentSlide slideType "metrics-overview", layout "title-body-bottom"
   NO blue header. Chart hero top ~55%. slideTitle 28pt bold left + body 16pt right below.
3–5. Building F, Retail, Floor plan → contentSlide slideType "insight"
   - Charts: template chart-with-context, layout "title-body-left"
   - Floor plan: template list-with-image
   Blue header bar (~28pt white title) + 16pt bullets left + visual right
   - chartHorizontal true → BarChartV2 isHorizontal true
   - horizontalBar: xAxisLabel=valueAxisLabel, yAxisLabel=categoryAxisLabel
   - Body ≤120 chars — copy verbatim with line breaks (bullets + Rec: line)
6. Action-plan → variant "numbered-key-point" from DATA.actionPlanSlide (18pt items)

CHART COLORS: contentSlide.chartColors (#CC4678 single, #CC4678+#FF9933 dual).

FORBIDDEN: SectionBreak slides, extra slides, thesys_image, decorative images, bgImageSrc.
`.trim();
