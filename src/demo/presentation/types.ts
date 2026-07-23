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
};

export type DemoPresentationBundle = {
  title: string;
  sections: PresentationSection[];
};
