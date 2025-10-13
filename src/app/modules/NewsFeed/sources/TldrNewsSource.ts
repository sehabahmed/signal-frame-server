/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { INewsSource, TNewsItem } from '../newsfeed.interface';

export class TldrNewsSource implements INewsSource {
  private readonly rssUrl = 'https://tldr.tech/api/news';

  getName() {
    return 'tldr' as const;
  }

  async fetch(): Promise<TNewsItem[]> {
    try {
      const response = await axios.get(this.rssUrl);
      const articles = response.data.articles || [];

      return articles.slice(0, 20).map((article: any) => ({
        title: article.title,
        content: article.summary || article.description,
        url: article.link || article.url,
        source: 'tldr' as const,
        author: article.author || 'TLDR',
        imageUrl: article.imageUrl,
        publishedAt: new Date(article.publishedAt),
        fetchedAt: new Date(),
        externalId: article.id,
      }));
    } catch (error) {
      console.error('TLDR fetch error:', error);
      return [];
    }
  }
}
