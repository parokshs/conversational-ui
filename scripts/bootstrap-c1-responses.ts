import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { demoResponseJobs } from "../src/demo/flows/registry";

function loadEnvFile() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    return;
  }

  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

async function generateC1Response(client: OpenAI, prompt: string): Promise<string> {
  const stream = await client.chat.completions.create({
    model: "c1/openai/gpt-5/v-20251130",
    messages: [{ role: "user", content: prompt }],
    stream: true,
  });

  let content = "";
  for await (const chunk of stream) {
    content += chunk.choices?.[0]?.delta?.content ?? "";
  }

  return content;
}

async function main() {
  loadEnvFile();

  if (!process.env.THESYS_API_KEY) {
    throw new Error("THESYS_API_KEY is required to bootstrap staged responses.");
  }

  const responsesDir = path.join(process.cwd(), "src/demo/responses");
  fs.mkdirSync(responsesDir, { recursive: true });

  const client = new OpenAI({
    baseURL: "https://api.thesys.dev/v1/embed/",
    apiKey: process.env.THESYS_API_KEY,
  });

  for (const job of demoResponseJobs) {
    console.log(`Generating ${job.file}...`);
    const content = await generateC1Response(client, job.buildPrompt());
    fs.writeFileSync(path.join(responsesDir, job.file), content, "utf8");
    console.log(`Saved ${job.file} (${content.length} chars)`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
