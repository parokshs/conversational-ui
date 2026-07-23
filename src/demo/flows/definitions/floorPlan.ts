import { getFloorPlanPromptData } from "../../data/floorPlan";
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
    const data = getFloorPlanPromptData();

    return buildPromptFromData({
      task: "Create a professional floor plan response for Floor 07.",
      data,
      layout: [
        "Start with DATA.intro exactly.",
        "Render DATA.image using an ImageGallery component (NOT Layout, NOT Image, NOT ImageBlock).",
        "Set imagesSrc to [DATA.image.url] and imagesAlt to [DATA.image.caption].",
        "The gallery must be full width inside the card so the floor plan is sharp and readable.",
        "ImageGallery opens a lightbox on click so users can inspect the plan at full size.",
        "After the gallery, add DATA.highlightDescription as a TextContent paragraph exactly.",
        "Add a Key insights section with bullets from DATA.keyInsights exactly — keep concise, no extra paragraphs.",
      ],
    });
  },
  buildPresentationSection(): PresentationSection {
    const data = getFloorPlanPromptData();

    return {
      id: "floor-plan",
      title: "Floor 07 — Business Unit Allocation",
      intro: data.intro,
      images: [
        {
          url: data.image.url,
          alt: data.image.caption,
          caption: data.image.caption,
        },
      ],
      bullets: [
        {
          label: "Legend",
          items: [data.highlightDescription],
        },
        {
          label: "Key insights",
          items: data.keyInsights,
        },
      ],
    };
  },
};
