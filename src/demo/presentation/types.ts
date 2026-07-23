export type PresentationTable = {
  heading: string;
  columns: string[];
  rows: string[][];
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

export type PresentationSection = {
  id: string;
  title: string;
  intro?: string;
  tables?: PresentationTable[];
  callouts?: PresentationCallout[];
  bullets?: PresentationBullets[];
};

export type DemoPresentationBundle = {
  title: string;
  sections: PresentationSection[];
};
