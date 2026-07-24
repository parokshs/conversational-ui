import type { DemoFlowDefinition } from "./types";

export const STAGED_FLOW_MATCH_THRESHOLD = 2;

export type StagedFlowScore = {
  flowId: string;
  score: number;
};

export type StagedFlowMatchEvaluation = {
  rawPrompt: string;
  normalizedPrompt: string;
  threshold: number;
  flowScores: StagedFlowScore[];
  matchedFlow: DemoFlowDefinition | null;
  reason: string;
};

function normalizePrompt(prompt: string): string {
  return prompt
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreFlow(normalizedPrompt: string, flow: DemoFlowDefinition): number {
  const words = normalizedPrompt.split(" ").filter(Boolean);
  if (words.length === 0) {
    return 0;
  }

  let score = 0;
  for (const keyword of flow.keywords) {
    const normalizedKeyword = normalizePrompt(keyword);
    if (normalizedPrompt.includes(normalizedKeyword)) {
      score += normalizedKeyword.split(" ").length * 2;
      continue;
    }

    const keywordWords = normalizedKeyword.split(" ").filter(Boolean);
    const partialMatches = keywordWords.filter((word) =>
      words.some((promptWord) => promptWord.includes(word) || word.includes(promptWord))
    ).length;

    if (partialMatches > 0) {
      score += partialMatches;
    }
  }

  return score;
}

function describeMatchReason(
  normalizedPrompt: string,
  bestScore: number,
  bestFlow: DemoFlowDefinition | null
): string {
  if (!normalizedPrompt) {
    return "Prompt was empty after normalization.";
  }

  if (!bestFlow) {
    return "No flow received a score above zero.";
  }

  if (bestScore < STAGED_FLOW_MATCH_THRESHOLD) {
    return `Best flow "${bestFlow.id}" scored ${bestScore}, below threshold ${STAGED_FLOW_MATCH_THRESHOLD}.`;
  }

  return `Matched flow "${bestFlow.id}" with score ${bestScore} (threshold ${STAGED_FLOW_MATCH_THRESHOLD}).`;
}

export function evaluateStagedFlowMatch(
  prompt: string,
  flows: DemoFlowDefinition[]
): StagedFlowMatchEvaluation {
  const normalizedPrompt = normalizePrompt(prompt);
  const flowScores = flows
    .map((flow) => ({
      flowId: flow.id,
      score: scoreFlow(normalizedPrompt, flow),
    }))
    .sort((a, b) => b.score - a.score);

  const bestScore = flowScores[0]?.score ?? 0;
  const bestFlowId = flowScores[0]?.flowId;
  const bestFlow =
    bestScore >= STAGED_FLOW_MATCH_THRESHOLD
      ? flows.find((flow) => flow.id === bestFlowId) ?? null
      : null;

  return {
    rawPrompt: prompt,
    normalizedPrompt,
    threshold: STAGED_FLOW_MATCH_THRESHOLD,
    flowScores,
    matchedFlow: bestFlow,
    reason: describeMatchReason(normalizedPrompt, bestScore, bestFlow),
  };
}

export function matchStagedFlow(
  prompt: string,
  flows: DemoFlowDefinition[]
): DemoFlowDefinition | null {
  return evaluateStagedFlowMatch(prompt, flows).matchedFlow;
}
