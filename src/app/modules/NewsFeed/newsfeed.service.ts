import { QueryBuilder } from "../../builder/QueryBuilder";
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

// Get filtered news feed with pagination and sorting

const getNewsFeed = async (
  query: Record<string, unknown>
): Promise<TNewsItem[]> => {
  const newsQuery = new QueryBuilder(NewsFeed.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  return await newsQuery.modelQuery;
};

// Get News by specific source
const getNewsBySource = async (
  source: string,
  limit = 20
): Promise<TNewsItem[]> => {
  return await NewsFeed.find({ source }).sort({ publishedAt: -1 }).limit(limit);
};

// Delete news older than specified days
const deleteOldNews = async (daysOld: 30): Promise<void> => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const result = await NewsFeed.deleteMany({
    fetchedAt: { $lt: cutoffDate },
  });

  console.log(`Deleted ${result.deletedCount} old news items`);
};

export const NewsFeedService = {
  fetchAllNews,
  saveNewsItems,
  getNewsFeed,
  getNewsBySource,
  deleteOldNews,
};
