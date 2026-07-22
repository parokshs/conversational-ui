import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { transformStream } from "@crayonai/stream";
import { makeC1Response } from "@thesysai/genui-sdk/server";
import { DBMessage, getMessageStore } from "./messageStore";
import { startStagedResponse, isDemoModeEnabled } from "../../../demo/flows/buildStagedResponse";
import { matchStagedFlow } from "../../../demo/flows/matchPrompt";
import { stagedFlows } from "../../../demo/flows/registry";

function getPromptText(prompt: DBMessage): string {
  if (typeof prompt.content === "string") {
    return prompt.content;
  }

  if (Array.isArray(prompt.content)) {
    return prompt.content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }

        if ("text" in part && typeof part.text === "string") {
          return part.text;
        }

        return "";
      })
      .join(" ")
      .trim();
  }

  return "";
}

function streamHeaders() {
  return {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  };
}

async function handleStagedResponse(
  flow: NonNullable<ReturnType<typeof matchStagedFlow>>,
  responseId: string,
  messageStore: ReturnType<typeof getMessageStore>
) {
  const { c1Response, ready } = startStagedResponse(flow);

  void ready.then(() => {
    messageStore.addMessage({
      role: "assistant",
      content: c1Response.getAssistantMessage().content,
      id: responseId,
    });
  });

  return new NextResponse(c1Response.responseStream, {
    headers: streamHeaders(),
  });
}

export async function POST(req: NextRequest) {
  const { prompt, threadId, responseId } = (await req.json()) as {
    prompt: DBMessage;
    threadId: string;
    responseId: string;
  };

  const messageStore = getMessageStore(threadId);
  messageStore.addMessage(prompt);

  if (isDemoModeEnabled()) {
    const matchedFlow = matchStagedFlow(getPromptText(prompt), stagedFlows);
    if (matchedFlow) {
      return handleStagedResponse(matchedFlow, responseId, messageStore);
    }
  }

  const client = new OpenAI({
    baseURL: "https://api.thesys.dev/v1/embed/",
    apiKey: process.env.THESYS_API_KEY,
  });

  const c1Response = makeC1Response();

  const llmStream = await client.chat.completions.create({
    model: "c1/openai/gpt-5/v-20251130",
    messages: messageStore.getOpenAICompatibleMessageList(),
    stream: true,
  });

  transformStream(
    llmStream,
    (chunk) => {
      const contentDelta = chunk.choices?.[0]?.delta?.content ?? "";
      if (contentDelta) {
        void c1Response.writeContent(contentDelta);
      }
      return contentDelta;
    },
    {
      onEnd: ({ accumulated }) => {
        void c1Response.end();
        const message = accumulated.filter(Boolean).join("");
        messageStore.addMessage({
          role: "assistant",
          content: message,
          id: responseId,
        });
      },
    }
  );

  return new NextResponse(c1Response.responseStream, {
    headers: streamHeaders(),
  });
}
