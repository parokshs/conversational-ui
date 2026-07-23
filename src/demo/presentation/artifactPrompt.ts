import type { DemoPresentationBundle } from "./types";

export function buildArtifactSystemPrompt() {
  return `
You are generating a polished, executive-ready slide presentation from precomputed analytics.

You do NOT compute anything. Use only the structured DATA in the user message.

SLIDE STRUCTURE:
- Follow DATA.sections in order. Each section becomes one or more slides with cards, tables, and callouts.
- Do NOT create divider slides with only a heading and no content.
- Open with DATA.title and the first section intro as an executive summary slide.
- Render every table in each section as a readable table component with the section heading above it.
- Render callouts with tone-appropriate styling: red for Red Flags, green for Green Flag.
- Render bullet sections as callout cards, not plain paragraph text.
- End with recommendations when present in the final section.

LAYOUT:
- Maximum 1 short sentence of intro prose per slide.
- Keep layouts clean, story-driven, and presentation-ready.
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
    "Render every table, callout, and bullet group from the data — do not skip sections.",
    "DATA:",
    JSON.stringify(bundle, null, 2),
  ].join("\n");
}
