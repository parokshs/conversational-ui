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

export type PresentationInfoItem = {
  title: string;
  description: string;
};

export type PresentationSlideContent = {
  sectionDividerTitle: string;
  tableSlides?: {
    slideTitle: string;
    layout: "horizontal-grid" | "horizontal-list";
    infoItems: PresentationInfoItem[];
  }[];
  chartSlides?: {
    slideTitle: string;
    body?: string;
    layout: "title-body-top" | "title-left";
    chartType: PresentationChart["chartType"];
    categories: string[];
    series: PresentationChart["series"];
    categoryAxisLabel?: string;
    valueAxisLabel?: string;
  }[];
  insightSlides?: {
    slideTitle: string;
    layout: "horizontal-grid";
    infoItems: PresentationInfoItem[];
  }[];
  imageSlide?: {
    slideTitle: string;
    body?: string;
    imageUrl: string;
    layout: "image-right";
  };
};

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
  sections: PresentationSection[];
  closingSlides?: {
    items: { title: string; body: string }[];
  }[];
};
