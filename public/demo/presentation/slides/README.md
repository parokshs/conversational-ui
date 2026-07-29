# Presentation slide images (browser preview)

Drop **numbered full-slide images** here. Bootstrap builds the preview cache from
**every numbered file** it finds — no fixed count, no Thesys API.

## Folder

```
public/demo/presentation/slides/
```

## Naming

Use simple numbers:

```
1.png
2.png
3.png
…
```

Also supported: `1.webp`, `2.jpg`, etc.

- **Gaps are OK** — e.g. `1.png` + `3.png` → two slides (in numeric order)
- **Any count** — 3 slides or 10 slides both work
- Non-numbered files (e.g. `README.md`) are ignored

## Regenerate preview cache

```bash
npm run bootstrap:presentation
```

Requires **at least one** numbered image. Bootstrap does **not** fall back to Thesys
when images are present (even if you only have slides 1–3).

## Recommended export size

**1920 × 1080 px** (16:9) — matches the in-browser slide canvas and avoids letterboxing.
For retina sharpness, export at **3840 × 2160 px** (same aspect ratio).

## URLs at runtime

```
/demo/presentation/slides/1.png
/demo/presentation/slides/3.png
```
