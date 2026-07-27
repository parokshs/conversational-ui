import {
  getBuildingFAlignmentPromptData,
  getBuildingFCharts,
} from "../../data/buildingFAlignment";
import { buildTableGraphTabsLayout } from "../../format/buildDataViewLayout";
import { buildPromptFromData } from "../../format/buildPromptFromData";
import type { PresentationSection } from "../../presentation/types";
import type { DemoFlowDefinition } from "../types";

export const buildingFAlignmentFlow: DemoFlowDefinition = {
  id: "building-f-alignment",
  keywords: [
    "building f",
    "actual vs allocated",
    "actual versus allocated",
    "alignment",
    "business unit",
    "allocated alignment",
    "misallocated",
  ],
  responseFile: "buildingFAlignment.c1.txt",
  thinking: {
    title: "Comparing alignment",
    description:
      "Analysing Actual versus Allocated alignment by business unit for Building F.",
  },
  buildChatPrompt() {
    const data = getBuildingFAlignmentPromptData();

    return buildPromptFromData({
      task: "Create a professional building alignment analysis response.",
      data,
      layout: [
        "Start with DATA.intro exactly.",
        ...buildTableGraphTabsLayout({
          tableSource: "DATA.businessUnits",
          tableColumns:
            "Business Unit, Actual = Allocated %, Actual ≠ Allocated %, Status",
        }),
        "Add an Insights section with bullets from DATA.keyInsights exactly — keep concise, no numbered sub-sections.",
        "End with a single line: Recommendation: followed by DATA.recommendation exactly.",
      ],
    });
  },
  buildPresentationSection(): PresentationSection {
    const data = getBuildingFAlignmentPromptData();

    return {
      id: "building-f-alignment",
      title: "Building F — Actual vs Allocated Alignment",
      intro: data.intro,
      tables: [
        {
          heading: "Alignment by Business Unit",
          columns: [
            "Business Unit",
            "Actual = Allocated %",
            "Actual ≠ Allocated %",
            "Status",
          ],
          rows: data.businessUnits.map((row) => [
            row.businessUnit,
            `${row.actualEqualsAllocatedPct}%`,
            `${row.actualNotEqualsAllocatedPct}%`,
            row.status,
          ]),
        },
      ],
      charts: getBuildingFCharts(),
      bullets: [
        {
          label: "Insights",
          items: data.keyInsights,
        },
        {
          label: "Recommendation",
          items: [data.recommendation],
        },
      ],
    };
  },
};
