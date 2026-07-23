import { anomalyUserPrompt } from "../data/anomalyFindings";
import { anomalyResponseFile } from "./buildAnomalyChatPrompt";

export const ANOMALY_THREAD_ID = "demo-anomaly-thread";

export type AnomalySeedTurn = {
  userPrompt: string;
  responseFile: string;
  userMessageId: string;
  assistantMessageId: string;
};

export const anomalyThread = {
  threadId: ANOMALY_THREAD_ID,
  title: "Proactive Insights",
  createdAt: new Date("2026-07-20T09:00:00.000Z"),
};

export const anomalySeedTurns: AnomalySeedTurn[] = [
  {
    userPrompt: anomalyUserPrompt,
    responseFile: anomalyResponseFile,
    userMessageId: "anomaly-user-1",
    assistantMessageId: "anomaly-assistant-1",
  },
];
