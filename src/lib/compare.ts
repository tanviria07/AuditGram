import { AnalysisResponse } from '../types';

export function computeResults(followers: Set<string>, following: Set<string>): AnalysisResponse {
  const nonfollowers: string[] = [];
  const fans: string[] = [];
  const mutuals: string[] = [];

  for (const user of following) {
    if (followers.has(user)) {
      mutuals.push(user);
    } else {
      nonfollowers.push(user);
    }
  }

  for (const user of followers) {
    if (!following.has(user)) {
      fans.push(user);
    }
  }

  nonfollowers.sort();
  fans.sort();
  mutuals.sort();

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
