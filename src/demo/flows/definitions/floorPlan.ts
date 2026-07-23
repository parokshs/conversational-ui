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
        "Render DATA.image using an ImageGallery component (NOT Layout, NOT Image, NOT ImageBlock).",
        "Set imagesSrc to [DATA.image.url] and imagesAlt to [DATA.image.caption].",
        "The gallery must be full width inside the card so the floor plan is sharp and readable.",
        "ImageGallery opens a lightbox on click so users can inspect the plan at full size.",
        "Add a short TextContent caption below the gallery using DATA.image.caption.",
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
