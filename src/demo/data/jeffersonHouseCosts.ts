import type { PresentationChart } from "../presentation/types";

export type BusinessUnitCost = {
  businessUnit: string;
  vacancyCost: number;
  allocatedCost: number;
  vacantCostPct: number;
};

export const jeffersonIntro =
  "I've compared the Vacant versus Allocated values by Business Unit for Jefferson House.";

export const jeffersonBusinessUnits: BusinessUnitCost[] = [
  {
    businessUnit: "Engineering",
    vacancyCost: 30831.9,
    allocatedCost: 20915.2,
    vacantCostPct: 59.6,
  },
  {
    businessUnit: "Operations",
    vacancyCost: 31812.51,
    allocatedCost: 46414.37,
    vacantCostPct: 40.7,
  },
  {
    businessUnit: "Travel",
    vacancyCost: 72618.88,
    allocatedCost: 120546.64,
    vacantCostPct: 37.6,
  },
  {
    businessUnit: "Utilities",
    vacancyCost: 35523.11,
    allocatedCost: 89817.82,
    vacantCostPct: 28.3,
  },
  {
    businessUnit: "Human Resources",
    vacancyCost: 15553.77,
    allocatedCost: 42172.88,
    vacantCostPct: 26.9,
  },
  {
    businessUnit: "Finance",
    vacancyCost: 15219.98,
    allocatedCost: 106906.88,
    vacantCostPct: 12.5,
  },
];

const formatCurrency = (value: number) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatCurrencyShort = (value: number) => {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }

  return `$${formatCurrency(value)}`;
};

function getUnit(units: BusinessUnitCost[], businessUnit: string) {
  const unit = units.find((row) => row.businessUnit === businessUnit);
  if (!unit) {
    throw new Error(`Missing business unit: ${businessUnit}`);
  }

  return unit;
}

function getHighestVacancyRateUnit(units: BusinessUnitCost[]) {
  return [...units].sort((a, b) => b.vacantCostPct - a.vacantCostPct)[0];
}

function getLargestVacantCostUnit(units: BusinessUnitCost[]) {
  return [...units].sort((a, b) => b.vacancyCost - a.vacancyCost)[0];
}

function getLowestVacancyRateUnit(units: BusinessUnitCost[]) {
  return [...units].sort((a, b) => a.vacantCostPct - b.vacantCostPct)[0];
}

export function buildJeffersonKeyInsights(
  units: BusinessUnitCost[] = jeffersonBusinessUnits
) {
  const travel = getLargestVacantCostUnit(units);
  const operations = getUnit(units, "Operations");
  const finance = getLowestVacancyRateUnit(units);
  const highestVacancy = getHighestVacancyRateUnit(units);

  return [
    `${highestVacancy.businessUnit} has the highest vacancy rate (${highestVacancy.vacantCostPct}%).`,
    `${travel.businessUnit} has the largest vacant cost (${formatCurrencyShort(travel.vacancyCost)}).`,
    `${operations.businessUnit} also shows elevated vacancy (${operations.vacantCostPct}%).`,
    `${finance.businessUnit} is the best utilized (${finance.vacantCostPct}% vacancy).`,
  ];
}

export const jeffersonRecommendation =
  "Prioritize reviewing space allocation for Engineering, Travel, and Operations.";

export function getJeffersonCharts(): PresentationChart[] {
  return [
    {
      heading: "Vacant Cost % Share by Business Unit",
      chartType: "pie",
      categories: jeffersonBusinessUnits.map((row) => row.businessUnit),
      series: [
        {
          name: "Vacant Cost %",
          values: jeffersonBusinessUnits.map((row) => row.vacantCostPct),
        },
      ],
      valueAxisLabel: "Vacant Cost %",
    },
    {
      heading: "Vacancy Cost vs Allocated Cost",
      chartType: "groupedBar",
      categories: jeffersonBusinessUnits.map((row) => row.businessUnit),
      series: [
        {
          name: "Vacancy Cost ($)",
          values: jeffersonBusinessUnits.map((row) => row.vacancyCost),
        },
        {
          name: "Allocated Cost ($)",
          values: jeffersonBusinessUnits.map((row) => row.allocatedCost),
        },
      ],
      valueAxisLabel: "USD",
    },
  ];
}

export function getJeffersonPromptData() {
  return {
    intro: jeffersonIntro,
    businessUnits: jeffersonBusinessUnits,
    keyInsights: buildJeffersonKeyInsights(),
    recommendation: jeffersonRecommendation,
    charts: getJeffersonCharts(),
  };
}

export { formatCurrency };
