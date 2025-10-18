import { QueryBuilder } from "../../builder/QueryBuilder";
import { TNewsItem } from "./newsfeed.interface";
import { NewsFeed } from "./newsfeed.model";
import { NewsSourceFactory } from "./sources/NewsSourceFactory";

// =================================
// POPULARITY CALCULATION UTILITIES
// =================================

/**
 * Calculate popularity score based on multiple factors
 * Score range: 0-100
 *
 * Factors considered:
 * 1. Source engagement (upvotes, comments, shares) - 40%
 * 2. Internal engagement (views, clicks, bookmarks) - 30%
 * 3. Recency (time decay factor) - 20%
 * 4. Author reputation - 10%
 */

const calculatePopularityScore = (news: TNewsItem): number => {
  const now = new Date().getTime();
  const publishedTime = new Date(news.publishedAt).getTime();
  const ageInHours = (now - publishedTime) / (1000 * 60 * 60);

  // 1. source Engagement Score (0-40 points)
  const sourceScore = calculateSourceEngagement(news);

  // 2. Internal Engagement Score (0-30 points)
  const internalScore = calculateInternalEngagement(news);

  // 3. Recency Score (0-20 points) - Time decay
  const recencyScore = calculateRecencyScore(ageInHours);

  // 4. Author Reputation Score (0-10 points)
  const authorScore = calculateAuthorScore(news);

  const totalScore = sourceScore + internalScore + recencyScore + authorScore;

  return Math.min(Math.round(totalScore), 100);
};

// Calculate engagemenet  from external sources

const calculateSourceEngament = (news: TNewsItem): number => {
  const { upvotes = 0, comments = 0, shares = 0 } = news.popularity || {};

  // Differenet sources have different engagement scales

  let normalizedScore = 0;

  switch (news.source) {
    case "hackernews":
      // HN: High upvotes (100+) and comments (50+) are very popular
      normalizedScore = Math.min(upvotes / 10 + comments / 5, 40);
      break;

    case "twitter":
      // Twitter: Likes (1000+) and retweets (100+) indicate popularity
      normalizedScore = Math.min(
        upvotes / 100 + shares / 10 + comments / 20,
        40
      );
      break;

    case "tldr":
      // TLDR: Curated content, base score
      normalizedScore = 20;
      break;

    default:
      normalizedScore = upvotes / 50 + comments / 10 + shares / 5;
  }

  return Math.min(normalizedScore, 40);
};

// Calculate internal user engagement
const calculateInternalEngagement = (news: TNewsItem): number => {
  const { views = 0, clicks = 0, bookmarks = 0 } = news.popularity || {};

  // CTR (click-Through Rate) is important
  const ctr = views > 0 ? clicks / views : 0;

  const viewScore = Math.min(views / 10, 10);
  const clickScore = Math.min(clicks / 5, 10);
  const bookmarkScore = Math.min(bookmarks * 2, 5);
  const ctrBonus = ctr * 5;

  return Math.min(viewScore + clickScore + bookmarkScore + ctrBonus, 30);
};

// calculate recency score with time decay
const calculateRecencyScore = (ageInHours: number): number => {
  // Exponential decay formula
  // Fresh content (< 6 hours) gets full score
  // After 24 hours, score drops to ~50%
  // After 72 hours, score drops to ~20%

  if (ageInHours < 6) return 20;
  if (ageInHours < 24) return 15;
  if (ageInHours < 48) return 10;
  if (ageInHours < 72) return 5;
  return 2;
};

// Calculate author reputation score
const calculateAuthorScore = (news: TNewsItem) => {
  // TODO: Implement author reputation system
  // For now, return base score
  return news.author ? 5 : 0;
};

// Update popularity scores for all news items
const updatePopularityScores = async (): Promise<void> => {
  const news = await NewsFeed.find({});

  let updated = 0;

  for (const item of news) {
    const newScore = calculatePopularityScore(item);

    await NewsFeed.updateOne(
      { _id: item._id },
      {
        $set: {
          "popularity.score": newScore,
          "popularity.lastCalculated": new Date(),
        },
      }
    );

    updated++;
  }

  console.log(`Updated popularity scores for ${updated} news items`);
};

// =========================
// News Tracking Utilities
// =========================

// Track when a user views a news item
const trackView = async (newsId: string): Promise<void> => {
  await NewsFeed.updateOne(
    { _id: newsId },
    { $inc: { "popularity.views": 1 } }
  );
};

// Track when a user clicks on a news item
const trackClick = async (newsId: string): Promise<void> => {
  await NewsFeed.updateOne(
    { _id: newsId },
    { $inc: { "popularity.clicks": 1 } }
  );
};

// Track when a user bookmarks a news item
const trackBookmark = async (
  newsId: string,
  isBookmarked: boolean
): Promise<void> => {
  await NewsFeed.updateOne(
    { _id: newsId },
    { $inc: { "popularity.bookmarks": isBookmarked ? 1 : -1 } }
  );
};



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
