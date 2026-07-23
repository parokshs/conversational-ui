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

export const engineeringOpportunities = [
  "consolidate staff onto other floors,",
  "reduce operational costs,",
  "repurpose or decommission space.",
];

function rowsForFloor(rows: EngineeringAllocationRow[], floor: string) {
  return rows.filter((row) => row.floor === floor);
}

export function buildEngineeringObservations(
  rows: EngineeringAllocationRow[] = engineeringAllocations
) {
  const floor07Rows = rowsForFloor(rows, "07");
  const floor07Workstations = floor07Rows.reduce(
    (total, row) => total + row.workstations,
    0
  );
  const floor07Employees = floor07Rows.reduce(
    (total, row) => total + row.employees,
    0
  );
  const floor07Vacant = floor07Rows.reduce(
    (total, row) => total + row.vacantWorkstations,
    0
  );
  const floor07VacantPct = ((floor07Vacant / floor07Workstations) * 100).toFixed(
    1
  );
  const cellularRow = floor07Rows.find((row) => row.roomUse === "Office Cellular");
  const workstationRow = floor07Rows.find((row) => row.roomUse === "Workstation");
  const cellularOccupancy = cellularRow
    ? ((cellularRow.employees / cellularRow.workstations) * 100).toFixed(1)
    : "0.0";

  return [
    "Floor 07 is significantly underutilised",
    `Floor 07 contains ${floor07Workstations} workstations but only ${floor07Employees} employee${floor07Employees === 1 ? "" : "s"}.`,
    `${floor07Vacant} of ${floor07Workstations} workstations are vacant (${floor07VacantPct}%)`,
    `The cellular offices are only ${cellularOccupancy}% occupied`,
    workstationRow?.employees === 0
      ? "The open workstation area has no occupants at all"
      : "The open workstation area remains mostly vacant",
  ];
}

export const engineeringObservations = buildEngineeringObservations();

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
    observations: buildEngineeringObservations(),
    opportunities: engineeringOpportunities,
    charts: getEngineeringCharts(),
  };
}
