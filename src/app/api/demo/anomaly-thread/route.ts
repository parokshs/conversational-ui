import { NextResponse } from "next/server";
import { buildAnomalyServerMessages } from "@/demo/anomaly/buildAnomalySeed";
import {
  ANOMALY_THREAD_ID,
  anomalyThread,
} from "@/demo/anomaly/anomalyThread";
import { getMessageStore } from "@/app/api/chat/messageStore";

function seedServerThreadIfEmpty() {
  const messageStore = getMessageStore(ANOMALY_THREAD_ID);

  if (messageStore.messageList.length > 0) {
    return;
  }

  for (const message of buildAnomalyServerMessages()) {
    messageStore.addMessage(message);
  }
}

export async function GET() {
  try {
    seedServerThreadIfEmpty();

    return NextResponse.json({
      thread: anomalyThread,
      messages: buildAnomalyServerMessages(),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load anomaly thread.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
