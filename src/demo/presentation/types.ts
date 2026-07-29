import type { CwpSkillReference } from "./cwpSkillLoader";

export type { CwpSkillReference };

export type PresentationTable = {
  heading: string;
  columns: string[];
  rows: string[][];
};

export type PresentationChart = {
  heading: string;
  chartType: "horizontalBar" | "groupedBar" | "bar" | "line" | "pie" | "area";
  categories: string[];
  series: {
    name: string;
    values: number[];
  }[];
  categoryAxisLabel?: string;
  valueAxisLabel?: string;
};

export type PresentationHighlight = {
  label: string;
  value: string;
  caption?: string;
};

export type PresentationCallout = {
  label: string;
  tone: "red" | "green" | "neutral";
  items: string[];
};

export type PresentationBullets = {
  label: string;
  items: string[];
};

export type PresentationImage = {
  url: string;
  alt?: string;
  caption?: string;
};

export type PresentationInsightItem = {
  iconName: string;
  iconCategory: string;
  primaryText: string;
};

export type CwpSlideType = "metrics-overview" | "insight" | "action-plan";

export type ChartContentLayout =
  | "title-body-left"
  | "title-body-bottom"
  | "title-body-top"
  | "title-left";

export type PresentationContentSlide =
  | {
      slideType: "metrics-overview" | "insight";
      template: "chart-with-context";
      slideTitle: string;
      body: string;
      layout: ChartContentLayout;
      chartType: PresentationChart["chartType"];
      categories: string[];
      series: PresentationChart["series"];
      categoryAxisLabel?: string;
      valueAxisLabel?: string;
      chartColors: string[];
      chartHorizontal?: boolean;
    }
  | {
      slideType: "insight";
      template: "list-with-image";
      slideTitle: string;
      insightItems: PresentationInsightItem[];
      imageUrl: string;
    };

export type PresentationSlideContent = {
  contentSlide: PresentationContentSlide;
};

export type PresentationActionPlanSlide = {
  slideTitle: string;
  items: { title: string; body: string }[];
};

export type CwpSkillAssetReference = {
  relativePath: string;
  absolutePath: string;
  exists: boolean;
  fileName: string;
};

/** @deprecated Use CwpSkillReference from cwpSkillLoader */
export type CwpTemplateReference = CwpSkillReference;

export type PresentationSection = {
  id: string;
  title: string;
  intro?: string;
  highlights?: PresentationHighlight[];
  tables?: PresentationTable[];
  charts?: PresentationChart[];
  callouts?: PresentationCallout[];
  bullets?: PresentationBullets[];
  images?: PresentationImage[];
  slideContent?: PresentationSlideContent;
};

export type DemoPresentationBundle = {
  title: string;
  subtitle?: string;
  helperText?: string;
  templateReference?: CwpSkillReference;
  sections: PresentationSection[];
  actionPlanSlide?: PresentationActionPlanSlide;
};
