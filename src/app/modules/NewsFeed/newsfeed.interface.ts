export type TNewsSource = 'hackernews' | 'tldr' | 'twitter';

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
  sentiment?: 'positive' | 'neutral' | 'negative';
  createdAt?: Date;
  updatedAt?: Date;
};

export interface INewsSource {
  fetch(): Promise<TNewsItem[]>;
  getName(): TNewsSource;
}