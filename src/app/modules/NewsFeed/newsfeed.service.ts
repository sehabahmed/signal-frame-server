import { TNewsItem } from "./newsfeed.interface";
import { NewsFeed } from "./newsfeed.model";
import { NewsSourceFactory } from "./sources/NewsSourceFactory";

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

  const results = await Promise.allSettled(
    sources.map((source) => source.fetch())
  );

  let totalFetched = 0;
  for (const result of results) {
    if (result.status === "fulfilled") {
      await saveNewsItems(result.value);
      totalFetched += result.value.length;
    }
  }
  console.log(`Fetched ${totalFetched} news items from all sources`);
};


