function extractUsernamesOriginal(data: unknown): Set<string> {
  const usernames = new Set<string>();

  function traverse(obj: unknown) {
    if (Array.isArray(obj)) {
      for (const item of obj) {
        traverse(item);
      }
    } else if (obj !== null && typeof obj === 'object') {
      const node = obj as any;
      if (Array.isArray(node.string_list_data)) {
        for (const item of node.string_list_data) {
          if (item && typeof item === 'object' && typeof item.value === 'string') {
            usernames.add(item.value);
          }
        }
      }
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          traverse((obj as Record<string, unknown>)[key]);
        }
      }
    }
  }

  traverse(data);
  return usernames;
}

function extractUsernamesOptimized(data: unknown): Set<string> {
    const usernames = new Set<string>();
    const stack: unknown[] = [data];

    while (stack.length > 0) {
        const obj = stack.pop();

        if (Array.isArray(obj)) {
            // Push arrays correctly
            for (let i = obj.length - 1; i >= 0; i--) {
                stack.push(obj[i]);
            }
        } else if (obj !== null && typeof obj === 'object') {
            const node = obj as any;

            if (Array.isArray(node.string_list_data)) {
                for (const item of node.string_list_data) {
                    if (item && typeof item === 'object' && typeof item.value === 'string') {
                        usernames.add(item.value);
                    }
                }
            }

            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key) && key !== 'string_list_data') {
                    stack.push((obj as Record<string, unknown>)[key]);
                }
            }
        }
    }

    return usernames;
}

function runTests() {
  console.log("Generating large fake dataset...");
  const fakeData: any = [];
  for (let i = 0; i < 50000; i++) {
    fakeData.push({
      title: `user${i}`,
      string_list_data: [{ href: `link${i}`, value: `user${i}`, timestamp: 123456 }],
      media_list_data: [],
      other_stuff: {
        a: 1,
        b: 2,
        c: {
            deep: 'value'
            // no string_list_data here
        }
      }
    });
  }

  console.log("Testing original implementation...");
  console.time('original');
  const followersOriginal = extractUsernamesOriginal(fakeData);
  console.timeEnd('original');
  console.log('Original result:', followersOriginal.size);

  console.log("Testing optimized implementation...");
  console.time('optimized');
  const followersOptimized = extractUsernamesOptimized(fakeData);
  console.timeEnd('optimized');
  console.log('Optimized result:', followersOptimized.size);
}

runTests();
