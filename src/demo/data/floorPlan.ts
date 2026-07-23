export const floorPlanIntro =
  "Floor 07 workspace allocation by Business Unit, with occupied and vacant workstation counts in the legend.";

export const floorPlanImageUrl =
  "https://res.cloudinary.com/zdhgzz00/image/upload/q_auto:best,w_1400,f_auto/v1784785651/floor-plan_ddlqm6.png";

export const floorPlanCaption =
  "Floor 07 — Business Unit allocation with occupied and vacant workstation legend";

export const floorPlanHighlightDescription =
  "Highlighted Floor 07 workspace allocation by Business Unit. Red dots indicate Vacant Workstations and orange dots indicate Reserved Desks.";

export const floorPlanKeyInsights = [
  "Travel (14) and Technologies (9) occupy the largest share of workstations.",
  "Engineering has the highest vacancy, with 13 vacant and 1 occupied workstation.",
  "Retail and Utilities each have 1 vacant workstation and no occupied workstations.",
  "Overall, 38 workstations are occupied and 15 are vacant on Floor 07.",
];

export function getFloorPlanPromptData() {
  return {
    intro: floorPlanIntro,
    image: {
      url: floorPlanImageUrl,
      caption: floorPlanCaption,
    },
    highlightDescription: floorPlanHighlightDescription,
    keyInsights: floorPlanKeyInsights,
  };
}
