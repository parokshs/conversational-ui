import fs from "fs";
import path from "path";
import {
  FULL_DEMO_FLOW_IDS,
  getPresentationCacheKey,
  seedPresentationCache,
} from "../src/demo/presentation/presentationCache";

function parseArgs(argv: string[]) {
  let pptxPath: string | undefined;
  let slidesPath: string | undefined;
  let cacheKey = getPresentationCacheKey([...FULL_DEMO_FLOW_IDS]);
  let title: string | undefined;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === "--pptx" && next) {
      pptxPath = next;
      index += 1;
      continue;
    }

    if (arg === "--slides" && next) {
      slidesPath = next;
      index += 1;
      continue;
    }

    if (arg === "--cache-key" && next) {
      cacheKey = next;
      index += 1;
      continue;
    }

    if (arg === "--title" && next) {
      title = next;
      index += 1;
    }
  }

  return { pptxPath, slidesPath, cacheKey, title };
}

async function main() {
  const { pptxPath, slidesPath, cacheKey, title } = parseArgs(process.argv.slice(2));

  if (!pptxPath) {
    console.error(`Usage: npm run seed:presentation -- --pptx <path-to-edited.pptx> [--slides <path-to.slides.txt>] [--cache-key <key>] [--title "Deck title"]`);
    console.error("");
    console.error("After generating and editing your deck in PowerPoint, run this to lock in the seeded download for demo mode.");
    process.exit(1);
  }

  const resolvedPptx = path.resolve(pptxPath);
  if (!fs.existsSync(resolvedPptx)) {
    throw new Error(`PPTX not found: ${resolvedPptx}`);
  }

  let slidesContent: string | undefined;
  if (slidesPath) {
    const resolvedSlides = path.resolve(slidesPath);
    if (!fs.existsSync(resolvedSlides)) {
      throw new Error(`Slides file not found: ${resolvedSlides}`);
    }
    slidesContent = fs.readFileSync(resolvedSlides, "utf8");
  }

  seedPresentationCache({
    cacheKey,
    flowIds: [...FULL_DEMO_FLOW_IDS],
    pptxBuffer: fs.readFileSync(resolvedPptx),
    slidesContent,
    title,
  });

  console.log(`Seeded presentation cache: ${cacheKey}`);
  console.log(`  PPTX: src/demo/presentation/cache/${cacheKey}.pptx`);
  if (slidesContent) {
    console.log(`  Slides preview: src/demo/presentation/cache/${cacheKey}.slides.txt`);
  }
  console.log("Demo mode will now replay cached slides (if provided) and serve this PPTX on download.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
