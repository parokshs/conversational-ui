function parseNonNegativeInt(value: string | undefined): number | undefined {
  if (!value?.trim()) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

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

  return getDemoLatencyMs();
}

export async function waitForDemoLatency(options?: { ms?: number }): Promise<void> {
  const ms = getDemoLatencyMs(options?.ms);

  if (ms <= 0) {
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, ms));
}
