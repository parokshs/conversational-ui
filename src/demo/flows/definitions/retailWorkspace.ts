import {
  getRetailCharts,
  getRetailWorkspacePromptData,
} from "../../data/retailWorkspace";
import { buildTableGraphTabsLayout } from "../../format/buildDataViewLayout";
import { buildPromptFromData } from "../../format/buildPromptFromData";
import type { PresentationSection } from "../../presentation/types";
import type { DemoFlowDefinition } from "../types";

export const retailWorkspaceFlow: DemoFlowDefinition = {
  id: "retail-workspace",
  keywords: [
    "retail",
    "investigate",
    "business unit detail",
    "workspace allocation",
    "floor",
    "seat type",
    "office",
    "touchdown",
    "project team room",
  ],
  responseFile: "retailWorkspace.c1.txt",
  thinking: {
    title: "Reviewing Retail allocation",
    description:
      "Analysing Retail workspace allocation by floor and seat type.",
  },
  buildChatPrompt() {
    const data = getRetailWorkspacePromptData();

    return buildPromptFromData({
      task: "Create a professional Retail workspace allocation analysis response.",
      data,
      layout: [
        "Start with DATA.intro exactly.",
        ...buildTableGraphTabsLayout({
          tableSource: "DATA.allocations",
          tableColumns:
            "Floor, Actual Employees, Allocated Spaces, Office, Project/Team Room, Touchdown, Variance %",
        }),
        "Add an Insights section with bullets from DATA.keyInsights exactly — keep concise, no extra paragraphs.",
        "End with a single line: Recommendation: followed by DATA.recommendation exactly.",
      ],
    });
  },
  buildPresentationSection(): PresentationSection {
    const data = getRetailWorkspacePromptData();

    return {
      id: "retail-workspace",
      title: "Retail Workspace Allocation",
      intro: data.intro,
      tables: [
        {
          heading: "Allocation by Floor and Seat Type",
          columns: [
            "Floor",
            "Actual Employees",
            "Allocated Spaces",
            "Office",
            "Project/Team Room",
            "Touchdown",
            "Variance %",
          ],
          rows: data.allocations.map((row) => [
            row.floor,
            String(row.actualEmployees),
            String(row.allocatedSpaces),
            String(row.office),
            String(row.projectTeamRoom),
            String(row.touchdown),
            `${row.variancePct}%`,
          ]),
        },
      ],
      charts: getRetailCharts(),
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
