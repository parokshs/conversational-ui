import { anomalyUserPrompt, getAnomalyPromptData } from "../data/anomalyFindings";
import { buildPromptFromData } from "../format/buildPromptFromData";

export const anomalyResponseFile = "anomalyFindings.c1.txt";

export function buildAnomalyChatPrompt() {
  return buildPromptFromData({
    task: "Create a visually engaging proactive insights / anomaly report response.",
    data: getAnomalyPromptData(),
    layout: [
      "Start with DATA.intro exactly.",
      "Add a MiniCardBlock with one MiniCard per item in DATA.summary.cards. Each card should use ProfileTile on the lhs (title, label, Icon) and Stats on the rhs (stat as number, statLabel as label).",
      "For each item in DATA.findings, add a SectionBlock section titled with finding.title containing:",
      "- A Callout with variant matching finding.severity, title finding.calloutTitle, description finding.calloutDescription (preserve **bold** markdown in description).",
      "- finding.analysis as TextContent.",
      "- A Tabs component with Table view (finding.table) and Graph view (finding.chart as groupedBar BarChartV2).",
      "Keep the layout executive-ready and visually scannable — avoid plain stacked paragraphs with no visual hierarchy.",
    ],
  });
}

export { anomalyUserPrompt };
