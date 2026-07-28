import type {
  DemoPresentationBundle,
  PresentationSection,
  PresentationSlideContent,
  PresentationTable,
} from "./types";

const INFO_ITEMS_PER_SLIDE = 6;
const INSIGHT_ITEMS_PER_SLIDE = 6;
const CLOSING_ITEMS_PER_SLIDE = 3;

function truncate(value: string, maxLength: number) {
  const text = value.trim();
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1)}…`;
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

function tableToInfoItems(table: PresentationTable) {
  return table.rows.map((row) => ({
    title: truncate(String(row[0]), 16),
    description: truncate(row.slice(1).join(" · "), 48),
  }));
}

function buildTableSlides(section: PresentationSection) {
  if (!section.tables?.length) {
    return undefined;
  }

  return section.tables.flatMap((table) => {
    const infoItems = tableToInfoItems(table);
    const itemGroups = chunk(infoItems, INFO_ITEMS_PER_SLIDE);

    return itemGroups.map((group, index) => ({
      slideTitle: truncate(
        itemGroups.length > 1
          ? `${table.heading} (${index + 1}/${itemGroups.length})`
          : table.heading,
        32
      ),
      layout: "horizontal-grid" as const,
      infoItems: group,
    }));
  });
}

function buildChartSlides(section: PresentationSection) {
  if (!section.charts?.length) {
    return undefined;
  }

  return section.charts.map((chart) => ({
    slideTitle: truncate(chart.heading, 36),
    body: section.intro ? truncate(section.intro, 120) : undefined,
    layout: "title-body-top" as const,
    chartType: chart.chartType,
    categories: chart.categories,
    series: chart.series,
    categoryAxisLabel: chart.categoryAxisLabel,
    valueAxisLabel: chart.valueAxisLabel,
  }));
}

function parseInsightLine(text: string): { title: string; description: string } {
  const colonMatch = text.match(/^([^:]{1,16}):\s*(.+)$/);
  if (colonMatch) {
    return {
      title: truncate(colonMatch[1], 16),
      description: truncate(colonMatch[2], 48),
    };
  }

  const dashMatch = text.match(/^(.{1,20}?)\s*—\s*(.+)$/);
  if (dashMatch) {
    return {
      title: truncate(dashMatch[1], 16),
      description: truncate(dashMatch[2], 48),
    };
  }

  const words = text.split(/\s+/);

  return {
    title: truncate(words.slice(0, 2).join(" "), 16),
    description: truncate(text, 48),
  };
}

function buildInsightSlides(section: PresentationSection) {
  if (!section.bullets?.length) {
    return undefined;
  }

  const infoItems = section.bullets.flatMap((group) =>
    group.items.map((item) => {
      const parsed = parseInsightLine(item);
      if (/recommend/i.test(group.label)) {
        return {
          title: truncate("Action", 16),
          description: truncate(item, 48),
        };
      }

      return parsed;
    })
  );

  return chunk(infoItems, INSIGHT_ITEMS_PER_SLIDE).map((group, index) => ({
    slideTitle: truncate(
      index === 0 ? "Key Insights" : "Key Insights (cont.)",
      32
    ),
    layout: "horizontal-grid" as const,
    infoItems: group,
  }));
}

function buildImageSlide(section: PresentationSection) {
  const image = section.images?.[0];
  if (!image) {
    return undefined;
  }

  const bodyParts = [section.intro].filter(Boolean);

  return {
    slideTitle: truncate(section.title, 16),
    body: bodyParts.length ? truncate(bodyParts.join(" "), 240) : undefined,
    imageUrl: image.url,
    layout: "image-right" as const,
  };
}

export function buildSectionSlideContent(
  section: PresentationSection
): PresentationSlideContent {
  return {
    sectionDividerTitle: truncate(section.title, 32),
    tableSlides: buildTableSlides(section),
    chartSlides: buildChartSlides(section),
    insightSlides: buildInsightSlides(section),
    imageSlide: buildImageSlide(section),
  };
}

export function buildClosingRecommendations(bundle: DemoPresentationBundle) {
  const items = bundle.sections.flatMap((section) =>
    (section.bullets ?? [])
      .filter((group) => /recommend/i.test(group.label))
      .flatMap((group) => group.items)
  );

  if (items.length === 0) {
    return undefined;
  }

  return chunk(items, CLOSING_ITEMS_PER_SLIDE).map((group) => ({
    items: group.map((item, itemIndex) => ({
      title: truncate(`Priority ${itemIndex + 1}`, 120),
      body: truncate(item, 160),
    })),
  }));
}

export function enrichPresentationBundle(
  bundle: DemoPresentationBundle
): DemoPresentationBundle {
  return {
    ...bundle,
    title: truncate(bundle.title, 24),
    subtitle: "Americas Region · Executive Portfolio Briefing",
    helperText: "The Changing Workplace (CWP)",
    closingSlides: buildClosingRecommendations(bundle),
    sections: bundle.sections.map((section) => ({
      ...section,
      slideContent: buildSectionSlideContent(section),
    })),
  };
}
