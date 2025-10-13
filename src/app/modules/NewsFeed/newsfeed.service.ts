import { TNewsItem } from "./newsfeed.interface";
import { NewsFeed } from "./newsfeed.model";

// Helper function to save news items
const saveNewsItems = async (items: TNewsItem[]): Promise<void> => {
  for (const item of items) {
    try {
      await NewsFeed.updateOne(
        { externalId: item.externalId, source: item.source },
        item,
        { upsert: true }
      );
    } catch (error) {
      console.error("Error saving news item:", error);
    }
  }
};

// Fetch all news from configured sources

const fetchAllNews = async (): Promise<void> => {
  const sources = NewsSourceFactory.createAllSources();

  const results = await Promise.allSettled()
};
