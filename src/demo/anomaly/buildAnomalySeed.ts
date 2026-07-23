import fs from "fs";
import path from "path";
import type { DBMessage } from "@/app/api/chat/messageStore";
import { anomalySeedTurns } from "./anomalyThread";

const responsesDir = path.join(process.cwd(), "src/demo/responses");

function loadResponseContent(responseFile: string): string {
  const filePath = path.join(responsesDir, responseFile);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing anomaly seed response file: ${responseFile}`);
  }

  return fs.readFileSync(filePath, "utf8");
}

export function buildAnomalyServerMessages(): DBMessage[] {
  const messages: DBMessage[] = [];

  for (const turn of anomalySeedTurns) {
    messages.push({
      id: turn.userMessageId,
      role: "user",
      content: turn.userPrompt,
    });

    messages.push({
      id: turn.assistantMessageId,
      role: "assistant",
      content: loadResponseContent(turn.responseFile),
    });
  }

  return messages;
}
