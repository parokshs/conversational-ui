import {
  anomalyIntro,
  anomalyUserPrompt,
  boltroRoomAnalysis,
  boltroRoomAnomaly,
  sanamCostAnalysis,
  sanamCostAnomaly,
} from "../data/anomalyFindings";

export const anomalyResponseFile = "anomalyFindings.c1.txt";

export function buildAnomalyChatPrompt() {
  return `Create a professional data anomaly report response.

Start with this exact sentence:
"${anomalyIntro}"

Then add this analysis paragraph:
"${sanamCostAnalysis}"

Render a table with exactly these columns: Building, Floor, Current Cost per SQFT, Previous Cost per SQFT

Use exactly this row:
${sanamCostAnomaly.building}, ${sanamCostAnomaly.floor}, ${sanamCostAnomaly.currentCostPerSqft}, ${sanamCostAnomaly.previousCostPerSqft}

Then add this analysis paragraph:
"${boltroRoomAnalysis}"

Render a second table with exactly these columns: Building, Floor, Room, Employee Count, Workstations

Use exactly this row:
${boltroRoomAnomaly.building}, ${boltroRoomAnomaly.floor}, ${boltroRoomAnomaly.room}, ${boltroRoomAnomaly.employeeCount}, ${boltroRoomAnomaly.workstations}

Do not mention that this is a demo or staged. Keep the layout clean and executive-ready.`;
}

export { anomalyUserPrompt };
