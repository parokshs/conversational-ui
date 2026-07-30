# CLAUDE.md

This file provides guidance to Claude Code and Cursor when working on this repository.

## What this is

A Next.js (App Router) generative-UI chat client built on **Thesys C1** (`@thesysai/genui-sdk`, `@crayonai/react-core`/`react-ui`/`stream`). The UI is a single `C1Chat` component (`src/app/page.tsx`) that streams to `/api/chat`; the SDK parses a custom XML-ish dialect from the model stream and renders tables, charts, callouts, and slide artifacts.

The app has **demo mode** (staged C1 responses from disk, no live LLM) plus **presentation preview + PPTX download** for the portfolio analytics demo.

## Commands

```bash
npm run dev                  # dev server (Turbopack), http://localhost:3000
npm run build && npm run start
npm run lint
npm run bootstrap:demo       # regenerate src/demo/responses/*.c1.txt via Thesys API
npm run bootstrap:presentation  # build slides preview cache from PNG slide images (no Thesys)
npm run seed:presentation -- --pptx <path>  # lock in edited PPTX + enable seeded demo cache
```

No test suite exists. Node **>= 20.9.0**.

Scripts read `.env` via hand-rolled loaders (not dotenv). `THESYS_API_KEY` is required for `bootstrap:demo` and live LLM/artifact paths.

## Environment (demo)

| Variable | Default | Purpose |
| --- | --- | --- |
| `DEMO_MODE` | on (unless `"false"`) | Staged responses + presentation cache path |
| `DEMO_LATENCY_MS` | 0 | Delay before each staged chat step |
| `DEMO_PRESENTATION_LATENCY_MS` | 3500 | Delay before slide deck opens (think item visible) |
| `DEMO_PRESENTATION_SLIDE_LATENCY_MS` | 1000 | Delay between each slide appearing in preview |
| `DEMO_PRESENTATION_DOWNLOAD_LATENCY_MS` | 2500 | Delay before PPTX download starts (export button spinner) |

See `.env-example` and `src/demo/demoLatency.ts`.

## Architecture

### Chat request flow (`src/app/api/chat/route.ts`)

Each POST: `{ prompt, threadId, responseId }`.

1. Append `prompt` to in-memory per-thread store (`messageStore.ts` — **not persisted**, lost on restart).
2. If demo mode + **presentation phrase match** → `presentation/presentationFlow.ts` (checked **before** staged flows).
3. Else if demo mode + keyword match → stream pre-generated `.c1.txt` (`buildStagedResponse.ts`).
4. Else → live Thesys embed API.

Unmatched demo prompts return: *"Sorry, I couldn't process that. Please try again."*

Assistant messages from staged flows get `flowId` for logging; presentation export does **not** require prior steps in the thread.

Demo mode: `isDemoModeEnabled()` → on unless `DEMO_MODE === "false"`.

### Demo flow system (`src/demo/`)

Read `src/demo/README.md` for the full workflow.

- **Steps 1–4**: Americas occupancy, Building F alignment, Retail workspace, Floor 1 plan — registered in `flows/registry.ts`, data in `src/demo/data/*.ts`.
- **Step 5**: Presentation export (phrase match, not keyword scoring).
- **Step 6**: PPTX download from artifact viewer → `/api/export-pptx`.

**Matching (steps 1–4)**: `flows/matchPrompt.ts` — keyword scoring, threshold **2**. Add synonyms to each flow's `keywords` array.

**Staged responses**: `src/demo/responses/*.c1.txt`. After editing `data/*.ts`, run `npm run bootstrap:demo` for in-chat UI to update. Presentation **preview cache** is separate (see below).

### Anomaly thread (sidebar)

Pre-loaded **Proactive Insights** thread (`anomaly/anomalyThread.ts`):

- Data: `data/anomalyFindings.ts` — **Boltro Road · Room Occupancy first**, then **Sanam · Area Discrepancy** (order in `getAnomalyFindings()` + `responses/anomalyFindings.c1.txt`).
- Loaded via `/api/demo/anomaly-thread` → `buildAnomalySeed.ts`.

### Presentation preview + PPTX (`src/demo/presentation/`)

**Two separate outputs:**

| Output | Source | When updated |
| --- | --- | --- |
| **In-chat slide preview** | `cache/*.slides.txt` | `npm run bootstrap:presentation` |
| **PPTX download** | `cache/*.pptx` | `npm run seed:presentation` (manual edit in PowerPoint) |

**Seeded gate**: `cache/<key>.json` must have `"seeded": true` for demo mode to replay cached preview + serve cached PPTX. `bootstrap:presentation` updates `.slides.txt` but preserves existing `seeded` flag and PPTX.

Default cache key (full 4-step demo):

`americas-occupancy--building-f-alignment--floor-plan--retail-workspace`

#### Image-based preview (current approach)

Thesys-generated slide layouts were unreliable for CWP typography/charts, so **preview uses full-slide PNGs**:

1. Add numbered images: `public/demo/presentation/slides/1.png`, `2.png`, … (`.webp`/`.jpg` OK; gaps OK; README ignored).
2. Run `npm run bootstrap:presentation` — **requires at least one image; no Thesys fallback**.
3. Builder: `buildImageSlidesArtifact.ts` + `slideImages.ts` → Thesys `Image` template artifact in `.slides.txt`.

