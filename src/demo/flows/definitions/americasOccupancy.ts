import { getAmericasCharts, getAmericasPromptData } from "../../data/americasBuildings";
import { buildTableGraphTabsLayout } from "../../format/buildDataViewLayout";
import { buildPromptFromData } from "../../format/buildPromptFromData";
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
    const data = getAmericasPromptData();

    return buildPromptFromData({
      task: "Create a professional portfolio analytics response.",
      data,
      layout: [
        "Start with DATA.intro exactly.",
        ...buildTableGraphTabsLayout({
          tableSource: "DATA.buildings",
          tableColumns: "Building, Employees, Seats, Vacant %",
        }),
      ],
    });
  },
  buildPresentationSection(): PresentationSection {
    const data = getAmericasPromptData();
    const topBuilding = data.buildings[0];

    return {
      id: "americas-occupancy",
      title: "Americas Portfolio Occupancy",
      intro: data.intro,
      tables: [
        {
          heading: "Building-Level Metrics",
          columns: ["Building", "Employees", "Seats", "Vacant %"],
          rows: data.buildings.map((row) => [
            row.building,
            String(row.employees),
            String(row.seats),
            `${row.vacantPct}%`,
          ]),
        },
      ],
      charts: getAmericasCharts(),
      bullets: [
        {
          label: "Key Insight",
          items: [
            `${topBuilding.building} leads the portfolio with ${topBuilding.vacantPct}% vacant — the highest among Americas buildings.`,
          ],
        },
      ],
    };
  },
};
