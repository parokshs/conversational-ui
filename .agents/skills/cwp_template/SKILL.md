---
name: cwp-brand-presentations
description: "Use this skill whenever creating, editing, or reviewing a PowerPoint deck for The Changing Workplace / CWP (or when the user references the CWP template, asks for a deck 'in our brand'/'in our template', or asks for an enterprise-quality/company-quality/Microsoft-quality polished presentation without naming a different brand). Make sure to use this skill whenever the user mentions 'CWP', 'The Changing Workplace', 'WebCoRE', 'our template', 'brand deck', or asks to make a presentation look 'professional', 'polished', 'company quality', or 'consulting-grade' — even if they don't explicitly name the brand. This skill supplies the color palette, typography scale, layout patterns, and a bundled template file; pair it with the general pptx skill for the actual build mechanics (pptxgenjs, XML editing, QA, validation)."
---

# CWP Brand Presentations

Companion to the general `pptx` skill. That skill covers *how* to build/edit a `.pptx`
(pptxgenjs gotchas, template editing, validation, visual QA). This skill covers *what it
should look like* for The Changing Workplace / CWP brand, plus a ready-made template to
build from.

**Always use both**: load `pptx`'s SKILL.md for the mechanical how-to, and this skill for
the brand rules below. Skipping the `pptx` skill's QA section is the most common way a
brand-correct-looking deck still ships with overflow or overlap bugs — don't skip it.

## Step 1: Decide your starting point

- **Ask matches one of the template's existing slide types** (title slide, section divider,
  content + table, content + image, closing slide) → duplicate the matching slide from
  `assets/CWP_Template_ppt.pptx` (via `pptx` skill's `add_slide.py`) and edit its content in
  place. Preserves exact positioning, the decorative circle graphic, and fonts.
- **Ask needs a slide type the template doesn't have** (e.g. a chart-heavy slide, a
  comparison grid) → build it fresh with pptxgenjs, but pull every color/size/spacing value
  from `references/brand-style.md` so it reads as part of the same deck.
- **Mixed deck** → do both; duplicate what fits, build the rest fresh, and sanity-check at
  the end that hand-built slides don't look like a different deck (same header bar height,
  same title indent, same font).

Read `references/brand-style.md` in full before writing any content — it has the exact hex
values, the type scale, and the per-layout rules (what goes in a header bar vs. body, how
tables are shaded, what "too much whitespace" vs "too cramped" means for this brand).

## Step 2: Build

Follow the `pptx` skill's build guidance (pptxgenjs gotchas if building fresh, or the
unzip → edit `slideN.xml` → zip flow if working from the template). Apply:

- Colors and type scale from `references/brand-style.md` — never improvise a palette.
- Layout pattern matching the slide's purpose (title / divider / content / table / closing).
- The enterprise-polish rules in `references/brand-style.md` for whitespace balance, chart
  styling, and text sizing — these are this skill's answer to "make it look company-quality."

## Step 3: QA (required, don't skip)

Run the full QA process from the `pptx` skill (content QA via `markitdown`, file QA via
`validate.py --original assets/CWP_Template_ppt.pptx` if you started from the template,
visual QA via rendered slide images). On top of that generic pass, check brand-specific
items:

- Every header bar is the same height and blue across slides.
- No stray fonts — everything is Roboto.
- No slide has a large empty body area next to a small element (see brand-style.md).
- Table headers are bold white on solid blue; body rows use the banded tint, not plain gray.
- Chart series colors follow the accent order in brand-style.md.

If a rendered slide's density looks noticeably lower or higher than its neighbors, that's
usually the whitespace-balance rule being violated — fix before calling it done.

## Reference files

- `references/brand-style.md` — full palette, type scale, layout patterns, polish bar.
- `assets/CWP_Template_ppt.pptx` — the source template; duplicate slides from this rather
  than recreating them by hand.
