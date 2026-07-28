import fs from "fs";
import path from "path";
import crypto from "node:crypto";
import OpenAI from "openai";
import { demoFlows } from "../src/demo/flows/registry";
import { buildArtifactSystemPrompt, buildArtifactUserPrompt, PRESENTATION_ARTIFACT_MODEL } from "../src/demo/presentation/artifactPrompt";
import { buildDemoPresentationBundle } from "../src/demo/presentation/buildBundle";
import {
  FULL_DEMO_FLOW_IDS,
  getPresentationCacheKey,
  savePresentationCache,
} from "../src/demo/presentation/presentationCache";

function loadEnvFile() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    return;
  }

  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function createArtifactId() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 10);
}

function buildExportParams({
  artifactId,
  slidesContent,
}: {
  artifactId: string;
  slidesContent: string;
}) {
  const c1Response = `<artifact type="slides" id="${artifactId}" version="1">${slidesContent}</artifact>`;

  return JSON.stringify({
    type: "slides",
    artifactId,
    c1Response,
    themeMode: "light",
  });
}

async function generateSlidesArtifact(
  client: OpenAI,
  artifactId: string,
  bundle: NonNullable<ReturnType<typeof buildDemoPresentationBundle>>
) {
  const stream = await client.chat.completions.create({
    model: PRESENTATION_ARTIFACT_MODEL,
    messages: [
      { role: "system", content: buildArtifactSystemPrompt() },
      {
        role: "user",
        content: buildArtifactUserPrompt({
          question: "Prepare an executive presentation from the portfolio analytics.",
          bundle,
        }),
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

  let slidesContent = "";
  for await (const chunk of stream) {
    slidesContent += chunk.choices?.[0]?.delta?.content ?? "";
  }

  return slidesContent;
}

async function exportPptx(apiKey: string, exportParams: string) {
  const response = await fetch("https://api.thesys.dev/v1/artifact/pptx/export", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ exportParams }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`PPTX export failed (${response.status}): ${detail}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function main() {
  loadEnvFile();

  if (!process.env.THESYS_API_KEY) {
    throw new Error("THESYS_API_KEY is required to bootstrap presentation cache.");
  }

  const flowIds = [...FULL_DEMO_FLOW_IDS];
  const registeredFlowIds = new Set(demoFlows.map((flow) => flow.id));
  const missing = flowIds.filter((flowId) => !registeredFlowIds.has(flowId));

  if (missing.length > 0) {
    throw new Error(`Missing demo flow definitions for: ${missing.join(", ")}`);
  }

  const bundle = buildDemoPresentationBundle(flowIds);
  if (!bundle) {
    throw new Error("Failed to build presentation bundle for full demo.");
  }

  const cacheKey = getPresentationCacheKey(flowIds);
  const artifactId = createArtifactId();

  const artifactClient = new OpenAI({
    baseURL: "https://api.thesys.dev/v1/artifact",
    apiKey: process.env.THESYS_API_KEY,
  });

  console.log(`Generating CWP-styled slides artifact for ${cacheKey}...`);
  const slidesContent = await generateSlidesArtifact(artifactClient, artifactId, bundle);
  console.log(`Slides artifact ready (${slidesContent.length} chars).`);

  let pptxBuffer: Buffer | undefined;
  try {
    console.log("Exporting PPTX via Thesys (optional draft for editing)...");
    const exportParams = buildExportParams({ artifactId, slidesContent });
    pptxBuffer = await exportPptx(process.env.THESYS_API_KEY, exportParams);
    console.log(`PPTX exported (${pptxBuffer.length} bytes) — not seeded until you run seed:presentation.`);
  } catch (error) {
    console.warn(
      "Thesys PPTX export failed — slides cache saved without PPTX.",
      error instanceof Error ? error.message : error
    );
    console.log(
      "Generate in the app, download, edit in PowerPoint, then run:",
      "npm run seed:presentation -- --pptx <path-to-edited.pptx>"
    );
  }

  savePresentationCache({
    cacheKey,
    flowIds,
    artifactId,
    title: bundle.title,
    slidesContent,
    pptxBuffer,
  });

  console.log(`Saved draft cache (seeded=false) under src/demo/presentation/cache/${cacheKey}.*`);
  console.log("Demo mode still generates live until you seed an edited deck.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
