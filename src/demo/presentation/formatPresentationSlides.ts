import { CWP_CHART_PALETTE } from "./cwpBrandPrompt";
import type {
  ChartContentLayout,
  DemoPresentationBundle,
  PresentationActionPlanSlide,
  PresentationContentSlide,
  PresentationInsightItem,
  PresentationSection,
  PresentationSlideContent,
} from "./types";

const SLIDE_TITLE_MAX = 36;
const INSIGHT_SLIDE_TITLE_MAX = 52;
const BODY_MAX = 120;
const INSIGHT_TEXT_MAX = 32;
const ACTION_PLAN_ITEMS_MAX = 3;

const SECTION_SLIDE_CONFIG: Record<
  string,
  { slideType: "metrics-overview" | "insight"; layout?: ChartContentLayout }
> = {
  "americas-occupancy": { slideType: "metrics-overview", layout: "title-body-bottom" },
  "building-f-alignment": { slideType: "insight", layout: "title-body-left" },
  "retail-workspace": { slideType: "insight", layout: "title-body-left" },
  "floor-plan": { slideType: "insight" },
};

function truncate(value: string, maxLength: number) {
  const text = value.trim();
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1)}…`;
}

function stripMarkdown(value: string) {
  return value.replace(/\*\*/g, "").trim();
}

function buildInsightItems(section: PresentationSection): string[] {
  return (section.bullets ?? [])
    .filter((group) => !/recommend/i.test(group.label))
    .flatMap((group) => group.items)
    .map(stripMarkdown);
}

function buildRecommendation(section: PresentationSection): string | undefined {
  const recommendation = (section.bullets ?? [])
    .filter((group) => /recommend/i.test(group.label))
    .flatMap((group) => group.items)[0];

  return recommendation ? stripMarkdown(recommendation) : undefined;
}

function buildMetricsOverviewBody(section: PresentationSection) {
  const insights = buildInsightItems(section);
  const intro = section.intro ? stripMarkdown(section.intro) : "";

  if (insights.length > 0) {
    return truncate(insights[0], BODY_MAX);
  }

  return truncate(intro || "Portfolio-wide metrics in chart above.", BODY_MAX);
}

const SECTION_INSIGHT_TITLES: Record<string, string> = {
  "building-f-alignment": "Actual vs. Allocated Space Alignment – Building F",
  "retail-workspace": "Retail Workspace Allocation by Floor",
};

/** Compact bodies (≤120 chars) per Thesys schema — matches layout guide bullets + recommendation */
const SECTION_INSIGHT_BODIES: Record<string, string> = {
  "building-f-alignment": [
    "• HR: 98%, best in building",
    "• Others: 89–96% healthy",
    "• Retail: 68% outlier",
    "",
    "Rec: Investigate Retail misallocation.",
  ].join("\n"),
  "retail-workspace": [
    "• Retail: 67% aligned, 85-seat gap",
    "• Floor 1: 72%; Floor 2: 65%",
    "",
    "Rec: Consolidate Retail; flex on Floor 1.",
  ].join("\n"),
};

function buildInsightBody(section: PresentationSection) {
  const curated = SECTION_INSIGHT_BODIES[section.id];
  if (curated) {
    return truncate(curated, BODY_MAX);
  }

  const insights = buildInsightItems(section).slice(0, 3);
  const recommendation = buildRecommendation(section);

  if (insights.length === 0) {
    return truncate(section.intro || "See chart for key patterns.", BODY_MAX);
  }

  const bullets = insights.map((item) => `• ${item}`);
  if (recommendation) {
    bullets.push("", `Recommendation: ${recommendation}`);
  }

  return bullets.join("\n").slice(0, BODY_MAX);
}

function buildListInsightItems(section: PresentationSection): PresentationInsightItem[] {
  const insights = buildInsightItems(section).slice(0, 3);
  const recommendation = buildRecommendation(section);

  const items = insights.map((text) => ({
    iconName: "dot",
    iconCategory: "shapes",
    primaryText: truncate(text, INSIGHT_TEXT_MAX),
  }));

  if (recommendation && items.length < 4) {
    items.push({
      iconName: "dot",
      iconCategory: "shapes",
      primaryText: truncate(`Recommend: ${recommendation}`, INSIGHT_TEXT_MAX),
    });
  }

  return items;
}

function resolveChartColors(chart: NonNullable<PresentationSection["charts"]>[0]) {
  if (chart.series.length > 1 || chart.chartType === "groupedBar") {
    return [...CWP_CHART_PALETTE.twoSeries];
  }

  return [CWP_CHART_PALETTE.singleSeries];
}

function buildChartContentSlide(
  section: PresentationSection
): PresentationContentSlide | undefined {
  const chart = section.charts?.[0];
  if (!chart) {
    return undefined;
  }

  const config = SECTION_SLIDE_CONFIG[section.id] ?? {
    slideType: "insight" as const,
    layout: "title-body-left" as const,
  };

  const isMetricsOverview = config.slideType === "metrics-overview";
  const tableHeading = section.tables?.[0]?.heading;
  const insightTitle = SECTION_INSIGHT_TITLES[section.id];
  const titleMax = isMetricsOverview ? SLIDE_TITLE_MAX : INSIGHT_SLIDE_TITLE_MAX;
  const slideTitle = truncate(
    isMetricsOverview && tableHeading
      ? `${tableHeading} — ${chart.heading}`
      : insightTitle ?? section.title,
    titleMax
  );

  return {
    slideType: config.slideType,
    template: "chart-with-context",
    slideTitle,
    body: isMetricsOverview
      ? buildMetricsOverviewBody(section)
      : buildInsightBody(section),
    layout: config.layout ?? "title-body-left",
    chartType: chart.chartType,
    categories: chart.categories,
    series: chart.series,
    categoryAxisLabel: chart.categoryAxisLabel,
    valueAxisLabel: chart.valueAxisLabel,
    chartColors: resolveChartColors(chart),
    chartHorizontal: chart.chartType === "horizontalBar",
  };
}

function buildImageContentSlide(
  section: PresentationSection
): PresentationContentSlide | undefined {
  const image = section.images?.[0];
  if (!image) {
    return undefined;
  }

  const insightItems = buildListInsightItems(section);
  if (insightItems.length === 0 && section.intro) {
    insightItems.push({
      iconName: "dot",
      iconCategory: "shapes",
      primaryText: truncate(section.intro, INSIGHT_TEXT_MAX),
    });
  }

  return {
    slideType: "insight",
    template: "list-with-image",
    slideTitle: truncate(section.title, SLIDE_TITLE_MAX),
    insightItems,
    imageUrl: image.url,
  };
}

function buildSectionSlideContent(
  section: PresentationSection
): PresentationSlideContent {
  const contentSlide =
    buildChartContentSlide(section) ?? buildImageContentSlide(section);

  if (!contentSlide) {
    throw new Error(`Section "${section.id}" has no chart or image for presentation.`);
  }

  return { contentSlide };
}

function buildActionPlanSlide(
  bundle: DemoPresentationBundle
): PresentationActionPlanSlide | undefined {
  const recommendations = bundle.sections
    .map((section) => buildRecommendation(section))
    .filter((item): item is string => Boolean(item));

  if (recommendations.length === 0) {
    return undefined;
  }

  return {
    slideTitle: truncate("Action Plan — Portfolio Optimization", SLIDE_TITLE_MAX),
    items: recommendations.slice(0, ACTION_PLAN_ITEMS_MAX).map((rec, index) => ({
      title: truncate(`${index + 1}. Priority ${index + 1}`, 120),
      body: truncate(rec, 160),
    })),
  };
}

export function enrichPresentationBundle(
  bundle: DemoPresentationBundle
): DemoPresentationBundle {
  const enrichedSections = bundle.sections.map((section) => ({
    ...section,
    slideContent: buildSectionSlideContent(section),
  }));

  return {
    ...bundle,
    title: "Portfolio & Building Analytics",
    subtitle: "Americas Real Estate Insights",
    sections: enrichedSections,
    actionPlanSlide: buildActionPlanSlide({ ...bundle, sections: enrichedSections }),
  };
}
