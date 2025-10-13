import axios from 'axios';
import { INewsSource, TNewsItem } from '../newsfeed.interface';

export class HackerNewsSource implements INewsSource {
  private readonly baseUrl = 'https://hacker-news.firebaseio.com/v0';
  private readonly topStoriesLimit = 30;

  getName() {
    return 'hackernews' as const;
  }

  async fetch(): Promise<TNewsItem[]> {
    try {
      const topStoryIds = await this.getTopStoryIds();
      const stories = await this.getStoriesDetails(topStoryIds);
      return stories.filter((story) => story !== null) as TNewsItem[];
    } catch (error) {
      console.error('HackerNews fetch error:', error);
      return [];
    }
  }

  private async getTopStoryIds(): Promise<number[]> {
    const response = await axios.get(`${this.baseUrl}/topstories.json`);
    return response.data.slice(0, this.topStoriesLimit);
  }

  private async getStoriesDetails(storyIds: number[]): Promise<(TNewsItem | null)[]> {
    return Promise.all(
      storyIds.map(async (id) => {
        try {
          const response = await axios.get(`${this.baseUrl}/item/${id}.json`);
          const story = response.data;

          if (!story.title || !story.url) return null;

          return {
            title: story.title,
            content: story.title,
            url: story.url,
            source: 'hackernews' as const,
            author: story.by,
            publishedAt: new Date(story.time * 1000),
            fetchedAt: new Date(),
            externalId: String(story.id),
          };
        } catch {
          return null;
        }
      })
    );
  }
}