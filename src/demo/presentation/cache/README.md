# Presentation cache

Optional seeded slide artifacts and PPTX files for demo mode.

## Default behavior (not seeded)

Until you explicitly seed, demo mode **generates live**:

- **Preview** — streams a fresh CWP-branded artifact from Thesys
- **Download** — exports PPTX live from the artifact viewer

Use this flow to generate once, edit in PowerPoint, then lock in the result.

## Seed after editing

1. Run steps 1–4 in the app, then ask to generate a presentation
2. Download the PPTX from the artifact export button
3. Edit the deck in PowerPoint (apply CWP template styling as needed)
4. Seed the cache:

```bash
npm run seed:presentation -- --pptx ~/Downloads/edited-deck.pptx
```

Optional flags:

- `--slides path/to.slides.txt` — also cache in-chat preview (skip live generation)
- `--cache-key <key>` — override cache key (default: full 4-step demo)
- `--title "Deck title"` — download filename title

After seeding, demo mode serves the cached preview + download for that cache key.

## Draft cache (optional)

`npm run bootstrap:presentation` pre-generates slide JSON for reference (`seeded=false`).

**Image-based preview (recommended):** add numbered PNGs (`1.png`, `2.png`, …) to
`public/demo/presentation/slides/` — any count, then run bootstrap (no Thesys API).

It does **not** enable cached demo behavior until you run `seed:presentation`.

Default full-demo cache key:

`americas-occupancy--building-f-alignment--retail-workspace--floor-plan`

## CWP template reference

`../assets/CWP_Template.pptx` — source template from The Changing Workplace brand skill.
