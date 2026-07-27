// Drop your floor plan image at: public/demo/floor-1-plan.png
// It will be served at /demo/floor-1-plan.png
export const floorPlanIntro =
  "Floor 1 workspace allocation with leaders legend.";

export const floorPlanImageUrl = "/demo/floor-1-plan.png";

export const floorPlanCaption =
  "Floor 1 — highlighted floorplan with leaders legend";

export const floorPlanLegendDescription =
  "Highlighted Floor 1 workspace allocation with leaders legend for occupied and vacant workstations by Business Unit.";

export const floorPlanKeyInsights = [
  "Overall occupancy: 38 occupied / 53 total workstations (~72%) — 15 vacant desks remain.",
  "Engineering is the biggest underutiliser: only 1 occupied vs. 13 vacant — largest opportunity for reallocation.",
  "Travel, Technologies, and Staff Groups are fully utilised (14, 9, 8 occupied, 0 vacant) — no spare capacity.",
  "Retail and Utilities show minimal presence (0 occupied, 1 vacant each) — negligible footprint on this floor.",
];

export function getFloorPlanPromptData() {
  return {
    intro: floorPlanIntro,
    image: {
      url: floorPlanImageUrl,
      caption: floorPlanCaption,
    },
    legendDescription: floorPlanLegendDescription,
    keyInsights: floorPlanKeyInsights,
  };
}
