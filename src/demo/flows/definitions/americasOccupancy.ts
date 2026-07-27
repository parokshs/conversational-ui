import { getAmericasCharts, getAmericasPromptData, buildAmericasObservation } from "../../data/americasBuildings";
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
    "program headcount",
    "assigned seats",
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
          tableColumns: "Building, Program Headcount, Assigned Seats, Vacant %",
        }),
        "After the Tabs block, add DATA.observation as a TextContent paragraph exactly, using textMarkdown so **bold** markers render as emphasis on the building name, vacancy rate, and utilization threshold.",
      ],
    });
  },
  buildPresentationSection(): PresentationSection {
    const data = getAmericasPromptData();

    return {
      id: "americas-occupancy",
      title: "Americas Portfolio Occupancy",
      intro: data.intro,
      tables: [
        {
          heading: "Building-Level Metrics",
          columns: ["Building", "Program Headcount", "Assigned Seats", "Vacant %"],
          rows: data.buildings.map((row) => [
            row.building,
            String(row.programHeadcount),
            String(row.assignedSeats),
            `${row.vacantPct}%`,
          ]),
        },
      ],
      charts: getAmericasCharts(),
      bullets: [
        {
          label: "Observation",
          items: [buildAmericasObservation(undefined, { highlight: false })],
        },
      ],
    };
  },
};
