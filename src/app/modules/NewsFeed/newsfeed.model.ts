import { model, Schema } from "mongoose";
import { TNewsItem } from "./newsfeed.interface";

const newsFeedSchema = new Schema<TNewsItem>(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
      unique: true,
    },
    source: {
      type: String,
      enum: ["hackernews", "tldr", "twitter"],
      required: true,
      index: true,
    },
    author: String,
    imageUrl: String,
    publishedAt: {
      type: Date,
      required: true,
      index: true,
    },
    fetchedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    externalId: String,
    sentiment: {
      type: String,
      enum: ["positive", "neutral", "negative"],
    },

    popularity: {
      score: { type: Number, default: 0, index: true },
      views: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      bookmarks: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      upvotes: { type: Number, default: 0 },
      lastCalculated: { type: Date, default: Date.now },
    },
    sourceMatrics: {
      hackerNewsScore: Number,
      hackerNewsComments: Number,
      twitterLikes: Number,
      twitterRetweets: Number,
      twitterReplies: Number,
    },
  },
  { timestamps: true }
);

//Index for better query performance
newsFeedSchema.index({ source: 1, publishedAt: -1 });
newsFeedSchema.index({ fetchedAt: -1 });
newsFeedSchema.index({ "popularity.score": -1 });
newsFeedSchema.index({ source: 1, "popularity.score": -1 });

export const NewsFeed = model<TNewsItem>("NewsFeed", newsFeedSchema);
