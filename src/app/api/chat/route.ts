import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { transformStream } from "@crayonai/stream";
import { makeC1Response } from "@thesysai/genui-sdk/server";
import { DBMessage, getMessageStore } from "./messageStore";
import { startStagedResponse, isDemoModeEnabled } from "../../../demo/flows/buildStagedResponse";
import { evaluateStagedFlowMatch } from "../../../demo/flows/matchPrompt";
import { demoFlows } from "../../../demo/flows/registry";
import {
  evaluatePresentationExportRequest,
  handlePresentationExport,
} from "../../../demo/presentation/presentationFlow";
import { buildSimpleTextCard } from "../../../demo/format/buildSimpleTextCard";
import { logDemoRouting } from "../../../demo/logDemoRouting";

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
  flow: NonNullable<ReturnType<typeof evaluateStagedFlowMatch>["matchedFlow"]>,
  responseId: string,
  messageStore: ReturnType<typeof getMessageStore>
) {
  const { c1Response, ready } = startStagedResponse(flow);

  void ready.then(() => {
    messageStore.addMessage({
      role: "assistant",
      content: c1Response.getAssistantMessage().content,
      id: responseId,
      flowId: flow.id,
    });
  });

  return new NextResponse(c1Response.responseStream, {
    headers: streamHeaders(),
  });
}

async function handleUnmatchedDemoPrompt(
  responseId: string,
  messageStore: ReturnType<typeof getMessageStore>
) {
  const c1Response = makeC1Response();
  const ready = (async () => {
    await c1Response.writeContent(
      buildSimpleTextCard("Sorry, I couldn't process that. Please try again.")
    );
    await c1Response.end();
  })();

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
  const userQuestion = getPromptText(prompt);

  logDemoRouting("chat_request", {
    threadId,
    responseId,
    demoMode: isDemoModeEnabled(),
    userQuestion,
  });

  if (isDemoModeEnabled()) {
    const presentationMatch = evaluatePresentationExportRequest(userQuestion);

    logDemoRouting("presentation_export_check", {
      threadId,
      userQuestion,
      matched: presentationMatch.matched,
      matchedPatterns: presentationMatch.matchedPatterns,
    });

    if (presentationMatch.matched) {
      return handlePresentationExport({
        question: userQuestion,
        responseId,
        messageStore,
      });
    }

    const stagedMatch = evaluateStagedFlowMatch(userQuestion, demoFlows);

    logDemoRouting("staged_flow_match", {
      threadId,
      userQuestion,
      normalizedPrompt: stagedMatch.normalizedPrompt,
      threshold: stagedMatch.threshold,
      flowScores: stagedMatch.flowScores,
      matchedFlowId: stagedMatch.matchedFlow?.id ?? null,
      responseFile: stagedMatch.matchedFlow?.responseFile ?? null,
      reason: stagedMatch.reason,
      outcome: stagedMatch.matchedFlow ? "staged_response" : "unmatched_prompt",
    });

    if (stagedMatch.matchedFlow) {
      return handleStagedResponse(stagedMatch.matchedFlow, responseId, messageStore);
    }

    return handleUnmatchedDemoPrompt(responseId, messageStore);
  }

  logDemoRouting("live_llm_fallback", {
    threadId,
    userQuestion,
    reason: "DEMO_MODE is disabled.",
  });

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
