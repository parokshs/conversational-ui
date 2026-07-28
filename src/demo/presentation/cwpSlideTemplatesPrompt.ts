/**
 * Thesys slide template rules (c1/artifact/v-20260130) mapped to CWP brand.
 */
export const CWP_SLIDE_TEMPLATES_PROMPT = `
SLIDE TEMPLATE RULES (c1/artifact/v-20260130):

USE PRE-BUILT slideContent FROM DATA — copy titles, infoItems, items, chart values, and image URLs exactly.
Do NOT invent markdown tables, do NOT use Text Body variant for tabular data, do NOT reformat slideContent.

SLIDE SEQUENCE (strict):
1. Title slide → variant "minimal", layout "title-bottom"
   - title: DATA.title, subtitle: DATA.subtitle, helperText: DATA.helperText
   - NO bgImageSrc, NO images

2. For each DATA.sections[] in order:
   a) Section Break → variant "classic" (section break slide), title: section.slideContent.sectionDividerTitle
   b) For each section.slideContent.tableSlides[] → Key Info with Title
      - variant "key-info-with-title", layout from slideContent (usually horizontal-grid)
      - title + infoItems copied exactly from slideContent
   c) For each section.slideContent.chartSlides[] → Chart with Context
      - variant "chart-with-context", layout "title-body-top"
      - title, body, chart from slideContent; chart fills most of the slide
      - horizontalBar → BarChart isHorizontal true; groupedBar → BarChart multi-series
   d) section.slideContent.imageSlide (if present) → Content with Image
      - variant "content-with-image", layout "image-right"
      - title, body, images: [imageUrl] from slideContent exactly
   e) For each section.slideContent.insightSlides[] → Key Info with Title
      - variant "key-info-with-title", layout "horizontal-grid"
      - title + infoItems copied exactly from slideContent (do NOT use Content Classic or Numbered Key Points for insights)

3. For each DATA.closingSlides[] → Numbered Key Points (max 3 items per slide for large typography)
   - variant "numbered-key-point", items copied exactly — never exceed 3 items per closing slide

FORBIDDEN:
- Text Body variant (renders markdown as tiny plain text — never use)
- Markdown tables or pipe-delimited table text
- Title Standard, Title Dramatic, TitleWithImage, TwoColumnText, KeyStatement
- ANY thesys_image:* or decorative/stock/AI images
- bgImageSrc on any slide
- Content Classic for insight bullets (use insightSlides key-info grid instead)
- Empty slides or slides with large unused body areas

DENSITY & TYPOGRAPHY:
- Every content slide must fill the viewport: charts large, info grids use horizontal-grid, bullets use two columns when >4 items
- Prefer fewer, denser slides over many sparse slides
- Keep titles within schema max lengths already enforced in slideContent
- No images except DATA.sections[].slideContent.imageSlide.imageUrl when provided
`.trim();
