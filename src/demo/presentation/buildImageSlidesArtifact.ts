import { discoverPresentationSlideImages } from "./slideImages";

function encodeHtmlEntities(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

type BuildImageSlidesArtifactOptions = {
  artifactId: string;
  presentationTitle?: string;
  version?: number;
};

/**
 * Builds a Thesys slides artifact from numbered PNG/WebP/JPG files in
 * public/demo/presentation/slides/ (1.png, 2.png, …) — no Thesys API call.
 */
export function buildImageSlidesArtifact({
  artifactId,
  presentationTitle = "Portfolio & Building Analytics",
  version = Date.now(),
}: BuildImageSlidesArtifactOptions) {
  const slides = discoverPresentationSlideImages();
  if (slides.length === 0) {
    throw new Error(
      "No slide images found. Add numbered files (1.png, 2.png, …) to public/demo/presentation/slides/"
    );
  }

  const operations: object[] = [
    {
      op: "replace",
      id: "presentation-title",
      value: {
        id: "presentation-title",
        text: presentationTitle,
      },
    },
  ];

  for (const slide of slides) {
    operations.push({
      op: "append",
      value: {
        id: slide.id,
        template: "Image",
        props: {
          variant: "images",
          images: [slide.publicUrl],
        },
      },
    });
  }

  const emptyPresentation = encodeHtmlEntities(
    JSON.stringify({
      component: {
        component: "Presentation",
        props: {
          metadata: {
            title: { id: "presentation-title", text: "Presentation" },
          },
          slides: [],
        },
      },
    })
  );

  const diffJson = encodeHtmlEntities(JSON.stringify(operations, null, 2));

  return [
    `<artifact thesys="true" type="slides" id="${artifactId}" version="${version}">`,
    emptyPresentation,
    `</artifact><artifact_diff thesys="true" type="slides" id="${artifactId}">`,
    diffJson,
    `</artifact_diff>`,
  ].join("\n");
}
