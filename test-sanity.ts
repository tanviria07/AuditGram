import { extractUsernames } from './src/lib/instagramZip.ts';
import { computeResults } from './src/lib/compare.ts';

function testLogic() {
  const fakeData = [{
    string_list_data: [{ value: 'userA' }, { value: 'userB' }],
    nested: {
      string_list_data: [{ value: 'userC' }]
    }
  }];
  
  const fakeFollowingData = [{
    string_list_data: [{ value: 'userA' }, { value: 'userD' }],
  }];

  const followers = extractUsernames(fakeData);
  const following = extractUsernames(fakeFollowingData);

  console.log('Followers:', Array.from(followers));
  console.log('Following:', Array.from(following));
  
  const results = computeResults(followers, following);
  console.log('Results:', results);
}

testLogic();
