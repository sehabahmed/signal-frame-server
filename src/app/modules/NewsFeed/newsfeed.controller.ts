import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { NewsFeedService } from "./newsfeed.service";
import httpStatus from "http-status";

const getAllNews = catchAsync(async (req, res) => {
  const news = await NewsFeedService.getNewsFeed(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "News fetched successfully",
    data: news,
  });
});

const getPopularNews = catchAsync(async (req, res) => {
  const { limit } = req.query;
  const news = await NewsFeedService.getPopularNews(limit ? Number(limit) : 20);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Popular news fetched successfully',
    data: news,
  });
});

const getTrendingNews = catchAsync(async (req, res) => {
  const { limit } = req.query;
  const news = await NewsFeedService.getTrendingNews(limit ? Number(limit) : 20);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Trending news fetched successfully',
    data: news,
  });
});

const getNewsBySource = catchAsync(async (req, res) => {
  const { source } = req.params;
  const { limit } = req.query;

  const news = await NewsFeedService.getNewsBySource(
    source,
    limit ? Number(limit) : 20
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "News fetched successfully",
    data: news,
  });
});

const refreshNews = catchAsync(async (req, res) => {
  await NewsFeedService.fetchAllNews();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "News refreshed successfully",
    data: null,
  });
});

const updateScores = catchAsync(async (req, res) => {
  await NewsFeedService.updatePopularityScores();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Popularity scores updated successfully",
    data: null,
  });
});

const getStatistics = catchAsync(async (req, res) => {
  const stats = await NewsFeedService.getNewsStatistics();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Statistics retrieved successfully",
    data: stats,
  });
});

const trackNewsView = catchAsync(async (req, res) => {
    const { id } = req.params;
  await NewsFeedService.trackView(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "View tracked",
    data: null,
  });
});

const trackNewsClick = catchAsync(async (req, res) => {
    const { id } = req.params;
  await NewsFeedService.trackClick(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Click tracked",
    data: null,
  });
});

const trackNewsBookmark = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { bookmarked } = req.body;
  await NewsFeedService.trackBookmark(id, bookmarked);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Bookmark tracked",
    data: null,
  });
});

const trackNewsShare = catchAsync(async (req, res) => {
    const { id } = req.params;
  await NewsFeedService.trackShare(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Share tracked",
    data: null,
  });
});

export const NewsFeedControllers = {
  getAllNews,
  getPopularNews,
  getTrendingNews,
  getNewsBySource,
  refreshNews,
  updateScores,
  getStatistics,
  trackNewsView,
  trackNewsClick,
  trackNewsBookmark,
  trackNewsShare,
};
