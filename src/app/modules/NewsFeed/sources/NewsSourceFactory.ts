import { INewsSource } from "../newsfeed.interface";
import { HackerNewsSource } from "./HackerNewsSource";
import { TldrNewsSource } from "./TldrNewsSource";
import { TwitterSource } from "./TwitterSource";

// Create all sources
export const createAllSources = (): INewsSource[] => {
  return [HackerNewsSource, TldrNewsSource, TwitterSource];
};

// Create a specific source based on the source name
export const createSource = (sourceName: string): INewsSource | null => {
  switch (sourceName.toLowerCase()) {
    case "hackernews":
      return HackerNewsSource;
    case "tldr":
      return TldrNewsSource;
    case "twitter":
      return TwitterSource;
    default:
      return null;
  }
};
