import fs from "fs";
import path from "path";

export {
  getCwpTemplatePath,
  loadCwpSkillReference,
  loadCwpSkillReference as loadCwpTemplateReference,
} from "./cwpSkillLoader";

const cacheDir = path.join(process.cwd(), "src/demo/presentation/cache");

export const FULL_DEMO_FLOW_IDS = [
  "americas-occupancy",
  "building-f-alignment",
  "retail-workspace",
  "floor-plan",
] as const;

export function getPresentationCacheKey(flowIds: string[]): string {
  return [...new Set(flowIds)].sort().join("--") || "empty";
}

function slidesPath(cacheKey: string) {
  return path.join(cacheDir, `${cacheKey}.slides.txt`);
}

function pptxPath(cacheKey: string) {
  return path.join(cacheDir, `${cacheKey}.pptx`);
}

function manifestPath(cacheKey: string) {
  return path.join(cacheDir, `${cacheKey}.json`);
}

export type PresentationCacheManifest = {
  cacheKey: string;
  flowIds: string[];
  artifactId: string;
  title: string;
  generatedAt: string;
  /** When true, demo mode replays cached slides and serves the seeded PPTX download. */
  seeded?: boolean;
};

export function isSeededPresentation(cacheKey: string): boolean {
  const manifest = loadPresentationManifest(cacheKey);
  return manifest?.seeded === true;
}

export function loadCachedSlides(cacheKey: string): string | null {
  const filePath = slidesPath(cacheKey);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return fs.readFileSync(filePath, "utf8");
}

export function loadCachedPptx(cacheKey: string): Buffer | null {
  const filePath = pptxPath(cacheKey);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return fs.readFileSync(filePath);
}

export function loadPresentationManifest(
  cacheKey: string
): PresentationCacheManifest | null {
  const filePath = manifestPath(cacheKey);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8")) as PresentationCacheManifest;
}

export function savePresentationCache({
  cacheKey,
  flowIds,
  artifactId,
  title,
  slidesContent,
  pptxBuffer,
  seeded,
}: {
  cacheKey: string;
  flowIds: string[];
  artifactId: string;
  title: string;
  slidesContent: string;
  pptxBuffer?: Buffer;
  seeded?: boolean;
}) {
  fs.mkdirSync(cacheDir, { recursive: true });
  fs.writeFileSync(slidesPath(cacheKey), slidesContent, "utf8");

  if (pptxBuffer) {
    fs.writeFileSync(pptxPath(cacheKey), pptxBuffer);
  }

  const existing = loadPresentationManifest(cacheKey);
  const manifest: PresentationCacheManifest = {
    cacheKey,
    flowIds,
    artifactId,
    title,
    generatedAt: new Date().toISOString(),
    seeded: seeded ?? existing?.seeded ?? false,
  };

  fs.writeFileSync(manifestPath(cacheKey), JSON.stringify(manifest, null, 2), "utf8");
}

export function seedPresentationCache({
  cacheKey,
  flowIds,
  pptxBuffer,
  slidesContent,
  title,
}: {
  cacheKey: string;
  flowIds: string[];
  pptxBuffer: Buffer;
  slidesContent?: string;
  title?: string;
}) {
  fs.mkdirSync(cacheDir, { recursive: true });
  fs.writeFileSync(pptxPath(cacheKey), pptxBuffer);

  if (slidesContent) {
    fs.writeFileSync(slidesPath(cacheKey), slidesContent, "utf8");
  }

  const existing = loadPresentationManifest(cacheKey);
  const manifest: PresentationCacheManifest = {
    cacheKey,
    flowIds,
    artifactId: existing?.artifactId ?? "seeded",
    title: title ?? existing?.title ?? "Portfolio & Building Analytics",
    generatedAt: new Date().toISOString(),
    seeded: true,
  };

  fs.writeFileSync(manifestPath(cacheKey), JSON.stringify(manifest, null, 2), "utf8");
}

function resolveSeededCacheKey(flowIds: string[]): string | null {
  const cacheKey = getPresentationCacheKey(flowIds);
  if (loadCachedSlides(cacheKey) && isSeededPresentation(cacheKey)) {
    return cacheKey;
  }

  const fullKey = getPresentationCacheKey([...FULL_DEMO_FLOW_IDS]);
  if (loadCachedSlides(fullKey) && isSeededPresentation(fullKey)) {
    return fullKey;
  }

  return null;
}

export function resolvePresentationCacheKey(flowIds: string[]): string | null {
  return resolveSeededCacheKey(flowIds);
}

export function resolveCachedPptx(flowIds: string[]): {
  buffer: Buffer;
  cacheKey: string;
  title: string;
} | null {
  const exactKey = getPresentationCacheKey(flowIds);
  const exactPptx = loadCachedPptx(exactKey);
  if (exactPptx && isSeededPresentation(exactKey)) {
    const manifest = loadPresentationManifest(exactKey);
    return {
      buffer: exactPptx,
      cacheKey: exactKey,
      title: manifest?.title ?? "presentation",
    };
  }

  const fullKey = getPresentationCacheKey([...FULL_DEMO_FLOW_IDS]);
  const fullPptx = loadCachedPptx(fullKey);
  if (fullPptx && isSeededPresentation(fullKey)) {
    const manifest = loadPresentationManifest(fullKey);
    return {
      buffer: fullPptx,
      cacheKey: fullKey,
      title: manifest?.title ?? "presentation",
    };
  }

  return null;
}
