import {
  getEngineeringCharts,
  getEngineeringPromptData,
} from "../../data/engineeringWorkspace";
import { buildTableGraphTabsLayout } from "../../format/buildDataViewLayout";
import { buildPromptFromData } from "../../format/buildPromptFromData";
import type { PresentationSection } from "../../presentation/types";
import type { DemoFlowDefinition } from "../types";

export const engineeringWorkspaceFlow: DemoFlowDefinition = {
  id: "engineering-workspace",
  keywords: [
    "engineering",
    "workspace allocation",
    "floor",
    "seat type",
    "room use",
    "workstation",
    "cellular",
  ],
  responseFile: "engineeringWorkspace.c1.txt",
  thinking: {
    title: "Reviewing workspace allocation",
    description:
      "Analysing Engineering workspace allocation by floor and seat type.",
  },
  buildChatPrompt() {
    const data = getEngineeringPromptData();

    return buildPromptFromData({
      task: "Create a professional workspace allocation analysis response.",
      data,
      layout: [
        ...buildTableGraphTabsLayout({
          tableSource: "DATA.allocations",
          tableColumns:
            "Floor, Room Use, Employees, Workstations, Vacant Workstations",
        }),
        "Add a Key observations section from DATA.observations.",
        "Add a short paragraph that Floor 07 is largely unused and may represent an opportunity to, followed by bullets from DATA.opportunities.",
      ],
    });
  },
  buildPresentationSection(): PresentationSection {
    const data = getEngineeringPromptData();

    return {
      id: "engineering-workspace",
      title: "Engineering Workspace Allocation",
      intro: data.intro,
      tables: [
        {
          heading: "Allocation by Floor and Seat Type",
          columns: [
            "Floor",
            "Room Use",
            "Employees",
            "Workstations",
            "Vacant Workstations",
          ],
          rows: data.allocations.map((row) => [
            row.floor,
            row.roomUse,
            String(row.employees),
            String(row.workstations),
            String(row.vacantWorkstations),
          ]),
        },
      ],
      charts: getEngineeringCharts(),
      bullets: [
        {
          label: "Key Observations",
          items: data.observations,
        },
        {
          label: "Opportunities",
          items: [
            "Floor 07 is largely unused and may represent an opportunity to:",
            ...data.opportunities,
          ],
        },
      ],
    };
  },
};
