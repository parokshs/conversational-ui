import {
  jeffersonBusinessUnits,
  jeffersonIntro,
  jeffersonObservations,
  jeffersonRecommendations,
} from "../../data/jeffersonHouseCosts";
import type { PresentationSection } from "../../presentation/types";
import type { DemoFlowDefinition } from "../types";

const formatCurrency = (value: number) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function formatObservation(
  observation: (typeof jeffersonObservations)[number],
  index: number
): string {
  const lines = [`${index + 1}. ${observation.title}`];

  for (const paragraph of observation.paragraphs) {
    lines.push(paragraph);
  }

  if (observation.bullets?.length) {
    lines.push(...observation.bullets.map((item) => `- ${item}`));
  }

  if (observation.closingParagraphs?.length) {
    lines.push(...observation.closingParagraphs);
  }

  return lines.join("\n");
}

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
    const rows = jeffersonBusinessUnits
      .map(
        (row) =>
          `${row.businessUnit}: Vacancy Cost $${formatCurrency(row.vacancyCost)}, Allocated Cost $${formatCurrency(row.allocatedCost)}, Vacant Cost % ${row.vacantCostPct}`
      )
      .join("\n");

    const analysis = jeffersonObservations
      .map((observation, index) => formatObservation(observation, index))
      .join("\n\n");

    return `Create a professional building cost analysis response.

Start with this exact sentence:
"${jeffersonIntro}"

Then render a data table with exactly these columns: Business Unit, Vacancy Cost ($), Allocated Cost ($), Vacant Cost %

Use exactly this data:
${rows}

After the table, add clearly numbered analysis sections using this exact content:
${analysis}

End with a Recommendations section:
${jeffersonRecommendations.map((item) => `- ${item}`).join("\n")}

Do not mention that this is a demo or staged. Keep the layout clean and executive-ready.`;
  },
  buildPresentationSection(): PresentationSection {
    return {
      id: "jefferson-costs",
      title: "Jefferson House — Cost Allocation",
      intro: jeffersonIntro,
      tables: [
        {
          heading: "Vacant vs Allocated by Business Unit",
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
      bullets: [
        ...jeffersonObservations.map((observation) => ({
          label: observation.title,
          items: [
            ...observation.paragraphs,
            ...(observation.bullets ?? []),
            ...(observation.closingParagraphs ?? []),
          ],
        })),
        {
          label: "Recommendations",
          items: jeffersonRecommendations,
        },
      ],
    };
  },
};
