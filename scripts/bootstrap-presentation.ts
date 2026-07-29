import fs from "fs";
import path from "path";
import crypto from "node:crypto";
import { demoFlows } from "../src/demo/flows/registry";
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
import { buildImageSlidesArtifact } from "../src/demo/presentation/buildImageSlidesArtifact";
import {
  discoverPresentationSlideImages,
  hasPresentationSlideImages,
} from "../src/demo/presentation/slideImages";

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
    skillRef.layoutGuide.exists
      ? `Layout guide: ${skillRef.layoutGuide.relativePath}`
      : `WARNING: Layout guide missing at ${skillRef.layoutGuide.relativePath}`
  );
  console.log(
    skillRef.browserPreviewGuide.exists
      ? `Browser preview: ${skillRef.browserPreviewGuide.relativePath}`
      : `WARNING: Browser preview guide missing`
  );

  if (readCwpSkillDoc()) {
    console.log("Loaded SKILL.md into generation prompts.");
  }
  if (readCwpLayoutGuide()) {
    console.log("Loaded references/analytics-layout-guide.md.");
  }
  if (readCwpBrowserPreviewGuide()) {
    console.log("Loaded references/browser-preview-mapping.md.");
  }
  if (readCwpReferenceSlideSkill()) {
    console.log("Loaded reference-slide-presentations-SKILL.md (PPTX reference).");
  }
}

async function main() {
  loadEnvFile();

  const flowIds = [...FULL_DEMO_FLOW_IDS];
  const registeredFlowIds = new Set(demoFlows.map((flow) => flow.id));
  const missingFlows = flowIds.filter((flowId) => !registeredFlowIds.has(flowId));

  if (missingFlows.length > 0) {
    throw new Error(`Missing demo flow definitions for: ${missingFlows.join(", ")}`);
  }

  const bundle = buildDemoPresentationBundle(flowIds);
  if (!bundle) {
    throw new Error("Failed to build presentation bundle for full demo.");
  }

  if (!hasPresentationSlideImages()) {
    throw new Error(
      "No numbered slide images found in public/demo/presentation/slides/.\n" +
        "Add files named 1.png, 2.png, 3.png, … then re-run bootstrap:presentation."
    );
  }

  logSkillContext();

  const skillReference = loadCwpSkillReference();
  bundle.templateReference = skillReference;

  const cacheKey = getPresentationCacheKey(flowIds);
  const existingManifest = loadPresentationManifest(cacheKey);
  const artifactId = existingManifest?.artifactId ?? createArtifactId();

  const slides = discoverPresentationSlideImages();
  console.log(`Building image preview (${slides.length} slide(s)) for ${cacheKey}…`);
  for (const slide of slides) {
    console.log(`  ${slide.index}. ${slide.fileName} → ${slide.publicUrl}`);
  }

  const slidesContent = buildImageSlidesArtifact({
    artifactId,
    presentationTitle: bundle.title,
  });

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
    console.log("Image-based preview cache ready.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