**Recommended PNG size**: **1920×1080** (16:9) to match the in-browser slide canvas. See `public/demo/presentation/slides/README.md`.

**Artifact format** (must match working Thesys cache or client shows *"Error while generating response"*):

```
<artifact thesys="true" type="slides" id="..." version="...">
{encoded JSON — single `{`, not `{{`}
</artifact><artifact_diff thesys="true" type="slides" id="...">
[
  { "op": "replace", "id": "presentation-title", ... },
  { "op": "append", "value": { "template": "Image", ... } },
  ...
]
</artifact_diff>
```

Do **not** append an extra `]` after the diff array. Use template literals for tags containing `thesys="true"`.

**Streaming**: `streamSlidesArtifactIncrementally.ts` sends one diff operation at a time so slides appear progressively (SDK supports partial `artifact_diff` JSON). Wired from `presentationFlow.ts` with `DEMO_PRESENTATION_SLIDE_LATENCY_MS` between slides.

**CSS**: Image slides render as `background-image` on `.c1-slide-editable-image` with SDK default `background-size: cover` (crops PNGs). Overrides in `cwpSlides.css` use `background-size: contain` for full-slide PNG preview.

**Legacy Thesys path** (still in repo, not used by bootstrap): `formatPresentationSlides.ts`, `patchPresentationSlides.ts`, `artifactPrompt.ts` — used if cache is not image-based and live API is called.

#### Presentation phrase matching

Regex list in `presentationFlow.ts` → `evaluatePresentationExportRequest()`. Examples that work:

- `generate ppt`, `Prepare a presentation`, `Prepare a presentation to be shared with the Executives`
- `export/create/make/build` + presentation/slides/deck/pptx

**Does not match**: `Preparing a presentation`, `Prepare slides/deck` (prepare pattern lacks `slides|deck` — extend patterns if needed).

If user gets the generic sorry message, check server logs for `presentation_export_check` (`matched: false` → phrase or empty `userQuestion` from `getPromptText()`).

#### PPTX download

`src/app/api/export-pptx/route.ts`: if demo + seeded cache → serve `cache/*.pptx`; else proxy Thesys export API. Download delay via `waitForPresentationDownloadLatency()`.

### CWP brand & charts

- Skill folder: `.agents/skills/cwp_template/` (layout guide, browser preview mapping, PPTX reference).
- Brand constants: `presentation/cwpBrandPrompt.ts` → `config/branding.ts` (`brandTheme`, `cwpSlidesTheme`).
- Slide viewer CSS: `presentation/cwpSlides.css` (imported in `globals.css`).

**Chart colors in chat UI** (BarChartV2, MiniChart): Crayon `@crayonai/react-ui` picks colors from theme palette using **middle-index logic** (`PalletUtils.getDistributedColors`). Therefore:

```typescript
// cwpBrandPrompt.ts — order matters, not just hex values
CWP_UI_CHART_PALETTE = ["#CC4678", "#CC4678", "#FF9933"]
// single-series → maroon; two-series → maroon + orange (matches PPT)
```

Do not use a generic multi-color `brandAccents` array — it produced yellow bars (`#FFCC33` at palette midpoint).

### Frontend notes (`src/app/page.tsx`)

- Wraps `C1Chat` in `ThemeProvider` with `disableThemeProvider` on chat.
- **Hydration**: Crayon `ThemeProvider` uses a non-SSR-safe `useId` polyfill (global counter → mismatched `crayon-theme-portal-uid-*`). Chat mounts after `useEffect` client gate to avoid hydration errors.
- PPTX export: `customizeC1.exportAsPPTX` → `/api/export-pptx`.

## Key files (quick map)

| Area | Files |
| --- | --- |
| Chat routing | `src/app/api/chat/route.ts` |
| Presentation export | `src/demo/presentation/presentationFlow.ts` |
| Image slide bootstrap | `scripts/bootstrap-presentation.ts`, `buildImageSlidesArtifact.ts`, `slideImages.ts` |
| Slide cache | `src/demo/presentation/presentationCache.ts`, `cache/*.slides.txt`, `cache/*.json` |
| Incremental slide stream | `src/demo/presentation/streamSlidesArtifact.ts` |
| Demo data | `src/demo/data/*.ts` |
| Staged chat responses | `src/demo/responses/*.c1.txt` |
| Flow registry | `src/demo/flows/registry.ts` |
| Anomaly seed | `src/demo/anomaly/*`, `data/anomalyFindings.ts` |

## Conventions

- Path alias `@/*` → `src/*`.
- `strict: false` in `tsconfig.json`.
- Prefer editing `data/*.ts` as source of truth; regenerate `.c1.txt` with `bootstrap:demo` when chat copy/layout from bootstrap should change.
- For presentation **preview** PNGs: edit images → `bootstrap:presentation`. For **PPTX file**: edit in PowerPoint → `seed:presentation`.
- Minimize scope; match existing demo/presentation patterns before adding new abstractions.

## Adding a new demo step

See `src/demo/README.md`: data file → flow definition (`buildChatPrompt`, `buildPresentationSection`) → `registry.ts` → `bootstrap:demo`. Presentation deck includes all registered full-demo flows via `FULL_DEMO_FLOW_IDS` in `presentationCache.ts`.
