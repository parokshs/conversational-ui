function encodeHtmlEntities(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

type SlidesArtifactParts = {
  artifactPrefix: string;
  operations: object[];
};

/** Split cached Thesys slides artifact into shell + diff operations. */
export function parseSlidesArtifact(content: string): SlidesArtifactParts | null {
  const match = content.match(
    /^(<artifact[\s\S]*?>)([\s\S]*?)(<\/artifact><artifact_diff[\s\S]*?>)([\s\S]*?)(<\/artifact_diff>\s*)$/
  );

  if (!match) {
    return null;
  }

  const [, artifactOpen, artifactBody, diffOpen, diffBody] = match;

  try {
    const operations = JSON.parse(decodeHtmlEntities(diffBody.trim())) as object[];
    if (!Array.isArray(operations) || operations.length === 0) {
      return null;
    }

    return {
      artifactPrefix: `${artifactOpen}${artifactBody}${diffOpen}`,
      operations,
    };
  } catch {
    return null;
  }
}

function formatOperation(operation: object, index: number) {
  const json = encodeHtmlEntities(JSON.stringify(operation, null, 2));
  return index === 0 ? json : `,\n${json}`;
}

type C1ResponseWriter = {
  writeContent: (content: string) => Promise<void>;
};

/**
 * Streams a slides artifact one diff operation at a time so the viewer can
 * reveal slides progressively (matches live Thesys artifact streaming).
 */
export async function streamSlidesArtifactIncrementally(
  c1Response: C1ResponseWriter,
  content: string,
  {
    waitBeforeEachSlide,
  }: {
    waitBeforeEachSlide: () => Promise<void>;
  }
) {
  const parsed = parseSlidesArtifact(content);
  if (!parsed) {
    await c1Response.writeContent(content);
    return;
  }

  const { artifactPrefix, operations } = parsed;
  const [firstOperation, ...slideOperations] = operations;

  await c1Response.writeContent(`${artifactPrefix}[\n`);
  await c1Response.writeContent(formatOperation(firstOperation, 0));

  for (let index = 0; index < slideOperations.length; index++) {
    await waitBeforeEachSlide();
    await c1Response.writeContent(formatOperation(slideOperations[index], index + 1));
  }

  await c1Response.writeContent("\n]\n</artifact_diff>");
}
