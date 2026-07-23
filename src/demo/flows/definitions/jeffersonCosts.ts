import {
  jeffersonBusinessUnits,
  jeffersonGreenFlags,
  jeffersonIntro,
  jeffersonRecommendations,
  jeffersonRedFlags,
  jeffersonSummary,
} from "../../data/jeffersonHouseCosts";
import type { PresentationSection } from "../../presentation/types";
import type { DemoFlowDefinition } from "../types";

const formatCurrency = (value: number) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const jeffersonCostsFlow: DemoFlowDefinition = {
  id: "jefferson-costs",
  keywords: [
    "jefferson house",
    "jefferson",
    "vacant cost",
    "allocated cost",
    "business unit",
    "exec org",
    "vacancy cost",
  ],
  responseFile: "jeffersonCosts.c1.txt",
  thinking: {
    title: "Comparing cost allocation",
    description:
      "Breaking down vacant versus allocated costs by business unit for Jefferson House.",
  },
  buildChatPrompt() {
    const rows = jeffersonBusinessUnits
      .map(
        (row) =>
          `${row.businessUnit}: Vacancy Cost $${formatCurrency(row.vacancyCost)}, Allocated Cost $${formatCurrency(row.allocatedCost)}, Vacant Cost % ${row.vacantCostPct}`
      )
      .join("\n");

    return `Create a professional building cost analysis response.

Start with this exact sentence:
"${jeffersonIntro}"

Then render a data table with exactly these columns: Business Unit, Vacancy Cost ($), Allocated Cost ($), Vacant Cost %

Use exactly this data:
${rows}

After the table, add clearly labeled sections:

Red Flags:
${jeffersonRedFlags.map((item) => `- ${item}`).join("\n")}

Green Flag:
${jeffersonGreenFlags.map((item) => `- ${item}`).join("\n")}

Summary:
${jeffersonSummary.map((item) => `- ${item}`).join("\n")}

Recommendations:
${jeffersonRecommendations.map((item) => `- ${item}`).join("\n")}

Do not mention that this is a demo or staged. Use red styling for red flags and green styling for green flags where appropriate.`;
  },
  buildPresentationSection(): PresentationSection {
    return {
      id: "jefferson-costs",
      title: "Jefferson House — Cost Allocation",
      intro: jeffersonIntro,
      tables: [
        {
          heading: "Business Unit Costs",
          columns: [
            "Business Unit",
            "Vacancy Cost ($)",
            "Allocated Cost ($)",
            "Vacant Cost %",
          ],
          rows: jeffersonBusinessUnits.map((row) => [
            row.businessUnit,
            formatCurrency(row.vacancyCost),
            formatCurrency(row.allocatedCost),
            `${row.vacantCostPct}%`,
          ]),
        },
      ],
      callouts: [
        {
          label: "Red Flags",
          tone: "red",
          items: jeffersonRedFlags,
        },
        {
          label: "Green Flag",
          tone: "green",
          items: jeffersonGreenFlags,
        },
      ],
      bullets: [
        {
          label: "Summary",
          items: jeffersonSummary,
        },
        {
          label: "Recommendations",
          items: jeffersonRecommendations,
        },
      ],
    };
  },
};
