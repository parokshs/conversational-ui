import type { CwpSkillReference } from "./cwpSkillLoader";
import {
  buildCwpSkillAssetPathsPrompt,
  readCwpBrowserPreviewGuide,
  readCwpLayoutGuide,
  readCwpReferenceSlideSkill,
  readCwpSkillDoc,
} from "./cwpSkillLoader";
import {
  CWP_ANALYTICS_DECK_FALLBACK,
  CWP_TEMPLATE_REFERENCE_FALLBACK,
} from "./cwpSkillPrompt.fallback";

export function buildCwpAnalyticsDeckPrompt() {
  const skillDoc = readCwpSkillDoc();
  if (skillDoc) {
    return skillDoc;
  }

  return CWP_ANALYTICS_DECK_FALLBACK;
}

export function buildCwpAnalyticsLayoutPrompt() {
  const layoutGuide = readCwpLayoutGuide();
  if (layoutGuide) {
    return layoutGuide;
  }

  return CWP_TEMPLATE_REFERENCE_FALLBACK;
}

export function buildCwpBrowserPreviewPrompt() {
  const guide = readCwpBrowserPreviewGuide();
  if (guide) {
    return guide;
  }

  return [
    "BROWSER PREVIEW: insight slides use title-body-left, horizontal bars (#CC4678),",
    "16pt bullets + Recommendation left, chart right. Metrics-overview: title-body-bottom, no blue header.",
  ].join("\n");
}

export function buildCwpReferenceSlidePrompt() {
  const referenceSkill = readCwpReferenceSlideSkill();
  if (!referenceSkill) {
    return "";
  }

  return [
    "PPTX REFERENCE-MATCHING (for export, not browser preview):",
    "Follow reference-slide-presentations skill — match reference screenshots exactly.",
    referenceSkill.slice(0, 1200),
  ].join("\n\n");
}

export function buildCwpTemplateReferencePrompt(skillReference?: CwpSkillReference) {
  return buildCwpSkillAssetPathsPrompt(skillReference);
}
