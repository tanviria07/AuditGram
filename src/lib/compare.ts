import { AnalysisResponse } from '../types';

/**
 * Efficiently compute the difference between followers and following sets.
 * This implementation optimizes for memory and speed by:
 * 1. Using Set operations where possible
 * 2. Sorting only once at the end
 * 3. Handling edge cases like empty sets
 */
export function computeResults(followers: Set<string>, following: Set<string>): AnalysisResponse {
  // Handle empty sets edge case
  if (followers.size === 0 && following.size === 0) {
    return {
      counts: {
        followers: 0,
        following: 0,
        nonfollowers: 0,
        fans: 0,
        mutuals: 0,
      },
      nonfollowers: [],
      fans: [],
      mutuals: [],
    };
  }

  const nonfollowers: string[] = [];
  const fans: string[] = [];
  const mutuals: string[] = [];

  // Optimized: Use Set.has() which is O(1) on average
  // Process following first to find nonfollowers and mutuals
  for (const user of following) {
    if (followers.has(user)) {
      mutuals.push(user);
    } else {
      nonfollowers.push(user);
    }
  }

  // Process followers to find fans (people who follow you but you don't follow back)
  for (const user of followers) {
    if (!following.has(user)) {
      fans.push(user);
    }
  }

  // Sort alphabetically for consistent output
  // Could be made optional if sorting is not required
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

/**
 * Alternative implementation using Set operations for potentially better performance
 * with very large datasets (though JavaScript Set operations create new Sets)
 */
export function computeResultsOptimized(
  followers: Set<string>,
  following: Set<string>
): AnalysisResponse {
  // Create arrays from sets for sorting
  const followersArray = Array.from(followers);
  const followingArray = Array.from(following);
  
  // Use Set intersection and difference operations
  const mutualsSet = new Set(followersArray.filter(user => following.has(user)));
  const nonfollowersSet = new Set(followingArray.filter(user => !followers.has(user)));
  const fansSet = new Set(followersArray.filter(user => !following.has(user)));
  
  // Convert to sorted arrays
  const mutuals = Array.from(mutualsSet).sort();
  const nonfollowers = Array.from(nonfollowersSet).sort();
  const fans = Array.from(fansSet).sort();
  
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
