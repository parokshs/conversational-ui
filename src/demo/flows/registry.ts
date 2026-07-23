import { americasOccupancyFlow } from "./definitions/americasOccupancy";
import { jeffersonCostsFlow } from "./definitions/jeffersonCosts";
import type { DemoFlowDefinition, DemoResponseJob } from "./types";

export const demoFlows: DemoFlowDefinition[] = [
  americasOccupancyFlow,
  jeffersonCostsFlow,
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
