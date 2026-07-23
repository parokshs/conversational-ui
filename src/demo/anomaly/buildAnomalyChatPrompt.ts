import { anomalyUserPrompt, getAnomalyPromptData } from "../data/anomalyFindings";
import { buildPromptFromData } from "../format/buildPromptFromData";

export const anomalyResponseFile = "anomalyFindings.c1.txt";

export function buildAnomalyChatPrompt() {
  return buildPromptFromData({
    task: "Create a professional data anomaly report response.",
    data: getAnomalyPromptData(),
    layout: [
      `Start with DATA.intro exactly.`,
      "Add DATA.findings[0].analysis as a paragraph, then render DATA.findings[0].table as a table.",
      "Add DATA.findings[1].analysis as a paragraph, then render DATA.findings[1].table as a table.",
    ],
  });
}

export { anomalyUserPrompt };
