import type { DemoPresentationBundle } from "./types";
import { CWP_BRAND_PROMPT } from "./cwpBrandPrompt";
import { CWP_SLIDE_TEMPLATES_PROMPT } from "./cwpSlideTemplatesPrompt";

export const PRESENTATION_ARTIFACT_MODEL = "c1/artifact/v-20260130";

function collectAllowedImageUrls(bundle: DemoPresentationBundle): string[] {
  const urls = bundle.sections.flatMap(
    (section) =>
      section.slideContent?.imageSlide?.imageUrl
        ? [section.slideContent.imageSlide.imageUrl]
        : []
  );

  return [...new Set(urls)];
}

export function buildArtifactSystemPrompt() {
  return `
You are generating a CWP-branded executive slide deck from precomputed analytics.

You do NOT compute anything. Use only DATA in the user message, especially DATA.sections[].slideContent and DATA.closingSlides.

${CWP_BRAND_PROMPT}

${CWP_SLIDE_TEMPLATES_PROMPT}

CRITICAL:
- slideContent fields are pre-sized for Thesys schema limits — copy them verbatim.
- Never output markdown tables or Text Body slides for data tables.
- Charts and info grids must occupy most of each slide — no poster-style empty layouts.
- Do not mention demo or staged content.
`.trim();
}

export function buildArtifactUserPrompt({
  question,
  bundle,
}: {
  question: string;
  bundle: DemoPresentationBundle;
}) {
  const allowedImageUrls = collectAllowedImageUrls(bundle);

  return [
    question,
    "",
    "Build the deck by iterating DATA.sections[].slideContent in order, then DATA.closingSlides.",
    "Use insightSlides (key-info-with-title horizontal-grid) for insights — never Content Classic numbered lists.",
    "Copy slideContent titles, infoItems, items, chart series, and image URLs exactly.",
    "",
    allowedImageUrls.length > 0
      ? `ALLOWED IMAGE URLS (only these): ${allowedImageUrls.join(", ")}`
      : "ALLOWED IMAGE URLS: none — no images except floor plan when slideContent.imageSlide exists.",
    "NEVER use thesys_image:* or decorative images.",
    "",
    "DATA:",
    JSON.stringify(bundle, null, 2),
  ].join("\n");
}
