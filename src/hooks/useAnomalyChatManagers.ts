"use client";

import type { Message } from "@crayonai/react-core";
import {
  toOpenAIMessages,
  useThreadListManager,
  useThreadManager,
  type ArtifactViewMode,
  type ExportAsPptx,
  type ThinkComponent,
} from "@thesysai/genui-sdk";
import { useEffect } from "react";
import {
  ANOMALY_THREAD_ID,
  anomalyThread,
} from "@/demo/anomaly/anomalyThread";

type OpenAIMessage = {
  id: string;
  role: "user" | "assistant";
  content?: string;
};

const anomalyMessageCache = new Map<string, OpenAIMessage[]>();
const userThreadMessageCache = new Map<string, Message[]>();
let anomalyMessagesPromise: Promise<OpenAIMessage[]> | null = null;

async function loadAnomalyMessages(): Promise<OpenAIMessage[]> {
  const cached = anomalyMessageCache.get(ANOMALY_THREAD_ID);
  if (cached && cached.length > 0) {
    return cached;
  }

  if (!anomalyMessagesPromise) {
    anomalyMessagesPromise = fetch("/api/demo/anomaly-thread")
      .then(async (response) => {
        if (!response.ok) {
          const detail = await response.text().catch(() => "");
          throw new Error(detail || "Failed to load the Anomaly thread.");
        }

        const data = (await response.json()) as { messages: OpenAIMessage[] };
        anomalyMessageCache.set(ANOMALY_THREAD_ID, data.messages);
        return data.messages;
      })
      .finally(() => {
        anomalyMessagesPromise = null;
      });
  }

  return anomalyMessagesPromise;
}

type UseAnomalyChatManagersOptions = {
  apiUrl: string;
  customizeC1?: {
    thinkComponent?: ThinkComponent;
    artifactViewMode?: ArtifactViewMode;
    exportAsPPTX?: ExportAsPptx;
  };
};

export function useAnomalyChatManagers({
  apiUrl,
  customizeC1,
}: UseAnomalyChatManagersOptions) {
  const threadListManager = useThreadListManager({
    fetchThreadList: async () => [anomalyThread],
    deleteThread: async (threadId) => {
      if (threadId === ANOMALY_THREAD_ID) {
        return;
      }

      userThreadMessageCache.delete(threadId);
    },
    updateThread: async (thread) => thread,
    onSwitchToNew: () => {},
    onSelectThread: () => {},
    createThread: async (firstMessage) => ({
      threadId: crypto.randomUUID(),
      title: firstMessage.message ?? "New Chat",
      createdAt: new Date(),
    }),
  });

  const threadManager = useThreadManager({
    threadListManager,
    loadThread: async (threadId) => {
      if (threadId === ANOMALY_THREAD_ID) {
        // useThreadManager from @thesysai/genui-sdk converts OpenAI messages internally.
        return loadAnomalyMessages();
      }

      const cached = userThreadMessageCache.get(threadId);
      return cached ? toOpenAIMessages(cached) : [];
    },
    onUpdateMessage: () => {},
    apiUrl,
    customizeC1,
  });

  useEffect(() => {
    threadListManager.load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const threadId = threadListManager.selectedThreadId;

    if (!threadId || threadId === ANOMALY_THREAD_ID) {
      return;
    }

    if (threadManager.messages.length > 0) {
      userThreadMessageCache.set(threadId, threadManager.messages);
    }
  }, [threadListManager.selectedThreadId, threadManager.messages]);

  return { threadListManager, threadManager };
}
