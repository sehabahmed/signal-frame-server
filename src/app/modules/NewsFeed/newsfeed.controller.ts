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

export const NewsFeedControllers = {
    getAllNews,
    getNewsBySource,
    refreshNews,
}
