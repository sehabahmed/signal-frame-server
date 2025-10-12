/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import config from "../../../config";
import { INewsSource, TNewsItem } from "../newsfeed.interface";

const bearerToken = config.twitter_bearer_token;
const baseUrl = "https://api.twitter.com/2";
const usernames = ["doganuraldesign"] as const;

const getUserId = async (username: string): Promise<string | null> => {
  try {
    const response = await axios.get(
      `${baseUrl}/users/by/username/${username}`,
      { headers: { Authorization: `Bearer ${bearerToken}` } }
    );
    return response.data.data.id;
  } catch (error) {
    console.error(`Failed to get user ID for ${username}:`, error);
    return null;
  }
};

const getUserTweets = async (
  userId: string,
  username: string
): Promise<TNewsItem[]> => {
  try {
    const response = await axios.get(
      `${baseUrl}/users/${userId}/tweets`,
      {
        headers: { Authorization: `Bearer ${bearerToken}` },
        params: {
          max_results: 10,
          "tweet.fields": "created_at,public_metrics",
          expansions: "author_id",
        },
      }
    );

    return (response.data.data || []).map((tweet: any) => ({
      title: tweet.text.substring(0, 100),
      content: tweet.text,
      url: `https://x.com/${username}/status/${tweet.id}`,
      source: "twitter" as const,
      author: username,
      publishedAt: new Date(tweet.created_at),
      fetchedAt: new Date(),
      externalId: tweet.id,
    }));
  } catch (error) {
    console.error(`Failed to fetch tweets for user ${userId}:`, error);
    return [];
  }
};

export const TwitterSource: INewsSource = {
  getName: () => "twitter" as const,

  fetch: async (): Promise<TNewsItem[]> => {
    if (!bearerToken) {
      console.warn("Twitter API token not configured");
      return [];
    }

    const allTweets: TNewsItem[] = [];

    for (const username of usernames) {
      const userId = await getUserId(username);
      if (userId) {
        const tweets = await getUserTweets(userId, username);
        allTweets.push(...tweets);
      }
    }

    return allTweets;
  },
};