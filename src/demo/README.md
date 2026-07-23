# Staged demo data

Six-step demo flow for portfolio occupancy analysis through executive presentation export.

| Step | Example prompt | Data / flow |
| --- | --- | --- |
| 1 | Show me the building-level occupancy metrics for the Americas region. | `data/americasBuildings.ts` → `flows/definitions/americasOccupancy.ts` |
| 2 | Show the Vacant vs Allocated costs for Jefferson House by Business Unit and analyse the results | `data/jeffersonHouseCosts.ts` → `flows/definitions/jeffersonCosts.ts` |
| 3 | Review the workspace allocation for Engineering by floor and seat type | `data/engineeringWorkspace.ts` → `flows/definitions/engineeringWorkspace.ts` |
| 4 | Show me the highlighted floorplan by Business Unit allocation on floor 07 with legend for Occupied and Vacant Workstations | `data/floorPlan.ts` → `flows/definitions/floorPlan.ts` |
| 5 | Prepare a presentation to be shared with the Executives | Presentation export via `presentation/presentationFlow.ts` |
| 6 | Download PPTX from the slide artifact | Native Thesys export button → `/api/export-pptx` |

## Source of truth

Edit demo content in:

- `data/americasBuildings.ts` — Americas occupancy table
- `data/jeffersonHouseCosts.ts` — Jefferson cost analysis and observations
- `data/engineeringWorkspace.ts` — Engineering allocation by floor and seat type
- `data/floorPlan.ts` — Floor 07 plan image URL and caption

Each demo step is registered once in `flows/definitions/`. Those definition files import the data files and expose:

- `buildChatPrompt()` — used to bootstrap the in-chat C1 response
- `buildPresentationSection()` — used when the user exports a presentation

The flow registry in `flows/registry.ts` lists every chat demo step (steps 1–4).

## After changing data

Regenerate the pre-rendered C1 response files:

```bash
npm run bootstrap:demo
```

This calls the Thesys API and writes:

- `responses/americasOccupancy.c1.txt`
- `responses/jeffersonCosts.c1.txt`
- `responses/engineeringWorkspace.c1.txt`
- `responses/floorPlan.c1.txt`

Requires `THESYS_API_KEY` in `.env`.

Presentation export does **not** need bootstrapping. It reads the TypeScript data directly at export time, so slide content stays in sync as soon as you save the data files.

## Runtime

The chat API serves the `.c1.txt` files for matched demo questions. It also tracks which demo steps were answered in each thread so presentation export can include only the analyses the user actually requested.

## Exporting a presentation (step 5)

After asking one or more demo questions in a thread, the user can type a natural request such as:

- "Prepare a presentation to be shared with the Executives"
- "Export a presentation"
- "Create slides from this conversation"
- "Generate a deck"

The chat API:

1. Collects the demo steps already answered in that thread
2. Builds a presentation bundle from the same `data/*.ts` source files
3. Streams a slide artifact into the chat UI
4. Shows the native Thesys export button for PPTX download

PPTX export is handled by `/api/export-pptx`, which proxies to the Thesys artifact PPTX API.

## Adding a new demo step

1. Add raw data under `data/yourStep.ts`
2. Add a flow definition under `flows/definitions/yourStep.ts` that:
   - imports the data file
   - defines `keywords`, `responseFile`, and optional `thinking`
   - implements `buildChatPrompt()`
   - implements `buildPresentationSection()`
3. Register the flow in `flows/registry.ts`
4. Run `npm run bootstrap:demo`

No extra presentation wiring is needed. The new step is included automatically when it has been answered in the current thread before the user requests a presentation export.

## Editing an existing step

| What you change | What to do next |
| --- | --- |
| Numbers, intro text, flags, summaries in `data/*.ts` | Save the file. Presentation export updates immediately. Run `npm run bootstrap:demo` to refresh the in-chat response. |
| Keywords or response filename | Edit the flow definition and registry only |
| Chat layout instructions | Update `buildChatPrompt()` in the flow definition, then run `npm run bootstrap:demo` |
| Slide layout instructions | Update `buildPresentationSection()` and/or `presentation/artifactPrompt.ts` |
