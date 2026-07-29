function parseNonNegativeInt(value: string | undefined): number | undefined {
  if (!value?.trim()) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

/** Per-slide delay while the deck streams in (override via DEMO_PRESENTATION_SLIDE_LATENCY_MS). */
const DEFAULT_PRESENTATION_SLIDE_LATENCY_MS = 1000;

/** Shown while the in-chat slide deck is prepared (override via DEMO_PRESENTATION_LATENCY_MS). */
const DEFAULT_PRESENTATION_PREVIEW_LATENCY_MS = 3500;

/** Shown while a PPTX download is prepared (override via DEMO_PRESENTATION_DOWNLOAD_LATENCY_MS). */
const DEFAULT_PRESENTATION_DOWNLOAD_LATENCY_MS = 2500;

export function getDemoLatencyMs(overrideMs?: number): number {
  if (overrideMs !== undefined) {
    return overrideMs;
  }

  const min = parseNonNegativeInt(process.env.DEMO_LATENCY_MIN_MS);
  const max = parseNonNegativeInt(process.env.DEMO_LATENCY_MAX_MS);

  if (min !== undefined && max !== undefined && max >= min) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  return parseNonNegativeInt(process.env.DEMO_LATENCY_MS) ?? 0;
}

export function getPresentationDemoLatencyMs(): number {
  const presentationOverride = parseNonNegativeInt(
    process.env.DEMO_PRESENTATION_LATENCY_MS
  );

  if (presentationOverride !== undefined) {
    return presentationOverride;
  }

  const general = getDemoLatencyMs();
  return general > 0 ? general : DEFAULT_PRESENTATION_PREVIEW_LATENCY_MS;
}

export function getPresentationDownloadLatencyMs(): number {
  const downloadOverride = parseNonNegativeInt(
    process.env.DEMO_PRESENTATION_DOWNLOAD_LATENCY_MS
  );

  if (downloadOverride !== undefined) {
    return downloadOverride;
  }

  return DEFAULT_PRESENTATION_DOWNLOAD_LATENCY_MS;
}

export function getPresentationSlideLatencyMs(): number {
  const slideOverride = parseNonNegativeInt(
    process.env.DEMO_PRESENTATION_SLIDE_LATENCY_MS
  );

  if (slideOverride !== undefined) {
    return slideOverride;
  }

  return DEFAULT_PRESENTATION_SLIDE_LATENCY_MS;
}

export async function waitForDemoLatency(options?: { ms?: number }): Promise<void> {
  const ms = getDemoLatencyMs(options?.ms);

  if (ms <= 0) {
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function waitForPresentationDemoLatency(): Promise<void> {
  await waitForDemoLatency({ ms: getPresentationDemoLatencyMs() });
}

export async function waitForPresentationDownloadLatency(): Promise<void> {
  await waitForDemoLatency({ ms: getPresentationDownloadLatencyMs() });
}

export async function waitForPresentationSlideLatency(): Promise<void> {
  await waitForDemoLatency({ ms: getPresentationSlideLatencyMs() });
}
