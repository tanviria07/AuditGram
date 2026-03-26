import JSZip from 'jszip';
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

  function traverse(obj: unknown) {
    if (Array.isArray(obj)) {
      for (const item of obj) {
        traverse(item);
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
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          traverse((obj as Record<string, unknown>)[key]);
        }
      }
    }
  }

  traverse(data);
  return usernames;
}

export async function analyzeZipFileClientSide(file: File): Promise<AnalysisResponse> {
  const zip = new JSZip();
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadedZip = await zip.loadAsync(arrayBuffer);
    
    // Check for HTML format
    const hasHtml = Object.keys(loadedZip.files).some(name => name.endsWith('followers_1.html'));
    if (hasHtml) {
      throw new HtmlZipError("It looks like you downloaded HTML format. Please request your data again in JSON format.");
    }

    // Find followers and following files
    const followersFiles = Object.keys(loadedZip.files).filter(name => 
      name.toLowerCase().includes('followers_') && name.toLowerCase().endsWith('.json')
    );
    const followingFile = Object.keys(loadedZip.files).find(name => 
      name.toLowerCase().includes('following.json')
    );

    if (followersFiles.length === 0 || !followingFile) {
      throw new Error("Could not find followers or following JSON files in the ZIP. Make sure you selected 'Followers and Following' when requesting data.");
    }

    const followers = new Set<string>();
    
    // Parse followers files
    for (const fileName of followersFiles) {
      const fileData = await loadedZip.file(fileName)!.async('string');
      const jsonData = JSON.parse(fileData);
      const extracted = extractUsernames(jsonData);
      extracted.forEach(username => followers.add(username));
    }

    // Parse following file
    const followingFileData = await loadedZip.file(followingFile)!.async('string');
    const followingJsonData = JSON.parse(followingFileData);
    const following = extractUsernames(followingJsonData);

    return computeResults(followers, following);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while processing the ZIP file.");
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
