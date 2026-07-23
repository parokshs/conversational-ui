import type { DemoPresentationBundle } from "./types";

export function buildArtifactSystemPrompt() {
  return `
You are generating a polished, executive-ready slide presentation from precomputed analytics.

You do NOT compute anything. Use only the structured DATA in the user message.

SLIDE STRUCTURE:
- Follow DATA.sections in order. Each section becomes one or more content-rich slides.
- Do NOT create divider slides with only a heading and no content.
- Open with DATA.title and a concise executive summary slide that combines the first section intro with its table preview or first bullet group — never as a lone statistic.
- For each section, prefer this pattern:
  1) Title + intro + table (when tables exist)
  2) Chart slide using the section charts array (when charts exist)
  3) Bullet / recommendation slides grouped logically (max 4 bullets per slide)
- Render every table in each section as a readable table component with the section heading above it.
- Render every chart in each section using the specified chartType, categories, and series values exactly as provided.
- Prefer chart variety across sections: pie for share/distribution, line for multi-series trends, area for cumulative comparisons, bar only when ranking long category lists.
- Render callouts with tone-appropriate styling: red for Red Flags, green for Green Flag.
- Render bullet sections as callout cards, not plain paragraph text.
- Render section images when present, using a large readable image component with the provided caption.
- End with recommendations when present in the final section.

LAYOUT RULES (critical for export quality):
- NEVER create a slide with only one large statistic and a single sentence — this exports poorly.
- NEVER split a metric value and its unit across separate text blocks (keep "30%" together in one text run).
- Do NOT render PresentationHighlight objects as giant standalone stat cards; fold highlight text into bullets or intro sentences instead.
- Do NOT use sparse MiniCard-only layouts for executive slides.
- Each slide must include at least TWO meaningful content blocks (for example: title + table, chart + bullets, table + chart).
- When both tables and charts exist for a section, include BOTH — do not omit charts.
- Keep category labels horizontal and readable; prefer horizontalBar charts when category names are long.
- Maximum 1 short intro sentence per slide; move detail into tables, charts, or bullets.
- Keep layouts dense, story-driven, and presentation-ready — match the richness of a dashboard, not a blank poster.
- Do not mention that this is a demo or staged content.
`.trim();
}

export function buildArtifactUserPrompt({
  question,
  bundle,
}: {
  question: string;
  bundle: DemoPresentationBundle;
}) {
  return [
    question,
    "",
    "Generate a story-driven slide deck from the conversation analytics below.",
    "Follow DATA.sections for slide grouping and preserve the section order.",
    "Render every table, chart, highlight, callout, and bullet group from the data — do not skip sections.",
    "Use groupedBar when a chart has multiple series; use horizontalBar for single-series comparisons.",
    "DATA:",
    JSON.stringify(bundle, null, 2),
  ].join("\n");
}
