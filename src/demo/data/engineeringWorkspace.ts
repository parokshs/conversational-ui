import type { PresentationChart } from "../presentation/types";

export type EngineeringAllocationRow = {
  floor: string;
  roomUse: string;
  employees: number;
  workstations: number;
  vacantWorkstations: number;
};

export const engineeringIntro =
  "Reviewing workspace allocation for Engineering by floor and seat type.";

export const engineeringAllocations: EngineeringAllocationRow[] = [
  {
    floor: "07",
    roomUse: "Office Cellular",
    employees: 1,
    workstations: 7,
    vacantWorkstations: 6,
  },
  {
    floor: "07",
    roomUse: "Workstation",
    employees: 0,
    workstations: 7,
    vacantWorkstations: 7,
  },
  {
    floor: "08",
    roomUse: "Workstation",
    employees: 8,
    workstations: 9,
    vacantWorkstations: 1,
  },
];

function rowsForFloor(rows: EngineeringAllocationRow[], floor: string) {
  return rows.filter((row) => row.floor === floor);
}

function sum(rows: EngineeringAllocationRow[], key: keyof EngineeringAllocationRow) {
  return rows.reduce((total, row) => total + Number(row[key]), 0);
}

export function buildEngineeringKeyInsights(
  rows: EngineeringAllocationRow[] = engineeringAllocations
) {
  const floor07Rows = rowsForFloor(rows, "07");
  const floor08Rows = rowsForFloor(rows, "08");
  const floor07Workstations = sum(floor07Rows, "workstations");
  const floor07Vacant = sum(floor07Rows, "vacantWorkstations");
  const floor07VacantPct = ((floor07Vacant / floor07Workstations) * 100).toFixed(
    1
  );
  const floor07CellularEmployees = floor07Rows.find(
    (row) => row.roomUse === "Office Cellular"
  )?.employees;
  const floor08Workstations = sum(floor08Rows, "workstations");
  const floor08Employees = sum(floor08Rows, "employees");

  return [
    `Floor 07 is heavily underutilized (${floor07Vacant} of ${floor07Workstations} workstations vacant, ${floor07VacantPct}%).`,
    `Cellular offices on Floor 07 have only ${floor07CellularEmployees} occupant${floor07CellularEmployees === 1 ? "" : "s"}.`,
    `Floor 08 is nearly fully occupied (${floor08Employees} of ${floor08Workstations} workstations in use).`,
  ];
}

export const engineeringRecommendation =
  "Consider consolidating Engineering staff from Floor 07 and repurposing or reducing the unused space.";

export function getEngineeringCharts(): PresentationChart[] {
  return [
    {
      heading: "Vacant Workstations by Floor and Room Use",
      chartType: "groupedBar",
      categories: engineeringAllocations.map(
        (row) => `Floor ${row.floor} • ${row.roomUse}`
      ),
      series: [
        {
          name: "Vacant Workstations",
          values: engineeringAllocations.map((row) => row.vacantWorkstations),
        },
        {
          name: "Employees",
          values: engineeringAllocations.map((row) => row.employees),
        },
      ],
      valueAxisLabel: "Count",
    },
  ];
}

export function getEngineeringPromptData() {
  return {
    intro: engineeringIntro,
    allocations: engineeringAllocations,
    keyInsights: buildEngineeringKeyInsights(),
    recommendation: engineeringRecommendation,
    charts: getEngineeringCharts(),
  };
}
