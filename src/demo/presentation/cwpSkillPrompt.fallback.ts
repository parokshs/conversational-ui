/**
 * Fallback prompts when skill files are unavailable.
 * Primary source: .agents/skills/cwp_template/ (loaded via cwpSkillLoader.ts).
 */
export const CWP_ANALYTICS_DECK_FALLBACK = `
CWP ANALYTICS DECK TYPE — four slide patterns:
1. Title slide — full-bleed CWP blue, white title lower-third, subtitle, helper text.
2. Metrics-overview — hero chart top ~55%, NO blue header; bold header left + narrative right below.
3. Insight slide — blue header bar; bullets + Recommendation left; one chart/image right.
4. Action-plan — numbered closing list (max 3 items), single column, generous spacing.

Demo deck: 6 slides (title + metrics-overview + 3 insight + action-plan).
`.trim();

export const CWP_TEMPLATE_REFERENCE_FALLBACK = `
Reference files:
- Sample deck: .agents/skills/cwp_template/assets/portfolio-building-analytics-cwp-v2.pptx
- Layout guide: .agents/skills/cwp_template/references/analytics-layout-guide.md
- Base template: src/demo/presentation/assets/CWP_Template.pptx
`.trim();
