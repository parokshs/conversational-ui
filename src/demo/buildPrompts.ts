import {
  americasBuildings,
  americasIntro,
} from "./data/americasBuildings";
import {
  jeffersonBusinessUnits,
  jeffersonGreenFlags,
  jeffersonIntro,
  jeffersonRecommendations,
  jeffersonRedFlags,
  jeffersonSummary,
} from "./data/jeffersonHouseCosts";

const formatCurrency = (value: number) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export function buildAmericasPrompt(): string {
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
}

export function buildJeffersonPrompt(): string {
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
}

export const demoResponseJobs = [
  {
    file: "americasOccupancy.c1.txt",
    buildPrompt: buildAmericasPrompt,
  },
  {
    file: "jeffersonCosts.c1.txt",
    buildPrompt: buildJeffersonPrompt,
  },
] as const;
