# Staged demo data

## Source of truth

Edit demo content in:

- `data/americasBuildings.ts` — Americas occupancy table
- `data/jeffersonHouseCosts.ts` — Jefferson / Building 25 cost analysis

Prompt templates that turn this data into C1 UI live in `buildPrompts.ts`.

## After changing data

Regenerate the pre-rendered C1 response files:

```bash
npm run bootstrap:demo
```

This calls the Thesys API and writes:

- `responses/americasOccupancy.c1.txt`
- `responses/jeffersonCosts.c1.txt`

Requires `THESYS_API_KEY` in `.env`.

## Runtime

The chat API serves the `.c1.txt` files directly. It does not re-read the TypeScript data files at request time.

## Adding a new flow

1. Add data under `data/`
2. Add a prompt builder in `buildPrompts.ts` and register it in `demoResponseJobs`
3. Add keywords + response file mapping in `flows/registry.ts`
4. Run `npm run bootstrap:demo`
