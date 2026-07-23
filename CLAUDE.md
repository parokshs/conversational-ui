# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Next.js (App Router) generative-UI chat client built on **Thesys C1** (`@thesysai/genui-sdk`, `@crayonai/react-core`/`react-ui`/`stream`). The whole UI is a single `C1Chat` component (`src/app/page.tsx`) that talks to a streaming `/api/chat` route; C1 turns LLM output into rendered UI (tables, callouts, artifacts) via a custom XML-ish dialect the SDK parses out of the model's streamed text.

The app also has a **demo mode** layered on top that intercepts matched questions and returns pre-generated, staged C1 responses instead of calling the live model, plus a presentation/PPTX export feature built from the same demo data.

## Commands

```bash
npm run dev            # start dev server (Turbopack), http://localhost:3000
npm run build           # production build
npm run start           # run production build
npm run lint             # next lint
npm run bootstrap:demo  # regenerate src/demo/responses/*.c1.txt from src/demo/data/*.ts via the live Thesys API
```

No test suite exists in this repo currently.

`bootstrap:demo` requires `THESYS_API_KEY` in `.env` (it reads `.env` itself via a hand-rolled loader in `scripts/bootstrap-c1-responses.ts`, not dotenv). `.env` also sets `DEMO_MODE` (defaults to enabled — see below).

## Architecture

### Chat request flow (`src/app/api/chat/route.ts`)

Each POST carries `{ prompt, threadId, responseId }`. The route, in order:

1. Appends `prompt` to an in-memory per-thread message store (`messageStore.ts` — a plain object keyed by `threadId`, **not persisted**, reset on server restart).
2. If demo mode is on and the question matches a presentation-export phrase (`isPresentationExportRequest`), delegates to `demo/presentation/presentationFlow.ts`.
3. Else if demo mode is on and the question keyword-matches a registered demo flow (`matchStagedFlow`), streams back that flow's pre-generated `.c1.txt` file instead of calling the model (`buildStagedResponse.ts`).
4. Otherwise falls through to a real streaming call to Thesys (`https://api.thesys.dev/v1/embed/`, model `c1/openai/gpt-5/v-20251130`), piping deltas into a `c1Response` via `@crayonai/stream`'s `transformStream`.

In all three cases the assistant's final message is written back into the message store, tagged with `flowId` when it came from a demo flow — this tagging is how presentation export later knows which demo analyses have been shown in a given thread (`getMatchedFlowIds`).

Demo mode is controlled by `isDemoModeEnabled()` in `buildStagedResponse.ts`: **on unless `DEMO_MODE` is explicitly `"false"`**.

### Demo flow system (`src/demo/`)

This is the part of the codebase most likely to need edits day-to-day. Read `src/demo/README.md` for the full workflow; summary:

- **Six-step demo**: (1) Americas occupancy, (2) Jefferson costs, (3) Engineering workspace, (4) Floor 07 plan image, (5) presentation export, (6) PPTX download. See `src/demo/README.md`.
- **Data**: `src/demo/data/*.ts` — plain TypeScript source-of-truth for numbers/text (e.g. `americasBuildings.ts`, `jeffersonHouseCosts.ts`, `engineeringWorkspace.ts`, `floorPlan.ts`).
- **Flow definitions**: `src/demo/flows/definitions/*.ts` implement `DemoFlowDefinition` (`src/demo/flows/types.ts`): `keywords` for matching, `responseFile` naming the staged `.c1.txt`, optional `thinking` (title/description shown as an ephemeral "thinking" step), `buildChatPrompt()` (prompt used to bootstrap the staged in-chat response), and `buildPresentationSection()` (structured slide content built directly from the data files, no LLM involved).
- **Registry**: `src/demo/flows/registry.ts` lists every flow — a new flow must be registered here or it's invisible to matching, bootstrapping, and presentation export.
- **Matching**: `src/demo/flows/matchPrompt.ts` does keyword scoring (exact substring match weighted by word count, partial word overlap as fallback) with a minimum score threshold of 2 to accept a match. Demo prompts are **not** hardcoded — add synonyms to each flow's `keywords` array. No embeddings/LLM involved.
- **Latency**: `src/demo/demoLatency.ts` — optional artificial delay via `.env` (`DEMO_LATENCY_MS`, `DEMO_LATENCY_MIN_MS`/`MAX`, `DEMO_PRESENTATION_LATENCY_MS`) or per-flow `latencyMs`. Staged responses read disk, not a database.
- **Staged responses**: `src/demo/responses/*.c1.txt` are raw C1-formatted text, generated ahead of time by `npm run bootstrap:demo` (calls the real Thesys API once per flow, per `buildChatPrompt()`) and replayed verbatim at request time. **If you edit `data/*.ts`, you must rerun `bootstrap:demo` for the in-chat response to reflect it** — presentation export does not need this since it reads the data files directly at request time.

### Presentation / PPTX export (`src/demo/presentation/`)

Triggered by natural-language phrases matched in `presentationFlow.ts` (`isPresentationExportRequest`: "export a presentation", "create slides", "generate a deck", etc.). `handlePresentationExport`:

1. Looks up which demo flows have already been answered in this thread (`getMatchedFlowIds` on the message store) and builds a `DemoPresentationBundle` from their `buildPresentationSection()` output (`buildBundle.ts`) — export is scoped to what the user actually asked about, not all demo content.
2. If nothing matched yet, streams back a plain message asking the user to ask a demo question first.
3. Otherwise calls the Thesys **artifact** API (`https://api.thesys.dev/v1/artifact`, model `c1/artifact/v-20251030`) with a system/user prompt built by `artifactPrompt.ts` from the bundle, streaming the result wrapped in `<artifact type="slides" ...>` tags into the chat response. The `@thesysai/genui-sdk` client renders this as a native artifact viewer with a PPTX export button.
4. Actual PPTX generation happens server-side in `src/app/api/export-pptx/route.ts`, which proxies `exportParams` (produced client-side by the SDK's export button) to `https://api.thesys.dev/v1/artifact/pptx/export` and streams the binary back with `Content-Disposition: attachment`.

### Adding a new demo step

Follow `src/demo/README.md`'s table exactly — in short: add a data file, add a flow definition with both builder functions, register it in `registry.ts`, run `npm run bootstrap:demo`. No other wiring is needed; presentation export picks up any registered flow automatically once it's been matched in a thread.

## Conventions

- Path alias `@/*` → `src/*` (see `tsconfig.json`).
- `strict` is `false` in `tsconfig.json` — don't assume strict-null-check guarantees when editing.
- ESLint extends `next/core-web-vitals` + `next/typescript` — nothing custom.
