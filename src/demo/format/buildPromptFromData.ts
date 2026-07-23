export function buildPromptFromData({
  task,
  data,
  layout,
}: {
  task: string;
  data: unknown;
  layout: string[];
}) {
  return [
    task,
    "",
    "Use ONLY the values in DATA below. Do not invent, recompute, or alter numbers.",
    "",
    "DATA:",
    JSON.stringify(data, null, 2),
    "",
    "Layout:",
    ...layout.map((line) => `- ${line}`),
    "",
    "Do not mention that this is a demo or staged. Keep the layout clean and executive-ready.",
  ].join("\n");
}
