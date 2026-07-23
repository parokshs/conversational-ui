import OpenAI from "openai";

export type DBMessage = OpenAI.Chat.ChatCompletionMessageParam & {
  id?: string;
  flowId?: string;
};

const messagesStore: {
  [threadId: string]: DBMessage[];
} = {};

export const getMessageStore = (id: string) => {
  if (!messagesStore[id]) {
    messagesStore[id] = [];
  }
  const messageList = messagesStore[id];
  return {
    addMessage: (message: DBMessage) => {
      messageList.push(message);
    },
    messageList,
    getOpenAICompatibleMessageList: () => {
      return messageList.map((m) => {
        const message = {
          ...m,
        };

        delete message.id;
        delete message.flowId;

        return message;
      });
    },
  };
};

export function getMatchedFlowIds(messages: DBMessage[]): string[] {
  const flowIds: string[] = [];

  for (const message of messages) {
    if (message.role !== "assistant" || !message.flowId) {
      continue;
    }

    if (!flowIds.includes(message.flowId)) {
      flowIds.push(message.flowId);
    }
  }

  return flowIds;
}
