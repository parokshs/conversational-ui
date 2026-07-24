export function isDemoRoutingDebugEnabled(): boolean {
  if (process.env.DEMO_DEBUG_ROUTING === "true") {
    return true;
  }

  if (process.env.DEMO_DEBUG_ROUTING === "false") {
    return false;
  }

  return process.env.DEMO_MODE !== "false";
}

export function logDemoRouting(
  event: string,
  details: Record<string, unknown>
): void {
  if (!isDemoRoutingDebugEnabled()) {
    return;
  }

  console.info(`[demo-routing] ${event}`, details);
}
