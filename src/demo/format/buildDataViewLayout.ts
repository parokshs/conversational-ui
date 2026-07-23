import type { PresentationChart } from "../presentation/types";

const chartRenderHints: Record<PresentationChart["chartType"], string> = {
  pie: 'PieChart (categoryKey, dataKey, data rows from categories + series[0].values)',
  horizontalBar: 'BarChartV2 with type "horizontal"',
  groupedBar: 'BarChartV2 with variant "grouped" and type "normal"',
  bar: 'BarChartV2 with type "normal"',
  line: 'LineChartV2 with type "normal" (multiple series when provided)',
  area: "AreaChart with categoryKey and data rows",
};

export function buildTableGraphTabsLayout({
  tableSource,
  tableColumns,
  chartIndex = 0,
}: {
  tableSource: string;
  tableColumns: string;
  chartIndex?: number;
}) {
  const chartRef = `DATA.charts[${chartIndex}]`;

  return [
    `Place the primary dataset inside a Tabs component (not SectionBlock) with exactly two tabs:`,
    `- value "table", trigger text "Table view": render a sortable Table from ${tableSource} with columns ${tableColumns}.`,
    `- value "graph", trigger text "Graph view": render ${chartRef} using the chart component that matches ${chartRef}.chartType (${Object.entries(
      chartRenderHints
    )
      .map(([type, hint]) => `${type} → ${hint}`)
      .join("; ")}).`,
    "Show only one tab at a time — do NOT stack the table and chart vertically.",
    `Use ${chartRef}.heading as the chart title inside the graph tab.`,
  ];
}
