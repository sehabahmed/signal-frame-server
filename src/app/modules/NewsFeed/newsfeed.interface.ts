export type TNewsSource = "hackernews" | "tldr" | "twitter";

export type TNewsItem = {
  title: string;
  content: string;
  url: string;
  source: TNewsSource;
  author?: string;
  imageUrl?: string;
  publishedAt: Date;
  fetchedAt: Date;
  externalId?: string;
  sentiment?: "positive" | "neutral" | "negative";
  popularity?: {
    score: number;
    views: number;
    clicks: number;
    shares: number;
    bookmarks: number;
    comments: number;
    upvotes: number;
    lastCalculated: Date;
  };
  sourceMatrics?: {
    hackerNewsScore?: number;
    hackerNewsComments?: number;
    twitterLikes?: number;
    twitterRetweets?: number;
    twitterReplies?: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

export interface INewsSource {
  fetch(): Promise<TNewsItem[]>;
  getName(): TNewsSource;
}
