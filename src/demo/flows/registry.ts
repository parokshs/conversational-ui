import { americasOccupancyFlow } from "./definitions/americasOccupancy";
import { buildingFAlignmentFlow } from "./definitions/buildingFAlignment";
import { floorPlanFlow } from "./definitions/floorPlan";
import { retailWorkspaceFlow } from "./definitions/retailWorkspace";
import type { DemoFlowDefinition, DemoResponseJob } from "./types";

export const demoFlows: DemoFlowDefinition[] = [
  americasOccupancyFlow,
  buildingFAlignmentFlow,
  retailWorkspaceFlow,
  floorPlanFlow,
];

/** @deprecated Use demoFlows */
export const stagedFlows = demoFlows;

export function getFlowById(flowId: string): DemoFlowDefinition | undefined {
  return demoFlows.find((flow) => flow.id === flowId);
}

export const demoResponseJobs: DemoResponseJob[] = demoFlows.map((flow) => ({
  file: flow.responseFile,
  buildPrompt: flow.buildChatPrompt,
}));
