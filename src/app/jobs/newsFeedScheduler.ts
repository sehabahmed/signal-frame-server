import { NewsFeedService } from "../modules/NewsFeed/newsfeed.service";
import cron from "node-cron";

export const startNewsFeedScheduler = () => {
  // Run every 2 hours
  cron.schedule("0 */2 * * *", async () => {
    console.log("Running Scheduled news fetch...");

    await NewsFeedService.fetchAllNews();
  });

  // Update popularity scores every hour
  cron.schedule("0 * * * *", async () => {
    console.log("Scheduled: Updating scores...");
    await NewsFeedService.updatePopularityScores();
  });

  // Delete old news daily at 1 AM
  cron.schedule("0 1 * * *", async () => {
    console.log("Scheduled: Cleaning old news...");
    await NewsFeedService.deleteOldNews(7);
  });

  console.log("News feed scheduler started");
};
