"use client";

import type { Message } from "@crayonai/react-core";
import {
  fromOpenAIMessages,
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
  flowId?: string;
};

const threadMessageCache = new Map<string, Message[]>();
let anomalyMessagesPromise: Promise<Message[]> | null = null;

async function loadAnomalyMessages(): Promise<Message[]> {
  if (threadMessageCache.has(ANOMALY_THREAD_ID)) {
    return threadMessageCache.get(ANOMALY_THREAD_ID)!;
  }

  if (!anomalyMessagesPromise) {
    anomalyMessagesPromise = fetch("/api/demo/anomaly-thread")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to load the Anomaly thread.");
        }

        const data = (await response.json()) as { messages: OpenAIMessage[] };
        const messages = fromOpenAIMessages(data.messages);
        threadMessageCache.set(ANOMALY_THREAD_ID, messages);
        return messages;
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

      threadMessageCache.delete(threadId);
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
        return loadAnomalyMessages();
      }

      return threadMessageCache.get(threadId) ?? [];
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
    if (threadListManager.selectedThreadId) {
      threadMessageCache.set(
        threadListManager.selectedThreadId,
        threadManager.messages
      );
    }
  }, [threadListManager.selectedThreadId, threadManager.messages]);

  return { threadListManager, threadManager };
}
