import {
  floorPlanCaption,
  floorPlanImageUrl,
  floorPlanIntro,
} from "../../data/floorPlan";
import { buildPromptFromData } from "../../format/buildPromptFromData";
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
    return buildPromptFromData({
      task: "Create a professional floor plan response for Floor 07.",
      data: {
        intro: floorPlanIntro,
        image: {
          url: floorPlanImageUrl,
          caption: floorPlanCaption,
        },
      },
      layout: [
        "Start with DATA.intro exactly.",
        "Display DATA.image.url using a large readable image component with caption DATA.image.caption.",
      ],
    });
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
