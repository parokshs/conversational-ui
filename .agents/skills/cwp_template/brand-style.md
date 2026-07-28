# CWP / The Changing Workplace — Brand Style Guide

Extracted from `assets/CWP_Template_ppt.pptx`. Use this whenever building a deck in this
brand, whether starting from the template or from scratch.

## Color palette

| Role | Hex | Use |
|---|---|---|
| Primary blue (`accent1`) | `1767D2` | Header bars, title-slide background, section dividers, table header row, primary chart series |
| Near-black (`dk1`) | `2B2B2B` | Body text on white |
| Dark gray (`dk2`) | `3F3F3F` | Secondary text, links visited |
| Light gray (`lt2`) | `F2F2F2` | Subtle backgrounds, dividers |
| Orange (`accent2`) | `FF9933` | Secondary chart series, highlights |
| Red-orange (`accent3`) | `D43900` | Alerts, hyperlinks, tertiary series |
| Yellow (`accent4`) | `FFCC33` | Tertiary chart series, callouts |
| Green (`accent5`) | `049A0D` | Positive/growth indicators |
| Purple (`accent6`) | `9933CC` | Additional chart series |

Table shading: header row = solid `1767D2` with white bold text. Body rows alternate
between a 40%-tint and 20%-tint of `1767D2` (roughly `CCE0F7`-ish and `E6F0FB`-ish light
blues) — never plain white/gray zebra striping in this brand.

**Never substitute a different blue or default to generic AI-deck palettes** (no purple/teal
gradients, no navy-and-gold). If a request needs a color the palette doesn't cover, pick the
nearest accent above rather than inventing one.

## Typography

Font family: **Roboto** everywhere (headings and body — do not mix in a second typeface).

| Element | Size | Weight |
|---|---|---|
| Title-slide main title | 42pt | Bold |
| Section-divider title | 32pt | Bold |
| Content-slide header (in blue bar) | 20pt | Regular |
| Body level 1 | 14pt | Regular |
| Body level 2 | 12pt | Regular |
| Body level 3 / captions | 11pt | Regular |

Titles and inline labels (e.g. `Status:`, `Owner:`) are bold; body copy is regular weight.
Keep a clear size jump between title and body — don't let a header creep down to body size
just to fit more text; shorten the text instead.

## Layout patterns

1. **Title slide** — full-bleed primary blue background, faint concentric-circle motif
   (decorative, low-contrast, never competes with text), white logo + wordmark centered
   upper-middle, deck title bold 42pt lower-third, subtitle/date below at ~18-22pt.
2. **Section divider** — solid primary blue background, single bold left-aligned title
   (32pt), otherwise empty. Used to break the deck into named sections — don't skip these
   for decks with more than ~2 topics.
3. **Content slide** — white body, a ~1" solid blue header bar across the top holding the
   slide title (20pt, left-aligned, white text), with the same faint circle motif bleeding
   in from the top-right corner of the bar only (not over body content). Body area below is
   plain white.
4. **Table slide** — content-slide header + a table using the banded-blue style above.
   Column headers bold white on solid blue. Don't stretch a short table to fill the whole
   body — size it to its content and let the rest of the slide breathe, or add a supporting
   visual/callout beside it rather than leaving a large dead zone.
5. **Closing/back slide** — white background, logo + wordmark bottom-left, company address
   and contact details bottom-right in small (11pt) dark-gray text.

## Enterprise-polish bar (what "looks professional" means here)

This brand's quality bar is closer to a management-consulting or enterprise vendor deck
than a startup pitch deck. Concretely:

- **Text sizing must be legible from a boardroom screen** — never drop body text below 11pt
  to force a fit; cut content or split the slide instead.
- **No dead whitespace** — an emptier-than-half body area (see the table-slide case above)
  reads as unfinished, not minimal. Balance it with a chart, a callout stat, or a second
  supporting element in the brand palette.
- **No cramming either** — don't out-correct the above by cramming; a slide with one chart
  and generous margins is fine as long as the margins are intentional (≥0.5") rather than
  leftover space from an undersized element.
- **Charts** get axis labels, a title, and `chartColors` pulled from the accent list above,
  in the order accent1 → accent2 → accent3 → accent4 → accent5 → accent6 for multi-series
  charts. Quiet gridlines and frames per the general pptx skill guidance.
- **Consistent grid** — content-slide body content aligns to a consistent left margin
  matching the header bar's title indent; don't let some slides indent 0.5" and others 0.8".
