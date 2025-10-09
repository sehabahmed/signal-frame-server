import axios from "axios";
import { INewsSource, TNewsItem } from "../newsfeed.interface";

const baseUrl = "https://hacker-news.firebaseio.com/v0";
const topStoriesLimit = 30;

export const HackerNewsSource: INewsSource = {
  getName: () => "hackernews" as const,

  async fetch(): Promise<TNewsItem[]> {
    try {
      const topStoryIds = await getTopStoryIds();
      const stories = await getStoriesDetails(topStoryIds);

      return stories.filter((story): story is TNewsItem => story !== null);
    } catch (error) {
      console.error("HackerNews fetch error:", error);
      return [];
    }
  },
};

// ---- Helper functions ----

async function getTopStoryIds(): Promise<number[]> {
  const response = await axios.get(`${baseUrl}/topstories.json`);
  return response.data.slice(0, topStoriesLimit);
}

async function getStoriesDetails(
  storyIds: number[]
): Promise<(TNewsItem | null)[]> {
  return Promise.all(
    storyIds.map(async (id) => {
      try {
        const response = await axios.get(`${baseUrl}/item/${id}.json`);
        const story = response.data;

        if (!story.title || !story.url) return null;

        return {
          title: story.title,
          content: story.title,
          url: story.url,
          source: "hackernews" as const,
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
