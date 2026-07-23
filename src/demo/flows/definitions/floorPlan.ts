import {
  floorPlanCaption,
  floorPlanImageUrl,
  floorPlanIntro,
} from "../../data/floorPlan";
import type { PresentationSection } from "../../presentation/types";
import type { DemoFlowDefinition } from "../types";

export const floorPlanFlow: DemoFlowDefinition = {
  id: "floor-plan",
  keywords: [
    "floorplan",
    "floor plan",
    "floor 07",
    "floor 7",
    "highlighted",
    "business unit allocation",
    "legend",
    "occupied",
    "vacant workstations",
  ],
  responseFile: "floorPlan.c1.txt",
  thinking: {
    title: "Loading floor plan",
    description:
      "Rendering the Floor 07 allocation map with occupied and vacant workstation legend.",
  },
  buildChatPrompt() {
    return `Create a professional floor plan response for Floor 07.

Start with this exact sentence:
"${floorPlanIntro}"

Then display the floor plan image using this exact URL:
${floorPlanImageUrl}

Use a large, readable image component with this caption:
"${floorPlanCaption}"

Do not mention that this is a demo or staged. Keep the layout clean and executive-ready.`;
  },
  buildPresentationSection(): PresentationSection {
    return {
      id: "floor-plan",
      title: "Floor 07 — Business Unit Allocation",
      intro: floorPlanIntro,
      images: [
        {
          url: floorPlanImageUrl,
          alt: floorPlanCaption,
          caption: floorPlanCaption,
        },
      ],
    };
  },
};
