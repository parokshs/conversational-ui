import {
  formatCurrency,
  getJeffersonCharts,
  getJeffersonPromptData,
} from "../../data/jeffersonHouseCosts";
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
        `Start with DATA.intro exactly.`,
        "Render a data table from DATA.businessUnits with columns: Business Unit, Vacancy Cost ($), Allocated Cost ($), Vacant Cost %.",
        "After the table, render DATA.charts[0] as a horizontal bar chart for Vacant Cost % by Business Unit.",
        "Then render DATA.charts[1] as a grouped bar chart comparing Vacancy Cost ($) and Allocated Cost ($).",
        "Add clearly numbered analysis sections from DATA.observations (title, paragraphs, bullets, closingParagraphs).",
        "End with a Recommendations section from DATA.recommendations.",
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
        ...data.observations.map((observation) => ({
          label: observation.title,
          items: [
            ...observation.paragraphs,
            ...(observation.bullets ?? []),
            ...(observation.closingParagraphs ?? []),
          ],
        })),
        {
          label: "Recommendations",
          items: data.recommendations,
        },
      ],
    };
  },
};
