import type { DemoFlowDefinition } from "./types";

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

export function matchStagedFlow(
  prompt: string,
  flows: DemoFlowDefinition[]
): DemoFlowDefinition | null {
  const normalizedPrompt = normalizePrompt(prompt);
  if (!normalizedPrompt) {
    return null;
  }

  let bestFlow: DemoFlowDefinition | null = null;
  let bestScore = 0;

  for (const flow of flows) {
    const score = scoreFlow(normalizedPrompt, flow);
    if (score > bestScore) {
      bestScore = score;
      bestFlow = flow;
    }
  }

  return bestScore >= 2 ? bestFlow : null;
}
