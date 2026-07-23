import { getFlowById } from "../flows/registry";
import type { DemoPresentationBundle } from "./types";

export function buildDemoPresentationBundle(
  flowIds: string[]
): DemoPresentationBundle | null {
  const sections = flowIds
    .map((flowId) => getFlowById(flowId)?.buildPresentationSection())
    .filter((section): section is NonNullable<typeof section> => Boolean(section));

  if (sections.length === 0) {
    return null;
  }

  const title =
    sections.length === 1
      ? sections[0].title
      : "Portfolio & Building Analytics";

  return {
    title,
    sections,
  };
}
