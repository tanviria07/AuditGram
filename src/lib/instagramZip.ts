import { BlobReader, ZipReader, TextWriter } from '@zip.js/zip.js';
import { AnalysisResponse } from '../types';
import { computeResults } from './compare';

export class HtmlZipError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HtmlZipError';
  }
}

interface InstagramStringListData {
  href?: string;
  value: string;
  timestamp?: number;
}

interface InstagramDataNode {
  string_list_data?: InstagramStringListData[];
  [key: string]: unknown;
}

export function extractUsernames(data: unknown): Set<string> {
  const usernames = new Set<string>();
  const stack: unknown[] = [data];

  while (stack.length > 0) {
    const obj = stack.pop();

    if (Array.isArray(obj)) {
      for (let i = obj.length - 1; i >= 0; i--) {
        stack.push(obj[i]);
      }
    } else if (obj !== null && typeof obj === 'object') {
      const node = obj as InstagramDataNode;
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

export async function analyzeZipFileClientSide(file: File): Promise<AnalysisResponse> {
  let zipReader: ZipReader<any> | null = null;
  
  try {
    const blobReader = new BlobReader(file);
    zipReader = new ZipReader(blobReader);
    const entries = await zipReader.getEntries();
    
    // Check for HTML format
    const hasHtml = entries.some(entry => entry.filename.endsWith('followers_1.html'));
    if (hasHtml) {
      throw new HtmlZipError("It looks like you downloaded HTML format. Please request your data again in JSON format.");
    }

    // Find followers and following files
    const followersFiles = entries.filter(entry => 
      !entry.directory && entry.filename.toLowerCase().includes('followers_') && entry.filename.toLowerCase().endsWith('.json')
    );
    const followingFiles = entries.filter(entry => 
      !entry.directory && entry.filename.toLowerCase().includes('following') && entry.filename.toLowerCase().endsWith('.json')
    );

    if (followersFiles.length === 0 || followingFiles.length === 0) {
      throw new Error("Could not find followers or following JSON files in the ZIP. Make sure you selected 'Followers and Following' when requesting data.");
    }

    const followers = new Set<string>();
    const following = new Set<string>();
    
    // Parse followers files
    for (const entry of followersFiles) {
      if ((entry as any).getData) {
        const fileData = await (entry as any).getData(new TextWriter());
        const jsonData = JSON.parse(fileData);
        const extracted = extractUsernames(jsonData);
        extracted.forEach(username => followers.add(username));
      }
    }

    // Parse following files
    for (const entry of followingFiles) {
      if ((entry as any).getData) {
        const fileData = await (entry as any).getData(new TextWriter());
        const jsonData = JSON.parse(fileData);
        const extracted = extractUsernames(jsonData);
        extracted.forEach(username => following.add(username));
      }
    }

    return computeResults(followers, following);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while processing the ZIP file.");
  } finally {
    if (zipReader) {
      await zipReader.close();
    }
  }
}

export async function analyzeJsonFiles(followersFile: File, followingFile: File): Promise<AnalysisResponse> {
  try {
    const followersData = JSON.parse(await followersFile.text());
    const followingData = JSON.parse(await followingFile.text());

    const followers = extractUsernames(followersData);
    const following = extractUsernames(followingData);

    return computeResults(followers, following);
  } catch (error) {
    throw new Error("Failed to parse JSON files. Please make sure they are valid Instagram data files.");
  }
}

export function analyzePastedText(followersText: string, followingText: string): AnalysisResponse {
  const parseLines = (text: string) => new Set(text.split('\n').map(line => line.trim().replace(/^@/, '')).filter(Boolean));
  
  const followers = parseLines(followersText);
  const following = parseLines(followingText);

  return computeResults(followers, following);
}
