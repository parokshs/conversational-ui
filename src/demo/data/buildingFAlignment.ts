import type { PresentationChart } from "../presentation/types";

export type BusinessUnitAlignment = {
  businessUnit: string;
  actualEqualsAllocatedPct: number;
  actualNotEqualsAllocatedPct: number;
  status: string;
};

export const buildingFAlignmentIntro =
  "I've compared the Actual versus Allocated values by Business Unit for Building F.";

export const buildingFAlignmentRows: BusinessUnitAlignment[] = [
  {
    businessUnit: "Engineering",
    actualEqualsAllocatedPct: 92,
    actualNotEqualsAllocatedPct: 8,
    status: "Healthy",
  },
  {
    businessUnit: "Finance",
    actualEqualsAllocatedPct: 89,
    actualNotEqualsAllocatedPct: 11,
    status: "Healthy",
  },
  {
    businessUnit: "Human Resources",
    actualEqualsAllocatedPct: 98,
    actualNotEqualsAllocatedPct: 2,
    status: "Excellent",
  },
  {
    businessUnit: "Staff Groups",
    actualEqualsAllocatedPct: 96,
    actualNotEqualsAllocatedPct: 4,
    status: "Excellent",
  },
  {
    businessUnit: "Operations",
    actualEqualsAllocatedPct: 90,
    actualNotEqualsAllocatedPct: 10,
    status: "Healthy",
  },
  {
    businessUnit: "Retail",
    actualEqualsAllocatedPct: 68,
    actualNotEqualsAllocatedPct: 32,
    status: "To investigate",
  },
];

export function getBuildingFAverageAlignment(
  rows: BusinessUnitAlignment[] = buildingFAlignmentRows
) {
  const total = rows.reduce((sum, row) => sum + row.actualEqualsAllocatedPct, 0);
  return Math.round(total / rows.length);
}

export function buildBuildingFKeyInsights(
  rows: BusinessUnitAlignment[] = buildingFAlignmentRows
) {
  const averageAlignment = getBuildingFAverageAlignment(rows);
  const retail = rows.find((row) => row.businessUnit === "Retail");
  const humanResources = rows.find((row) => row.businessUnit === "Human Resources");

  return [
    `Building F avg: ${averageAlignment}% alignment — healthy overall.`,
    `Retail outlier: ${retail?.actualEqualsAllocatedPct}% alignment, ${retail?.actualNotEqualsAllocatedPct}% misallocated — nearly 3x the building average.`,
    `Human Resources Team leads: ${humanResources?.actualEqualsAllocatedPct}% alignment, best in building.`,
    "Rest of BUs: 89–96%, all Healthy/Excellent.",
  ];
}

export const buildingFRecommendation =
  "Investigate Retail — confirm if misalignment is intentional (project seating, temp moves) or needs reallocation.";

export function getBuildingFCharts(): PresentationChart[] {
  const sortedByAlignment = [...buildingFAlignmentRows].sort(
    (a, b) => a.actualEqualsAllocatedPct - b.actualEqualsAllocatedPct
  );

  return [
    {
      heading: "Actual = Allocated % by Business Unit",
      chartType: "horizontalBar",
      categories: sortedByAlignment.map((row) => row.businessUnit),
      series: [
        {
          name: "Actual = Allocated %",
          values: sortedByAlignment.map((row) => row.actualEqualsAllocatedPct),
        },
      ],
      valueAxisLabel: "Alignment %",
      categoryAxisLabel: "Business Unit",
    },
  ];
}

export function getBuildingFAlignmentPromptData() {
  return {
    intro: buildingFAlignmentIntro,
    businessUnits: buildingFAlignmentRows,
    keyInsights: buildBuildingFKeyInsights(),
    recommendation: buildingFRecommendation,
    charts: getBuildingFCharts(),
  };
}
