import type { PresentationSection } from "../presentation/types";

export type DemoFlowDefinition = {
  id: string;
  keywords: string[];
  responseFile: string;
  thinking?: {
    title: string;
    description: string;
  };
  buildChatPrompt: () => string;
  buildPresentationSection: () => PresentationSection;
};

/** @deprecated Use DemoFlowDefinition */
export type StagedFlow = DemoFlowDefinition;

export type DemoResponseJob = {
  file: string;
  buildPrompt: () => string;
};
