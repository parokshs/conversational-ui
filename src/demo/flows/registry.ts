import type { StagedFlow } from "./types";

export const stagedFlows: StagedFlow[] = [
  {
    id: "americas-occupancy",
    keywords: [
      "occupancy",
      "americas",
      "building level",
      "building metrics",
      "portfolio",
      "vacant",
      "seats",
      "employees",
    ],
    responseFile: "americasOccupancy.c1.txt",
    thinking: {
      title: "Analysing portfolio data",
      description: "Reviewing building-level occupancy across the Americas region.",
    },
  },
  {
    id: "jefferson-costs",
    keywords: [
      "jefferson house",
      "jefferson",
      "vacant cost",
      "allocated cost",
      "business unit",
      "exec org",      
      "vacancy cost",
    ],
    responseFile: "jeffersonCosts.c1.txt",
    thinking: {
      title: "Comparing cost allocation",
      description:
        "Breaking down vacant versus allocated costs by business unit for Jefferson House.",
    },
  },
];
