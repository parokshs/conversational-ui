export type BusinessUnitCost = {
  businessUnit: string;
  vacancyCost: number;
  allocatedCost: number;
  vacantCostPct: number;
};

export const jeffersonIntro =
  "I've compared the Actual versus Allocated values by Exec Org Detail for Jefferson House Building.";

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

export const jeffersonRedFlags = [
  "Engineering 60% owned space is not being utilized.",
  "Travel $72,618.88 is paying for vacant space, this is more than double of any other Business Unit in the building.",
];

export const jeffersonGreenFlags = [
  "Finance has the lowest cost as well as the lowest Vacant Cost %.",
];

export const jeffersonSummary = [
  "The average alignment across Jefferson House Building is 89%.",
  "WCX is the only significant outlier, with 32% of employees occupying workspace allocated to another Exec Org Detail.",
  "All other organisations demonstrate alignment of 89% or higher, suggesting workspace allocation is generally consistent with organisational ownership.",
];

export const jeffersonRecommendations = [
  "Review workspace assignments for WCX to determine whether the misalignment is intentional (for example, project-based seating or temporary moves) or whether workspace should be reallocated.",
];
