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
  },
  { timestamps: true }
);

//Index for better query performance
newsFeedSchema.index({ source: 1, publishedAt: -1 });
newsFeedSchema.index({ fetchedAt: -1 });

export const NewsFeed = model<TNewsItem>("NewsFeed", newsFeedSchema);
