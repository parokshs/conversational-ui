import type { CwpSkillReference } from "./cwpSkillLoader";
import type { DemoPresentationBundle } from "./types";
import { CWP_BRAND_PROMPT } from "./cwpBrandPrompt";
import {
  buildCwpAnalyticsDeckPrompt,
  buildCwpAnalyticsLayoutPrompt,
  buildCwpBrowserPreviewPrompt,
  buildCwpTemplateReferencePrompt,
} from "./cwpSkillPrompt";
import { CWP_SLIDE_TEMPLATES_PROMPT } from "./cwpSlideTemplatesPrompt";

export const PRESENTATION_ARTIFACT_MODEL = "c1/artifact/v-20260130";

function collectAllowedImageUrls(bundle: DemoPresentationBundle): string[] {
  const urls = bundle.sections.flatMap((section) => {
    const slide = section.slideContent?.contentSlide;
    if (slide?.template === "list-with-image") {
      return [slide.imageUrl];
    }

    return [];
  });

  return [...new Set(urls)];
}

function buildSkillReferenceBlock(skillReference?: CwpSkillReference) {
  return buildCwpTemplateReferencePrompt(skillReference);
}

export function buildArtifactSystemPrompt(skillReference?: CwpSkillReference) {
  return `
You are generating a CWP portfolio & building analytics deck for browser viewing.
Follow the cwp_template skill (.agents/skills/cwp_template) exactly.

You do NOT compute anything. Use only DATA:
- DATA.sections[].slideContent.contentSlide
- DATA.actionPlanSlide
- DATA.templateReference (skill asset paths)

${buildCwpAnalyticsDeckPrompt()}

${buildCwpAnalyticsLayoutPrompt()}

${buildCwpBrowserPreviewPrompt()}

${buildSkillReferenceBlock(skillReference)}

${CWP_BRAND_PROMPT}

${CWP_SLIDE_TEMPLATES_PROMPT}

CRITICAL:
- Primary layout reference: portfolio-building-analytics-cwp-v2.pptx (skill assets/)
- PPTX seed template: CWP_Template.pptx (demo assets/) — for download, not browser rendering
- Exactly 6 slides. No SectionBreak slides.
- Title slide: NO helperText — only title and subtitle on blue background.
- metrics-overview: NO blue header; chart hero top, 28pt title + 16pt body below.
- insight slides: blue header (~28pt white title) + 16pt bullets left + chart/image right.
- Body max 120 chars — copy contentSlide.body exactly, preserve line breaks.
- Apply chartColors from contentSlide. When chartHorizontal is true, render horizontal BarChart (isHorizontal true).
- Copy all contentSlide fields verbatim (including chartHorizontal, categoryAxisLabel, valueAxisLabel).
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
  const ref = bundle.templateReference;

  return [
    question,
    "",
    "Build 6 slides matching cwp_template references/analytics-layout-guide.md exactly.",
    "Follow cwp_template skill: metrics-overview (Americas), insight (sections 2–4), action-plan (closing).",
    "Copy contentSlide and actionPlanSlide fields exactly.",
    "",
    ref
      ? [
          "SKILL ASSETS:",
          `- Sample deck: ${ref.sampleDeck.relativePath} (exists: ${ref.sampleDeck.exists})`,
          `- Layout guide: ${ref.layoutGuide.relativePath} (exists: ${ref.layoutGuide.exists})`,
          `- Browser preview: ${"browserPreviewGuide" in ref ? ref.browserPreviewGuide.relativePath : "references/browser-preview-mapping.md"}`,
          `- Base template: ${ref.baseTemplate.relativePath} (exists: ${ref.baseTemplate.exists})`,
        ].join("\n")
      : "",
    "",
    allowedImageUrls.length > 0
      ? `ALLOWED IMAGE URLS: ${allowedImageUrls.join(", ")}`
      : "ALLOWED IMAGE URLS: none.",
    "NEVER use thesys_image:* or decorative images.",
    "",
    "DATA:",
    JSON.stringify(bundle, null, 2),
  ]
    .filter(Boolean)
    .join("\n");
}
