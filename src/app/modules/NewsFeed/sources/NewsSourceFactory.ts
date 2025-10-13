import { INewsSource } from '../newsfeed.interface';
import { HackerNewsSource } from './HackerNewsSource';
import { TldrNewsSource } from './TldrNewsSource';
import { TwitterSource } from './TwitterSource';

// Type for source constructor
type SourceConstructor = new () => INewsSource;

// Map of available sources
const sourcesMap: Record<string, SourceConstructor> = {
  hackernews: HackerNewsSource,
  tldr: TldrNewsSource,
  twitter: TwitterSource,
};

// Create instances of all available news sources
const createAllSources = (): INewsSource[] => {
  return Object.values(sourcesMap).map((SourceClass) => new SourceClass());
};

// Create a specific news source by name
const createSource = (sourceName: string): INewsSource | null => {
  const SourceClass = sourcesMap[sourceName.toLowerCase()];

  if (!SourceClass) {
    console.warn(`Unknown news source: ${sourceName}`);
    return null;
  }

  return new SourceClass();
};

// Get list of available source names
const getAvailableSourceNames = (): string[] => {
  return Object.keys(sourcesMap);
};

// Check if a source exists
const isSourceAvailable = (sourceName: string): boolean => {
  return sourceName.toLowerCase() in sourcesMap;
};

// Export factory functions
export const NewsSourceFactory = {
  createAllSources,
  createSource,
  getAvailableSourceNames,
  isSourceAvailable,
};