import {
  engineeringAllocations,
  engineeringIntro,
  engineeringObservations,
  engineeringOpportunities,
} from "../../data/engineeringWorkspace";
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
    const rows = engineeringAllocations
      .map(
        (row) =>
          `Floor ${row.floor}, ${row.roomUse}: ${row.employees} employees, ${row.workstations} workstations, ${row.vacantWorkstations} vacant workstations`
      )
      .join("\n");

    return `Create a professional workspace allocation analysis response.

Render a data table with exactly these columns: Floor, Room Use, Employees, Workstations, Vacant Workstations

Use exactly this data:
${rows}

After the table, add a "Key observations" section with these bullets:
${engineeringObservations.map((item) => `- ${item}`).join("\n")}

Then add a short paragraph that Floor 07 is largely unused and may represent an opportunity to:
${engineeringOpportunities.map((item) => `- ${item}`).join("\n")}

Do not mention that this is a demo or staged. Keep the layout clean and executive-ready.`;
  },
  buildPresentationSection(): PresentationSection {
    return {
      id: "engineering-workspace",
      title: "Engineering Workspace Allocation",
      intro: engineeringIntro,
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
          rows: engineeringAllocations.map((row) => [
            row.floor,
            row.roomUse,
            String(row.employees),
            String(row.workstations),
            String(row.vacantWorkstations),
          ]),
        },
      ],
      bullets: [
        {
          label: "Key Observations",
          items: engineeringObservations,
        },
        {
          label: "Opportunities",
          items: [
            "Floor 07 is largely unused and may represent an opportunity to:",
            ...engineeringOpportunities,
          ],
        },
      ],
    };
  },
};
