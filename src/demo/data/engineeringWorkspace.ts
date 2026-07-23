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

export const engineeringObservations = [
  "Floor 07 is significantly underutilised",
  "Floor 07 contains 14 workstations but only 1 employee.",
  "13 of 14 workstations are vacant (92.9%)",
  "The cellular offices are only 14.3% occupied",
  "The open workstation area has no occupants at all",
];

export const engineeringOpportunities = [
  "consolidate staff onto other floors,",
  "reduce operational costs,",
  "repurpose or decommission space.",
];
