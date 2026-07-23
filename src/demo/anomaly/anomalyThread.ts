export const ANOMALY_THREAD_ID = "demo-anomaly-thread";

export type AnomalySeedTurn = {
  userPrompt: string;
  responseFile: string;
  flowId: string;
  userMessageId: string;
  assistantMessageId: string;
};

export const anomalyThread = {
  threadId: ANOMALY_THREAD_ID,
  title: "Anomaly",
  createdAt: new Date("2026-07-20T09:00:00.000Z"),
};

export const anomalySeedTurns: AnomalySeedTurn[] = [
  {
    userPrompt:
      "Show me the building-level occupancy metrics for the Americas region.",
    responseFile: "americasOccupancy.c1.txt",
    flowId: "americas-occupancy",
    userMessageId: "anomaly-user-1",
    assistantMessageId: "anomaly-assistant-1",
  },
  {
    userPrompt:
      "Show the Vacant vs Allocated costs for Jefferson House by Business Unit and analyse the results",
    responseFile: "jeffersonCosts.c1.txt",
    flowId: "jefferson-costs",
    userMessageId: "anomaly-user-2",
    assistantMessageId: "anomaly-assistant-2",
  },
  {
    userPrompt:
      "Review the workspace allocation for Engineering by floor and seat type",
    responseFile: "engineeringWorkspace.c1.txt",
    flowId: "engineering-workspace",
    userMessageId: "anomaly-user-3",
    assistantMessageId: "anomaly-assistant-3",
  },
];
