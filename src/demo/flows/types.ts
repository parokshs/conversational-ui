export type StagedFlow = {
  id: string;
  keywords: string[];
  responseFile: string;
  thinking?: {
    title: string;
    description: string;
  };
};
