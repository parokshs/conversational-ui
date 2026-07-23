export type CostPerSqftAnomaly = {
  building: string;
  floor: string;
  currentCostPerSqft: number;
  previousCostPerSqft: number;
};

export type RoomOccupancyAnomaly = {
  building: string;
  floor: string;
  room: string;
  employeeCount: number;
  workstations: number;
};

export const anomalyIntro = "Some anomalies have been found in the data";

export const sanamCostAnalysis =
  "The cost per sqft for Sanam Floor 07 has significantly increased. Almost doubling the cost per square foot points to a major shift, far outside the normal bounds of change.";

export const sanamCostAnomaly: CostPerSqftAnomaly = {
  building: "Sanam",
  floor: "07",
  currentCostPerSqft: 67.84,
  previousCostPerSqft: 37.76,
};

export const boltroRoomAnalysis =
  "A room in Boltro Road Floor 01 has been found to have an exceptionally high employee count compared to Workstations. Indicating that something is incorrect, either employees have been misplaced in this room, or it is an enclosed office where the Workstation count has not been updated.";

export const boltroRoomAnomaly: RoomOccupancyAnomaly = {
  building: "Boltro Road",
  floor: "1",
  room: "01A0705E",
  employeeCount: 21,
  workstations: 1,
};

export const anomalyUserPrompt = "What anomalies have been found in the data?";
