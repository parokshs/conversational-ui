import OpenAI from "openai";
import { NextResponse } from "next/server";
import { makeC1Response } from "@thesysai/genui-sdk/server";
import {
  buildArtifactSystemPrompt,
  buildArtifactUserPrompt,
  PRESENTATION_ARTIFACT_MODEL,
} from "./artifactPrompt";
import { buildFullDemoPresentationBundle, getPresentationFlowIds } from "./buildBundle";
import { patchPresentationSlides } from "./patchPresentationSlides";
import { buildSimpleTextCard } from "../format/buildSimpleTextCard";
import { getMatchedFlowIds } from "../../app/api/chat/messageStore";
import { logDemoRouting } from "../logDemoRouting";
import { waitForPresentationDemoLatency, waitForPresentationSlideLatency } from "../demoLatency";
import {
  loadCachedSlides,
  loadPresentationManifest,
  resolvePresentationCacheKey,
} from "./presentationCache";
import { streamSlidesArtifactIncrementally } from "./streamSlidesArtifact";
import { isDemoModeEnabled } from "../flows/buildStagedResponse";

const presentationExportPatterns: Array<{ name: string; pattern: RegExp }> = [
  { name: "export_presentation", pattern: /export\s+(a\s+)?presentation/ },
  { name: "export_as_presentation_or_pptx", pattern: /export\s+(as\s+)?(a\s+)?(presentation|pptx?)/ },
  { name: "create_presentation_or_pptx", pattern: /create\s+(a\s+)?(presentation|pptx?)/ },
  { name: "generate_presentation_or_pptx", pattern: /generate\s+(a\s+)?(presentation|slides|deck|pptx?)/ },
  { name: "make_presentation_or_pptx", pattern: /make\s+(a\s+)?(presentation|slides|deck|pptx?)/ },
  { name: "build_presentation_or_pptx", pattern: /build\s+(a\s+)?(presentation|slides|deck|pptx?)/ },
  { name: "prepare_presentation_or_pptx", pattern: /prepare\s+(a\s+)?(presentation|pptx?)/ },
  { name: "presentation_for_executives", pattern: /presentation\s+.*executives/ },
  { name: "share_with_executives", pattern: /share\s+with\s+(the\s+)?executives/ },
  { name: "as_pptx", pattern: /\bas\s+pptx?\b/ },
];

function createArtifactId() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 10);
}

export function evaluatePresentationExportRequest(question: string) {
  const normalizedQuestion = question.toLowerCase();
  const matchedPatterns = presentationExportPatterns
    .filter(({ pattern }) => pattern.test(normalizedQuestion))
    .map(({ name }) => name);

  return {
    rawQuestion: question,
    normalizedQuestion,
    matched: matchedPatterns.length > 0,
    matchedPatterns,
  };
}

