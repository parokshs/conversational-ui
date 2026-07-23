import {
  formatCurrency,
  getJeffersonCharts,
  getJeffersonPromptData,
} from "../../data/jeffersonHouseCosts";
import { buildTableGraphTabsLayout } from "../../format/buildDataViewLayout";
import { buildPromptFromData } from "../../format/buildPromptFromData";
import type { PresentationSection } from "../../presentation/types";
import type { DemoFlowDefinition } from "../types";

export const jeffersonCostsFlow: DemoFlowDefinition = {
  id: "jefferson-costs",
  keywords: [
    "jefferson house",
    "jefferson",
    "vacant cost",
    "allocated cost",
    "business unit",
    "vacancy cost",
    "vacant vs allocated",
  ],
  responseFile: "jeffersonCosts.c1.txt",
  thinking: {
    title: "Comparing cost allocation",
    description:
      "Breaking down vacant versus allocated costs by business unit for Jefferson House.",
  },
  buildChatPrompt() {
    const data = getJeffersonPromptData();

    return buildPromptFromData({
      task: "Create a professional building cost analysis response.",
      data,
      layout: [
        "Start with DATA.intro exactly.",
        ...buildTableGraphTabsLayout({
          tableSource: "DATA.businessUnits",
          tableColumns:
            "Business Unit, Vacancy Cost ($), Allocated Cost ($), Vacant Cost %",
        }),
        "Add a Key insights section with bullets from DATA.keyInsights exactly — keep concise, no numbered sub-sections.",
        "End with a single line: Recommendation: followed by DATA.recommendation exactly.",
      ],
    });
  },
  buildPresentationSection(): PresentationSection {
    const data = getJeffersonPromptData();

    return {
      id: "jefferson-costs",
      title: "Jefferson House — Cost Allocation",
      intro: data.intro,
      tables: [
        {
          heading: "Vacant vs Allocated by Business Unit",
          columns: [
            "Business Unit",
            "Vacancy Cost ($)",
            "Allocated Cost ($)",
            "Vacant Cost %",
          ],
          rows: data.businessUnits.map((row) => [
            row.businessUnit,
            formatCurrency(row.vacancyCost),
            formatCurrency(row.allocatedCost),
            `${row.vacantCostPct}%`,
          ]),
        },
      ],
      charts: getJeffersonCharts(),
      bullets: [
        {
          label: "Key insights",
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
