import {
  americasBuildings,
  americasIntro,
} from "../../data/americasBuildings";
import type { PresentationSection } from "../../presentation/types";
import type { DemoFlowDefinition } from "../types";

export const americasOccupancyFlow: DemoFlowDefinition = {
  id: "americas-occupancy",
  keywords: [
    "occupancy",
    "americas",
    "building level",
    "building metrics",
    "portfolio",
    "vacant",
    "seats",
    "employees",
  ],
  responseFile: "americasOccupancy.c1.txt",
  thinking: {
    title: "Analysing portfolio data",
    description: "Reviewing building-level occupancy across the Americas region.",
  },
  buildChatPrompt() {
    const rows = americasBuildings
      .map(
        (row) =>
          `${row.building}: ${row.employees} employees, ${row.seats} seats, ${row.vacantPct}% vacant`
      )
      .join("\n");

    return `Create a professional portfolio analytics response.

Start with this exact sentence:
"${americasIntro}"

Then render a sortable data table with exactly these columns: Building, Employees, Seats, Vacant %

Use exactly this data (10 rows, no extra rows):
${rows}

Do not mention that this is a demo or staged. Keep the layout clean and executive-ready.`;
  },
  buildPresentationSection(): PresentationSection {
    return {
      id: "americas-occupancy",
      title: "Americas Portfolio Occupancy",
      intro: americasIntro,
      tables: [
        {
          heading: "Building-Level Metrics",
          columns: ["Building", "Employees", "Seats", "Vacant %"],
          rows: americasBuildings.map((row) => [
            row.building,
            String(row.employees),
            String(row.seats),
            `${row.vacantPct}%`,
          ]),
        },
      ],
    };
  },
};
