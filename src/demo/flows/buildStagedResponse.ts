import fs from "fs";
import path from "path";
import { makeC1Response } from "@thesysai/genui-sdk/server";
import type { DemoFlowDefinition } from "./types";

const responsesDir = path.join(process.cwd(), "src/demo/responses");

function loadResponseContent(flow: DemoFlowDefinition): string {
  const filePath = path.join(responsesDir, flow.responseFile);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing staged response file: ${flow.responseFile}`);
  }

  return fs.readFileSync(filePath, "utf8");
}

export function startStagedResponse(flow: DemoFlowDefinition) {
  const c1Response = makeC1Response();
  const content = loadResponseContent(flow);

  const ready = (async () => {
    if (flow.thinking) {
      await c1Response.writeThinkItem({
        title: flow.thinking.title,
        description: flow.thinking.description,
        ephemeral: true,
      });
    }

    await c1Response.writeContent(content);
    await c1Response.end();
  })();

  return { c1Response, ready };
}

export function isDemoModeEnabled(): boolean {
  return process.env.DEMO_MODE !== "false";
}
