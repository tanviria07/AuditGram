export interface Counts {
  followers: number;
  following: number;
  nonfollowers: number;
  fans: number;
  mutuals: number;
}

export interface AnalysisResponse {
  counts: Counts;
  nonfollowers: string[];
  fans: string[];
  mutuals: string[];
}
