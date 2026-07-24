import type { PresentationChart } from "../presentation/types";

export type CostPerSqftAnomaly = {
  building: string;
  floor: string;
  currentCostPerSqft: number;
  previousCostPerSqft: number;
};

export type RoomOccupancyAnomaly = {
  building: string;
  floor: string;
  room: string;
  employeeCount: number;
  workstations: number;
};

export const anomalyIntro =
  "Some anomalies have been found in the data. Review the highlighted findings below.";

export const sanamCostAnalysis =
  "The cost per sqft for Sanam Floor 07 has significantly increased. Almost doubling the cost per square foot points to a major shift, far outside the normal bounds of change.";

export const sanamCostAnomaly: CostPerSqftAnomaly = {
  building: "Sanam",
  floor: "07",
  currentCostPerSqft: 67.84,
  previousCostPerSqft: 37.76,
};

export const boltroRoomAnalysis =
  "A room in Boltro Road Floor 01 has been found to have an exceptionally high employee count compared to Workstations. Indicating that something is incorrect, either employees have been misplaced in this room, or it is an enclosed office where the Workstation count has not been updated.";

export const boltroRoomAnomaly: RoomOccupancyAnomaly = {
  building: "Boltro Road",
  floor: "1",
  room: "01A0705E",
  employeeCount: 21,
  workstations: 1,
};

export const anomalyUserPrompt = "What anomalies have been found in the data?";

export function getSanamCostIncreasePct(
  anomaly: CostPerSqftAnomaly = sanamCostAnomaly
) {
  return Number(
    (
      ((anomaly.currentCostPerSqft - anomaly.previousCostPerSqft) /
        anomaly.previousCostPerSqft) *
      100
    ).toFixed(1)
  );
}

export function getBoltroEmployeesPerWorkstation(
  anomaly: RoomOccupancyAnomaly = boltroRoomAnomaly
) {
  return anomaly.employeeCount / anomaly.workstations;
}

export function getAnomalySummaryCards() {
  const costIncreasePct = getSanamCostIncreasePct();
  const employeesPerWorkstation = getBoltroEmployeesPerWorkstation();

  return [
    {
      title: "Cost spike",
      label: `${sanamCostAnomaly.building} Floor ${sanamCostAnomaly.floor}`,
      stat: `+${costIncreasePct}%`,
      statLabel: "Cost per SQFT vs prior",
      iconName: "trending-up",
      iconCategory: "charts",
    },
    {
      title: "Occupancy mismatch",
      label: `${boltroRoomAnomaly.building} · ${boltroRoomAnomaly.room}`,
      stat: `${employeesPerWorkstation}:1`,
      statLabel: "Employees per workstation",
      iconName: "alert-triangle",
      iconCategory: "notifications",
    },
  ];
}

export function getSanamChart(): PresentationChart {
  return {
    heading: "Sanam Floor 07 · Cost per SQFT",
    chartType: "groupedBar",
    categories: [`${sanamCostAnomaly.building} Floor ${sanamCostAnomaly.floor}`],
    series: [
      {
        name: "Previous Cost per SQFT",
        values: [sanamCostAnomaly.previousCostPerSqft],
      },
      {
        name: "Current Cost per SQFT",
        values: [sanamCostAnomaly.currentCostPerSqft],
      },
    ],
    valueAxisLabel: "USD per SQFT",
  };
}

export function getBoltroChart(): PresentationChart {
  return {
    heading: "Boltro Road · Room Occupancy",
    chartType: "groupedBar",
    categories: [boltroRoomAnomaly.room],
    series: [
      {
        name: "Employees",
        values: [boltroRoomAnomaly.employeeCount],
      },
      {
        name: "Workstations",
        values: [boltroRoomAnomaly.workstations],
      },
    ],
    valueAxisLabel: "Count",
  };
}

export function getAnomalyFindings() {
  const costIncreasePct = getSanamCostIncreasePct();

  return [
    {
      id: "sanam-cost-per-sqft",
      title: "Sanam · Cost per SQFT",
      severity: "warning",
      calloutTitle: "Cost spike detected",
      calloutDescription: `Cost per SQFT is up **${costIncreasePct}%** versus the prior period.`,
      analysis: sanamCostAnalysis,
      chart: getSanamChart(),
      table: {
        columns: [
          "Building",
          "Floor",
          "Current Cost per SQFT",
          "Previous Cost per SQFT",
        ],
        rows: [
          [
            sanamCostAnomaly.building,
            sanamCostAnomaly.floor,
            sanamCostAnomaly.currentCostPerSqft,
            sanamCostAnomaly.previousCostPerSqft,
          ],
        ],
      },
    },
    {
      id: "boltro-room-occupancy",
      title: "Boltro Road · Room Occupancy",
      severity: "warning",
      calloutTitle: "Occupancy mismatch detected",
      calloutDescription: `**${boltroRoomAnomaly.employeeCount}** employees assigned to **${boltroRoomAnomaly.workstations}** workstation in room ${boltroRoomAnomaly.room}.`,
      analysis: boltroRoomAnalysis,
      chart: getBoltroChart(),
      table: {
        columns: [
          "Building",
          "Floor",
          "Room",
          "Employee Count",
          "Workstations",
        ],
        rows: [
          [
            boltroRoomAnomaly.building,
            boltroRoomAnomaly.floor,
            boltroRoomAnomaly.room,
            boltroRoomAnomaly.employeeCount,
            boltroRoomAnomaly.workstations,
          ],
        ],
      },
    },
  ];
}

export function getAnomalyPromptData() {
  return {
    intro: anomalyIntro,
    summary: {
      anomalyCount: getAnomalyFindings().length,
      cards: getAnomalySummaryCards(),
    },
    findings: getAnomalyFindings(),
  };
}
