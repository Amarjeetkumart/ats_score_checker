export type KeywordFrequency = {
  keyword: string;
  count: number;
};

export type ScoreTrendPoint = {
  date: string;
  average_score: number;
  submissions: number;
};

export type AnalyticsSummary = {
  total_resumes: number;
  average_score: number;
  keywords: KeywordFrequency[];
  score_trends: ScoreTrendPoint[];
};
