import type {
  PresentationChart,
  PresentationHighlight,
} from "../presentation/types";

export type BuildingOccupancy = {
  building: string;
  employees: number;
  seats: number;
  vacantPct: number;
};

export const americasBuildings: BuildingOccupancy[] = [
  { building: "Jefferson House", employees: 232, seats: 250, vacantPct: 30 },
  { building: "Murindo", employees: 294, seats: 250, vacantPct: 18.4 },
  { building: "Eastgate Tower", employees: 839, seats: 664, vacantPct: 18.2 },
  { building: "Harrison Block", employees: 320, seats: 174, vacantPct: 9.8 },
  { building: "Steveston", employees: 237, seats: 250, vacantPct: 8.4 },
  { building: "Maxville Place", employees: 723, seats: 510, vacantPct: 7.3 },
  { building: "San Justo Building", employees: 292, seats: 245, vacantPct: 3.3 },
  { building: "Melia House", employees: 223, seats: 174, vacantPct: 2.9 },
  { building: "Fisher", employees: 333, seats: 245, vacantPct: 2.4 },
  { building: "Pelican House", employees: 306, seats: 250, vacantPct: 1.2 },
];

export const americasIntro =
  "I've analysed the Americas portfolio. Here are the top 10 buildings with the highest Vacant percentage figures.";

export function getAmericasHighlights(): PresentationHighlight[] {
  const topBuilding = americasBuildings[0];

  return [
    {
      label: "Highest Vacant %",
      value: `${topBuilding.vacantPct}%`,
      caption: `${topBuilding.building} leads the Americas portfolio`,
    },
  ];
}

export function getAmericasCharts(): PresentationChart[] {
  return [
    {
      heading: "Vacant % by Building",
      chartType: "horizontalBar",
      categories: americasBuildings.map((row) => row.building),
      series: [
        {
          name: "Vacant %",
          values: americasBuildings.map((row) => row.vacantPct),
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
    highlights: getAmericasHighlights(),
    charts: getAmericasCharts(),
  };
}
