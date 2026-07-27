import type { PresentationChart } from "../presentation/types";

export type RetailFloorAllocation = {
  floor: string;
  actualEmployees: number;
  allocatedSpaces: number;
  office: number;
  projectTeamRoom: number;
  touchdown: number;
  variancePct: number;
  isTotal?: boolean;
};

export const retailWorkspaceIntro =
  "Analysing Retail workspace allocation by floor and seat type.";

export const retailFloorAllocations: RetailFloorAllocation[] = [
  {
    floor: "1",
    actualEmployees: 90,
    allocatedSpaces: 65,
    office: 45,
    projectTeamRoom: 10,
    touchdown: 10,
    variancePct: 72,
  },
  {
    floor: "2",
    actualEmployees: 170,
    allocatedSpaces: 110,
    office: 40,
    projectTeamRoom: 30,
    touchdown: 40,
    variancePct: 65,
  },
  {
    floor: "Total",
    actualEmployees: 260,
    allocatedSpaces: 175,
    office: 85,
    projectTeamRoom: 40,
    touchdown: 50,
    variancePct: 67,
    isTotal: true,
  },
];

export function buildRetailKeyInsights(
  rows: RetailFloorAllocation[] = retailFloorAllocations
) {
  const total = rows.find((row) => row.isTotal) ?? rows[rows.length - 1];
  const seatShortfall = total.actualEmployees - total.allocatedSpaces;

  return [
    `Retail overall: ${total.variancePct}% aligned — ${seatShortfall}-seat shortfall (${total.actualEmployees} employees, ${total.allocatedSpaces} seats).`,
    "Floor 1: 72% aligned, office-heavy, low flex capacity.",
    "Floor 2: 65% aligned, more flex seats but most overflow into other orgs' space.",
    "Root cause: not enough Retail-allocated seats on either floor.",
  ];
}

export const retailRecommendation =
  "Consolidate Retail, reallocate surplus from under-used orgs (e.g., Engineering) and add flex seating on Floor 1 — then monitor.";

export function getRetailCharts(): PresentationChart[] {
  const floorRows = retailFloorAllocations.filter((row) => !row.isTotal);

  return [
    {
      heading: "Actual Employees vs Allocated Spaces by Floor",
      chartType: "groupedBar",
      categories: floorRows.map((row) => `Floor ${row.floor}`),
      series: [
        {
          name: "Actual Employees",
          values: floorRows.map((row) => row.actualEmployees),
        },
        {
          name: "Allocated Spaces",
          values: floorRows.map((row) => row.allocatedSpaces),
        },
      ],
      valueAxisLabel: "Count",
    },
  ];
}

export function getRetailWorkspacePromptData() {
  return {
    intro: retailWorkspaceIntro,
    allocations: retailFloorAllocations,
    keyInsights: buildRetailKeyInsights(),
    recommendation: retailRecommendation,
    charts: getRetailCharts(),
  };
}
