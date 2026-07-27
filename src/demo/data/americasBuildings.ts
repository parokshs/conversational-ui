import type {
  PresentationChart,
  PresentationHighlight,
} from "../presentation/types";

export type BuildingOccupancy = {
  building: string;
  programHeadcount: number;
  assignedSeats: number;
  vacantPct: number;
};

export const americasBuildings: BuildingOccupancy[] = [
  { building: "Building A", programHeadcount: 415, assignedSeats: 430, vacantPct: 4.4 },
  { building: "Building B", programHeadcount: 368, assignedSeats: 380, vacantPct: 5.0 },
  { building: "Building C", programHeadcount: 522, assignedSeats: 540, vacantPct: 5.3 },
  { building: "Building D", programHeadcount: 298, assignedSeats: 310, vacantPct: 4.6 },
  { building: "Building E", programHeadcount: 640, assignedSeats: 660, vacantPct: 5.7 },
  { building: "Building F", programHeadcount: 942, assignedSeats: 577, vacantPct: 24.0 },
  { building: "Building G", programHeadcount: 455, assignedSeats: 470, vacantPct: 4.1 },
  { building: "Building H", programHeadcount: 328, assignedSeats: 340, vacantPct: 5.6 },
  { building: "Building I", programHeadcount: 575, assignedSeats: 590, vacantPct: 4.8 },
  { building: "Building J", programHeadcount: 390, assignedSeats: 405, vacantPct: 4.7 },
];

export const americasIntro =
  "I've analysed the Americas Region portfolio and found 10 buildings.";

export const americasUtilizationThresholdPct = 10;

export function getAmericasOutlierBuilding(
  buildings: BuildingOccupancy[] = americasBuildings
) {
  return buildings.reduce((max, row) =>
    row.vacantPct > max.vacantPct ? row : max
  );
}

export function getAmericasHighlights(): PresentationHighlight[] {
  const outlierBuilding = getAmericasOutlierBuilding();

  return [
    {
      label: "Highest Vacant %",
      value: `${outlierBuilding.vacantPct}%`,
      caption: `${outlierBuilding.building} leads the Americas portfolio`,
    },
  ];
}

export function buildAmericasObservation(
  buildings: BuildingOccupancy[] = americasBuildings,
  { highlight = true }: { highlight?: boolean } = {}
) {
  const outlierBuilding = getAmericasOutlierBuilding(buildings);
  const buildingName = highlight
    ? `**${outlierBuilding.building}**`
    : outlierBuilding.building;
  const vacancyRate = highlight
    ? `**${outlierBuilding.vacantPct}%**`
    : `${outlierBuilding.vacantPct}%`;
  const utilizationThreshold = highlight
    ? `**${americasUtilizationThresholdPct}%**`
    : `${americasUtilizationThresholdPct}%`;

  return `${buildingName} is a clear outlier with the highest vacancy rate (${vacancyRate}), well above the rest of the Americas portfolio. Most other buildings have vacancy below ${utilizationThreshold}, indicating generally high space utilization across the region.`;
}

export function getAmericasCharts(): PresentationChart[] {
  const sortedByVacancy = [...americasBuildings].sort(
    (a, b) => b.vacantPct - a.vacantPct
  );

  return [
    {
      heading: "Vacant % by Building",
      chartType: "horizontalBar",
      categories: sortedByVacancy.map((row) => row.building),
      series: [
        {
          name: "Vacant %",
          values: sortedByVacancy.map((row) => row.vacantPct),
        },
      ],
      valueAxisLabel: "Vacant %",
    },
  ];
}

export function getAmericasPromptData() {
  return {
    intro: americasIntro,
    buildings: americasBuildings,
    observation: buildAmericasObservation(),
    highlights: getAmericasHighlights(),
    charts: getAmericasCharts(),
  };
}
