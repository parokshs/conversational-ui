import { getFlowById } from "../flows/registry";
import { FULL_DEMO_FLOW_IDS, loadCwpSkillReference } from "./presentationCache";
import { enrichPresentationBundle } from "./formatPresentationSlides";
import type { DemoPresentationBundle } from "./types";

/** Flow IDs always included in the executive deck (all demo analytics steps). */
export function getPresentationFlowIds(): string[] {
  return [...FULL_DEMO_FLOW_IDS];
}

export function buildDemoPresentationBundle(
  flowIds: string[]
): DemoPresentationBundle | null {
  const sections = flowIds
    .map((flowId) => getFlowById(flowId)?.buildPresentationSection())
    .filter((section): section is NonNullable<typeof section> => Boolean(section));

  if (sections.length === 0) {
    return null;
  }

  return enrichPresentationBundle({
    title: "Portfolio & Building Analytics",
    sections,
    templateReference: loadCwpSkillReference(),
  });
}

export function buildFullDemoPresentationBundle(): DemoPresentationBundle | null {
  return buildDemoPresentationBundle(getPresentationFlowIds());
}
