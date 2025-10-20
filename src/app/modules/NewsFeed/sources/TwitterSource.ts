/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { INewsSource, TNewsItem } from '../newsfeed.interface';

export class TwitterSource implements INewsSource {
  private readonly bearerToken = process.env.TWITTER_BEARER_TOKEN;
  private readonly baseUrl = 'https://api.twitter.com/2';
  private readonly usernames = ['doganuraldesign', 'TheAIColony'];

  getName() {
    return 'twitter' as const;
  }

  async fetch(): Promise<TNewsItem[]> {
    if (!this.bearerToken) {
      console.warn('Twitter API token not configured');
      return [];
    }

    try {
      const allTweets: TNewsItem[] = [];

      for (const username of this.usernames) {
        const userId = await this.getUserId(username);
        if (userId) {
          const tweets = await this.getUserTweets(userId, username);
          allTweets.push(...tweets);
        }
      }

      return allTweets;
    } catch (error) {
      console.error('Twitter fetch error:', error);
      return [];
    }
  }

  private async getUserId(username: string): Promise<string | null> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/users/by/username/${username}`,
        {
          headers: { Authorization: `Bearer ${this.bearerToken}` },
        }
      );
      return response.data.data.id;
    } catch (error) {
      console.error(`Failed to get user ID for ${username}:`, error);
      return null;
    }
  }

  private async getUserTweets(userId: string, username: string): Promise<TNewsItem[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/users/${userId}/tweets`, {
        headers: { Authorization: `Bearer ${this.bearerToken}` },
        params: {
          max_results: 10,
          'tweet.fields': 'created_at,public_metrics',
          expansions: 'author_id',
        },
      });

      return (response.data.data || []).map((tweet: any) => ({
        title: tweet.text.substring(0, 100),
        content: tweet.text,
        url: `https://x.com/${username}/status/${tweet.id}`,
        source: 'twitter' as const,
        author: username,
        publishedAt: new Date(tweet.created_at),
        fetchedAt: new Date(),
        externalId: tweet.id,
      }));
    } catch (error) {
      console.error(`Failed to fetch tweets for user ${userId}:`, error);
      return [];
    }
  }
}