export function isPresentationExportRequest(question: string) {
  return evaluatePresentationExportRequest(question).matched;
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

async function streamCachedPresentation({
  question,
  responseId,
  messageStore,
  flowIds,
  cacheKey,
}: {
  question: string;
  responseId: string;
  messageStore: ReturnType<
    typeof import("../../app/api/chat/messageStore").getMessageStore
  >;
  flowIds: string[];
  cacheKey: string;
}) {
  const slidesContent = loadCachedSlides(cacheKey);
  const manifest = loadPresentationManifest(cacheKey);

  if (!slidesContent) {
    return null;
  }

  const bundle = buildFullDemoPresentationBundle();
  const isImagePreview = slidesContent.includes('&quot;template&quot;: &quot;Image&quot;');
  const patchedSlidesContent =
    bundle != null && !isImagePreview
      ? patchPresentationSlides(slidesContent, bundle)
      : slidesContent;

  const artifactId = manifest?.artifactId ?? createArtifactId();
  const c1Response = makeC1Response();

  const ready = (async () => {
    await c1Response.writeThinkItem({
      title: "Preparing executive presentation",
      description: "Assembling CWP-branded slides from portfolio analytics.",
      ephemeral: true,
    });

    await waitForPresentationDemoLatency();

    await streamSlidesArtifactIncrementally(c1Response, patchedSlidesContent, {
      waitBeforeEachSlide: waitForPresentationSlideLatency,
    });
    await c1Response.end();
  })();

  void ready.then(() => {
    messageStore.addMessage({
      role: "assistant",
      content: c1Response.getAssistantMessage().content,
      id: responseId,
    });
  });

  logDemoRouting("presentation_export", {
    question,
    matchedFlowIds: flowIds,
    cacheKey,
    outcome: "cached_artifact_stream",
    artifactId,
  });

  return new NextResponse(c1Response.responseStream, {
    headers: streamHeaders(),
  });
}

async function streamLivePresentation({
  question,
  responseId,
  messageStore,
  flowIds,
  bundle,
}: {
  question: string;
  responseId: string;
  messageStore: ReturnType<
    typeof import("../../app/api/chat/messageStore").getMessageStore
  >;
  flowIds: string[];
  bundle: NonNullable<ReturnType<typeof buildFullDemoPresentationBundle>>;
}) {
  const artifactId = createArtifactId();
  const artifactClient = new OpenAI({
    baseURL: "https://api.thesys.dev/v1/artifact",
    apiKey: process.env.THESYS_API_KEY,
  });

  const artifactStream = await artifactClient.chat.completions.create({
    model: PRESENTATION_ARTIFACT_MODEL,
    messages: [
      {
        role: "system",
        content: buildArtifactSystemPrompt(bundle.templateReference),
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
    await c1Response.writeThinkItem({
      title: "Preparing executive presentation",
      description: "Compiling portfolio analytics into CWP slide format.",
      ephemeral: true,
    });

    await waitForPresentationDemoLatency();

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

  logDemoRouting("presentation_export", {
    question,
    matchedFlowIds: flowIds,
    sectionCount: bundle.sections.length,
    outcome: "live_artifact_stream",
    artifactId,
  });

  return new NextResponse(c1Response.responseStream, {
    headers: streamHeaders(),
  });
}

export async function handlePresentationExport({
  question,
  responseId,
  messageStore,
}: {
  question: string;
  responseId: string;
  messageStore: ReturnType<
    typeof import("../../app/api/chat/messageStore").getMessageStore
  >;
}) {
  const threadFlowIds = getMatchedFlowIds(messageStore.messageList);
  const presentationFlowIds = getPresentationFlowIds();
  const bundle = buildFullDemoPresentationBundle();

  if (!bundle) {
    logDemoRouting("presentation_export", {
      question,
      threadFlowIds,
      presentationFlowIds,
      sectionCount: 0,
      outcome: "bundle_unavailable",
    });

    const c1Response = makeC1Response();
    const ready = (async () => {
      await c1Response.writeContent(
        buildSimpleTextCard(
          "Presentation export is unavailable — demo flow configuration is missing."
        )
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

  if (isDemoModeEnabled()) {
    const cacheKey = resolvePresentationCacheKey(presentationFlowIds);
    if (cacheKey) {
      const cachedResponse = await streamCachedPresentation({
        question,
        responseId,
        messageStore,
        flowIds: presentationFlowIds,
        cacheKey,
      });

      if (cachedResponse) {
        return cachedResponse;
      }
    }
  }

  if (!process.env.THESYS_API_KEY) {
    return NextResponse.json(
      { error: "THESYS_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  logDemoRouting("presentation_export", {
    question,
    threadFlowIds,
    presentationFlowIds,
    sectionCount: bundle.sections.length,
    outcome: "using_full_demo_deck",
  });

  return streamLivePresentation({
    question,
    responseId,
    messageStore,
    flowIds: presentationFlowIds,
    bundle,
  });
}
