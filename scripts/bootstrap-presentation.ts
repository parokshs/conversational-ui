import fs from "fs";
import path from "path";
import crypto from "node:crypto";
import OpenAI from "openai";
import { demoFlows } from "../src/demo/flows/registry";
import {
  buildArtifactSystemPrompt,
  buildArtifactUserPrompt,
  PRESENTATION_ARTIFACT_MODEL,
} from "../src/demo/presentation/artifactPrompt";
import { buildDemoPresentationBundle } from "../src/demo/presentation/buildBundle";
import {
  readCwpBrowserPreviewGuide,
  readCwpLayoutGuide,
  readCwpReferenceSlideSkill,
  readCwpSkillDoc,
} from "../src/demo/presentation/cwpSkillLoader";
import {
  FULL_DEMO_FLOW_IDS,
  getPresentationCacheKey,
  loadCwpSkillReference,
  loadPresentationManifest,
  savePresentationCache,
} from "../src/demo/presentation/presentationCache";
import { patchPresentationSlides } from "../src/demo/presentation/patchPresentationSlides";

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

function logSkillContext() {
  const skillRef = loadCwpSkillReference();

  console.log(`Skill: ${skillRef.skillPath} (${skillRef.skillName})`);
  console.log(
    skillRef.sampleDeck.exists
      ? `Sample deck: ${skillRef.sampleDeck.relativePath}`
      : `WARNING: Sample deck missing at ${skillRef.sampleDeck.relativePath}`
  );
  console.log(
    skillRef.layoutGuide.exists
      ? `Layout guide: ${skillRef.layoutGuide.relativePath}`
      : `WARNING: Layout guide missing at ${skillRef.layoutGuide.relativePath}`
  );
  console.log(
    skillRef.browserPreviewGuide.exists
      ? `Browser preview: ${skillRef.browserPreviewGuide.relativePath}`
      : `WARNING: Browser preview guide missing`
  );
  console.log(
    skillRef.referenceSlideSkill.exists
      ? `Reference-slide skill: ${skillRef.referenceSlideSkill.relativePath}`
      : `WARNING: Reference-slide skill missing`
  );
  console.log(
    skillRef.baseTemplate.exists
      ? `Base template: ${skillRef.baseTemplate.relativePath}`
      : `WARNING: Base template missing at ${skillRef.baseTemplate.relativePath}`
  );

  if (readCwpSkillDoc()) {
    console.log("Loaded SKILL.md into generation prompts.");
  }
  if (readCwpLayoutGuide()) {
    console.log("Loaded references/analytics-layout-guide.md into generation prompts.");
  }
  if (readCwpBrowserPreviewGuide()) {
    console.log("Loaded references/browser-preview-mapping.md into generation prompts.");
  }
  if (readCwpReferenceSlideSkill()) {
    console.log("Loaded reference-slide-presentations-SKILL.md (PPTX reference).");
  }
}

async function generateSlidesArtifact(
  client: OpenAI,
  artifactId: string,
  bundle: NonNullable<ReturnType<typeof buildDemoPresentationBundle>>
) {
  const stream = await client.chat.completions.create({
    model: PRESENTATION_ARTIFACT_MODEL,
    messages: [
      {
        role: "system",
        content: buildArtifactSystemPrompt(bundle.templateReference),
      },
      {
        role: "user",
        content: buildArtifactUserPrompt({
          question:
            "Prepare a CWP portfolio & building analytics deck. Match .agents/skills/cwp_template/references/analytics-layout-guide.md and browser-preview-mapping.md.",
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

async function main() {
  loadEnvFile();

  if (!process.env.THESYS_API_KEY) {
    throw new Error("THESYS_API_KEY is required to bootstrap presentation cache.");
  }

  logSkillContext();

  const skillReference = loadCwpSkillReference();
  if (!skillReference.sampleDeck.exists) {
    console.warn(
      "Sample analytics deck missing — prompts will use SKILL.md + layout guide text only."
    );
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

  bundle.templateReference = skillReference;

  const cacheKey = getPresentationCacheKey(flowIds);
  const existingManifest = loadPresentationManifest(cacheKey);
  const artifactId = existingManifest?.artifactId ?? createArtifactId();

  const artifactClient = new OpenAI({
    baseURL: "https://api.thesys.dev/v1/artifact",
    apiKey: process.env.THESYS_API_KEY,
  });

  console.log(`Generating CWP analytics preview slides for ${cacheKey}...`);
  const rawSlidesContent = await generateSlidesArtifact(artifactClient, artifactId, bundle);
  const slidesContent = patchPresentationSlides(rawSlidesContent, bundle);
  console.log(`Slides preview ready (${slidesContent.length} chars).`);

  savePresentationCache({
    cacheKey,
    flowIds,
    artifactId,
    title: bundle.title,
    slidesContent,
  });

  const seeded = existingManifest?.seeded === true;
  console.log(`Saved preview cache: src/demo/presentation/cache/${cacheKey}.slides.txt`);
  if (seeded) {
    console.log("Existing seeded PPTX and seeded=true manifest were left unchanged.");
  } else {
    console.log("Seed PPTX download separately (edit from base template):");
    console.log("  npm run seed:presentation -- --pptx <path-to-edited.pptx>");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
