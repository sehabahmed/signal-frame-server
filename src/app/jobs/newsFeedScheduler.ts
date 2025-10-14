import { NewsFeedService } from "../modules/NewsFeed/newsfeed.service";
import cron from "node-cron";

export const startNewsFeedScheduler = () => {
  // Run every 2 hours
  cron.schedule("0 */2 * * *", async () => {
    console.log("Running Scheduled news fetch...");

    await NewsFeedService.fetchAllNews();
    await NewsFeedService.deleteOldNews(30);
  });

  console.log("News feed scheduler started");
};
