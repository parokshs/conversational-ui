import fs from "fs";
import path from "path";

/** Served from Next.js `public/` — URLs start with `/demo/presentation/slides/` */
export const PRESENTATION_SLIDES_PUBLIC_DIR = "public/demo/presentation/slides";

const NUMBERED_IMAGE_PATTERN = /^(\d+)\.(png|webp|jpe?g)$/i;

export type DiscoveredSlideImage = {
  /** 1-based slide number from filename */
  index: number;
  /** Artifact slide id, e.g. slide-3 */
  id: string;
  fileName: string;
  publicUrl: string;
  absolutePath: string;
};

export function getPresentationSlidesDir() {
  return path.join(process.cwd(), PRESENTATION_SLIDES_PUBLIC_DIR);
}

function toPublicUrl(absolutePath: string) {
  const relative = path
    .relative(path.join(process.cwd(), "public"), absolutePath)
    .split(path.sep)
    .join("/");

  return `/${relative}`;
}

/**
 * Finds numbered slide images in public/demo/presentation/slides/.
 * Expected names: 1.png, 2.png, … (webp/jpg also OK). Sorted numerically.
 * Gaps are OK (e.g. 1.png + 3.png → two slides). Extra/missing numbers are fine.
 */
export function discoverPresentationSlideImages(): DiscoveredSlideImage[] {
  const dir = getPresentationSlidesDir();
  if (!fs.existsSync(dir)) {
    return [];
  }

  const discovered: DiscoveredSlideImage[] = [];

  for (const entry of fs.readdirSync(dir)) {
    const match = entry.match(NUMBERED_IMAGE_PATTERN);
    if (!match) {
      continue;
    }

    const index = Number.parseInt(match[1], 10);
    if (!Number.isFinite(index) || index < 1) {
      continue;
    }

    const absolutePath = path.join(dir, entry);
    if (!fs.statSync(absolutePath).isFile()) {
      continue;
    }

    discovered.push({
      index,
      id: `slide-${index}`,
      fileName: entry,
      publicUrl: toPublicUrl(absolutePath),
      absolutePath,
    });
  }

  return discovered.sort((a, b) => a.index - b.index);
}

export function hasPresentationSlideImages() {
  return discoverPresentationSlideImages().length > 0;
}

/** @deprecated Use discoverPresentationSlideImages() */
export function listPresentationSlideImageStatus() {
  return discoverPresentationSlideImages().map((slide) => ({
    id: slide.id,
    fileName: slide.fileName,
    label: `Slide ${slide.index}`,
    publicUrl: slide.publicUrl,
    exists: true,
  }));
}

/** @deprecated Use hasPresentationSlideImages() */
export function allPresentationSlideImagesExist() {
  return hasPresentationSlideImages();
}

/** @deprecated No fixed manifest — discovery is dynamic */
export function missingPresentationSlideImages() {
  return [];
}
