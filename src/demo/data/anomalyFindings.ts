import type { PresentationChart } from "../presentation/types";

export type AreaDiscrepancyAnomaly = {
  building: string;
  documentedAreaSqft: number;
  measuredAreaSqft: number;
  percentage: number;
};

export type RoomOccupancyAnomaly = {
  building: string;
  floor: string;
  room: string;
  employeeCount: number;
  workstations: number;
};

export const anomalyIntro =
  "Some anomalies have been found in the data";

export const sanamAreaAnalysis =
  "The documented area for building Sanam is significantly different from the measured area on the floor plan.";

export const sanamAreaAnomaly: AreaDiscrepancyAnomaly = {
  building: "Sanam",
  documentedAreaSqft: 36446,
  measuredAreaSqft: 51232.11,
  percentage: 140.6,
};

export const boltroRoomAnalysis =
  "A room in Boltro Road Floor 01 has been found to have an exceptionally high employee count compared to workstations. Indicating that something is incorrect, either employees have been misplaced in this room, or it is an enclosed office where the workstation count has not been updated.";

export const boltroRoomAnomaly: RoomOccupancyAnomaly = {
  building: "Boltro Road",
  floor: "1",
  room: "01A0705E",
  employeeCount: 21,
  workstations: 1,
};

export const anomalyUserPrompt = "What anomalies have been found in the data?";

function formatArea(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

export function getBoltroEmployeesPerWorkstation(
  anomaly: RoomOccupancyAnomaly = boltroRoomAnomaly
) {
  return anomaly.employeeCount / anomaly.workstations;
}

export function getAnomalySummaryCards() {
  const employeesPerWorkstation = getBoltroEmployeesPerWorkstation();

  return [
    {
      title: "Occupancy mismatch",
      label: `${boltroRoomAnomaly.building} · ${boltroRoomAnomaly.room}`,
      stat: `${employeesPerWorkstation}:1`,
      statLabel: "Employees per workstation",
      iconName: "alert-triangle",
      iconCategory: "notifications",
    },
    {
      title: "Area mismatch",
      label: `${sanamAreaAnomaly.building}`,
      stat: `${sanamAreaAnomaly.percentage}%`,
      statLabel: "Measured vs documented area",
      iconName: "trending-up",
      iconCategory: "charts",
    },
  ];
}

export function getSanamChart(): PresentationChart {
  return {
    heading: "Sanam · Documented vs Measured Area",
    chartType: "groupedBar",
    categories: [sanamAreaAnomaly.building],
    series: [
      {
        name: "Documented Area SQFT",
        values: [sanamAreaAnomaly.documentedAreaSqft],
      },
      {
        name: "Measured Area SQFT",
        values: [sanamAreaAnomaly.measuredAreaSqft],
      },
    ],
    valueAxisLabel: "SQFT",
  };
}

export function getBoltroChart(): PresentationChart {
  return {
    heading: "Boltro Road · Room Occupancy",
    chartType: "groupedBar",
    categories: [boltroRoomAnomaly.room],
    series: [
      {
        name: "Employee Count",
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
  return [
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
    {
      id: "sanam-area-discrepancy",
      title: "Sanam · Area Discrepancy",
      severity: "warning",
      calloutTitle: "Area mismatch detected",
      calloutDescription: `Measured area is **${sanamAreaAnomaly.percentage}%** of documented area for ${sanamAreaAnomaly.building}.`,
      analysis: sanamAreaAnalysis,
      chart: getSanamChart(),
      table: {
        columns: [
          "Building",
          "Documented Area SQFT",
          "Measured Area SQFT",
          "Percentage",
        ],
        rows: [
          [
            sanamAreaAnomaly.building,
            formatArea(sanamAreaAnomaly.documentedAreaSqft),
            formatArea(sanamAreaAnomaly.measuredAreaSqft),
            `${sanamAreaAnomaly.percentage}%`,
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
