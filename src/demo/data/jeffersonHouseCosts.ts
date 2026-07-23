export type BusinessUnitCost = {
  businessUnit: string;
  vacancyCost: number;
  allocatedCost: number;
  vacantCostPct: number;
};

export type CostObservation = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  closingParagraphs?: string[];
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

export const jeffersonObservations: CostObservation[] = [
  {
    title: "Engineering is the clear outlier",
    paragraphs: [
      "Engineering has the highest vacancy rate at 59.6%, meaning almost 60 cents of every dollar of Engineering budget is vacant.",
      "What's interesting is that although its vacancy cost ($30.8k) is only the third highest, its allocated budget is relatively small ($20.9k), making the vacancy proportion extremely high.",
      "This suggests:",
    ],
    bullets: [
      "significant unfilled positions,",
      "delayed recruitment,",
      "or a department that's operating well below planned staffing.",
    ],
  },
  {
    title: "Travel has the largest financial impact",
    paragraphs: ["Travel has:"],
    bullets: [
      "the highest Vacancy Cost ($72.6k)",
      "the highest Allocated Cost ($120.5k)",
    ],
    closingParagraphs: [
      "Although its vacancy percentage (37.6%) is lower than Engineering and Operations, it represents the largest absolute value of vacant budget, so reducing vacancies here would likely have the biggest financial impact.",
    ],
  },
  {
    title: "Operations is also relatively high",
    paragraphs: ["Operations has:"],
    bullets: ["Vacancy Cost: $31.8k", "Vacancy %: 40.7%"],
    closingParagraphs: [
      "Anything above about 40% generally warrants investigation, particularly if vacancies are affecting service delivery.",
    ],
  },
  {
    title: "Finance appears well staffed",
    paragraphs: ["Finance has:"],
    bullets: [
      "lowest vacancy percentage (12.5%)",
      "one of the largest allocated costs ($106.9k)",
    ],
    closingParagraphs: [
      "This suggests staffing is relatively close to plan.",
    ],
  },
];

export const jeffersonRecommendations = [
  "Review workspace assignments for Engineering, Travel and Operations to determine whether the vacancy is intentional (for example, project-based seating or temporary moves) or whether workspace should be reallocated.",
];
