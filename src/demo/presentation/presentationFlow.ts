import OpenAI from "openai";
import { NextResponse } from "next/server";
import { makeC1Response } from "@thesysai/genui-sdk/server";
import {
  buildArtifactSystemPrompt,
  buildArtifactUserPrompt,
} from "./artifactPrompt";
import { buildDemoPresentationBundle } from "./buildBundle";
import { getMatchedFlowIds } from "../../app/api/chat/messageStore";

function createArtifactId() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 10);
}

export function isPresentationExportRequest(question: string) {
  const q = question.toLowerCase();

  return (
    /export\s+(a\s+)?presentation/.test(q) ||
    /create\s+(a\s+)?presentation/.test(q) ||
    /generate\s+(a\s+)?(presentation|slides|deck)/.test(q) ||
    /make\s+(a\s+)?(presentation|slides|deck)/.test(q) ||
    /build\s+(a\s+)?(presentation|slides|deck)/.test(q)
  );
}

function streamHeaders() {
  return {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  };
}

function openArtifactTag(artifactId: string) {
  return `<artifact type="slides" id="${artifactId}" version="1">`;
}

function closeArtifactTag() {
  return "</artifact>";
}

export async function handlePresentationExport({
  question,
  threadId,
  responseId,
  messageStore,
}: {
  question: string;
  threadId: string;
  responseId: string;
  messageStore: ReturnType<
    typeof import("../../app/api/chat/messageStore").getMessageStore
  >;
}) {
  const flowIds = getMatchedFlowIds(messageStore.messageList);
  const bundle = buildDemoPresentationBundle(flowIds);

  if (!bundle) {
    const c1Response = makeC1Response();
    const ready = (async () => {
      await c1Response.writeCustomMarkdown(
        "Ask about portfolio occupancy or building costs first, then request a presentation export."
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

  if (!process.env.THESYS_API_KEY) {
    return NextResponse.json(
      { error: "THESYS_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  const artifactId = createArtifactId();
  const artifactClient = new OpenAI({
    baseURL: "https://api.thesys.dev/v1/artifact",
    apiKey: process.env.THESYS_API_KEY,
  });

  const artifactStream = await artifactClient.chat.completions.create({
    model: "c1/artifact/v-20251030",
    messages: [
      {
        role: "system",
        content: buildArtifactSystemPrompt(),
      },
      {
        role: "user",
        content: buildArtifactUserPrompt({ question, bundle }),
      },
    ],
    metadata: {
      thesys: JSON.stringify({
        c1_artifact_type: "slides",
        id: artifactId,
      }),
    },
    stream: true,
  });

  const c1Response = makeC1Response();
  const ready = (async () => {
    await c1Response.writeContent(openArtifactTag(artifactId));

    for await (const chunk of artifactStream) {
      const content = chunk.choices?.[0]?.delta?.content ?? "";
      if (content) {
        await c1Response.writeContent(content);
      }
    }

    await c1Response.writeContent(closeArtifactTag());
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
