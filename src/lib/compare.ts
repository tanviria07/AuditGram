import { AnalysisResponse } from '../types';

export function computeResults(followers: Set<string>, following: Set<string>): AnalysisResponse {
  const nonfollowers = Array.from(following).filter(user => !followers.has(user)).sort();
  const fans = Array.from(followers).filter(user => !following.has(user)).sort();
  const mutuals = Array.from(followers).filter(user => following.has(user)).sort();

  return {
    counts: {
      followers: followers.size,
      following: following.size,
      nonfollowers: nonfollowers.length,
      fans: fans.length,
      mutuals: mutuals.length,
    },
    nonfollowers,
    fans,
    mutuals,
  };
}
