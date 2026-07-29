import type { DemoPresentationBundle } from "./types";

type SlidePatch = {
  slideId: string;
  title?: string;
  body?: string;
  chartHorizontal?: boolean;
  categoryAxisLabel?: string;
  valueAxisLabel?: string;
};

function encodeForCache(value: string) {
  return value.replace(/&/g, "&amp;").replace(/'/g, "&#39;");
}

function encodeBodyForCache(body: string) {
  return encodeForCache(body).replace(/\n/g, "\\n");
}

function collectSlidePatches(bundle: DemoPresentationBundle): Map<string, SlidePatch> {
  const patches = new Map<string, SlidePatch>();

  for (const section of bundle.sections) {
    const slide = section.slideContent?.contentSlide;
    if (!slide) {
      continue;
    }

    const patch: SlidePatch = {
      slideId: `slide-${section.id}`,
      title: "slideTitle" in slide ? slide.slideTitle : undefined,
    };

    if (slide.template === "chart-with-context") {
      patch.body = slide.body;
      patch.chartHorizontal = slide.chartHorizontal;
      patch.categoryAxisLabel = slide.categoryAxisLabel;
      patch.valueAxisLabel = slide.valueAxisLabel;
    }

    patches.set(patch.slideId, patch);
  }

  return patches;
}

function patchEncodedSlideBlock(block: string, patch: SlidePatch) {
  let next = block;

  if (patch.title) {
    const encodedTitle = encodeForCache(patch.title);
    next = next.replace(
      /(&quot;props&quot;: \{[\s\S]*?&quot;title&quot;: &quot;)([^&]*(?:&amp;[^&]*)*)(&quot;)/,
      `$1${encodedTitle}$3`
    );
  }

  if (patch.body) {
    const encodedBody = encodeBodyForCache(patch.body);
    next = next.replace(
      /(&quot;body&quot;: &quot;)([\s\S]*?)(&quot;,)/,
      `$1${encodedBody}$3`
    );
  }

  if (patch.chartHorizontal) {
    if (!next.includes("&quot;isHorizontal&quot;")) {
      next = next.replace(
        /(&quot;yAxisLabel&quot;: &quot;[^&]*(?:&amp;[^&]*)*&quot;,)(\s*&quot;chartData&quot;)/,
        `$1\n            &quot;isHorizontal&quot;: true,$2`
      );
    }

    if (patch.valueAxisLabel && patch.categoryAxisLabel) {
      next = next.replace(
        /&quot;xAxisLabel&quot;: &quot;[^&]*(?:&amp;[^&]*)*&quot;/,
        `&quot;xAxisLabel&quot;: &quot;${encodeForCache(patch.valueAxisLabel)}&quot;`
      );
      next = next.replace(
        /&quot;yAxisLabel&quot;: &quot;[^&]*(?:&amp;[^&]*)*&quot;/,
        `&quot;yAxisLabel&quot;: &quot;${encodeForCache(patch.categoryAxisLabel)}&quot;`
      );
    }
  }

  return next;
}

/**
 * Deterministic fixes after Thesys artifact generation — layout, titles, body,
 * horizontal bar orientation, and axis labels from bundle data.
 */
export function patchPresentationSlides(
  slidesContent: string,
  bundle: DemoPresentationBundle
) {
  const patches = collectSlidePatches(bundle);
  if (patches.size === 0) {
    return slidesContent;
  }

  let content = slidesContent;

  for (const patch of patches.values()) {
    const idMarker = `&quot;id&quot;: &quot;${patch.slideId}&quot;`;
    const start = content.indexOf(idMarker);
    if (start === -1) {
      continue;
    }

    const nextSlide = content.indexOf('&quot;id&quot;: &quot;slide-', start + idMarker.length);
    const blockEnd = nextSlide === -1 ? content.length : nextSlide;
    const block = content.slice(start, blockEnd);
    const patchedBlock = patchEncodedSlideBlock(block, patch);

    if (patchedBlock !== block) {
      content = content.slice(0, start) + patchedBlock + content.slice(blockEnd);
    }
  }

  return content;
}
