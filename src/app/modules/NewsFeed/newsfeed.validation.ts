import { z } from "zod";

const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-./?%&=]*)?$/i;

export const createNewsFeedValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  url: z.string().regex(urlRegex, "Invalid URL").min(1, "URL is required"),

  source: z
    .enum(["hackernews", "tldr", "twitter"])
    .refine((val) => !!val, { message: "Source is required" }),

  author: z.string().optional(),
  imageUrl: z.string().regex(urlRegex, "Invalid URL").optional(),

  externalId: z.string().optional(),

  sentiment: z.enum(["positive", "neutral", "negative"]).optional(),

  popularity: z
    .object({
      score: z.number().default(0),
      views: z.number().default(0),
      clicks: z.number().default(0),
      shares: z.number().default(0),
      bookmarks: z.number().default(0),
      comments: z.number().default(0),
      upvotes: z.number().default(0),
      lastCalculated: z
        .preprocess(
          (val) => (val ? new Date(val as string) : new Date()),
          z.date()
        )
        .default(() => new Date()),
    })
    .partial()
    .default({}),

  sourceMatrics: z
    .object({
      hackerNewsScore: z.number().optional(),
      hackerNewsComments: z.number().optional(),
      twitterLikes: z.number().optional(),
      twitterRetweets: z.number().optional(),
      twitterReplies: z.number().optional(),
    })
    .optional(),
}); 

export const updateNewsFeedValidationSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  content: z.string().min(1, "Content is required").optional(),
  url: z.string().regex(urlRegex, "Invalid URL").min(1, "URL is required").optional(),

  source: z
    .enum(["hackernews", "tldr", "twitter"])
    .refine((val) => !!val, { message: "Source is required" })
    .optional(),

  author: z.string().optional(),
  imageUrl: z.string().regex(urlRegex, "Invalid URL").optional(),

  publishedAt: z
    .preprocess((val) => (val ? new Date(val as string) : undefined), z.date())
    .refine((date) => date === undefined || !isNaN(date.getTime()), "Invalid published date")
    .optional(),

  fetchedAt: z
    .preprocess((val) => (val ? new Date(val as string) : undefined), z.date())
    .optional(),

  externalId: z.string().optional(),

  sentiment: z.enum(["positive", "neutral", "negative"]).optional(),

  popularity: z
    .object({
      score: z.number().optional(),
      views: z.number().optional(),
      clicks: z.number().optional(),
      shares: z.number().optional(),
      bookmarks: z.number().optional(),
      comments: z.number().optional(),
      upvotes: z.number().optional(),
      lastCalculated: z
        .preprocess(
          (val) => (val ? new Date(val as string) : undefined),
          z.date()
        )
        .optional(),
    })
    .partial()
    .optional(),

  sourceMatrics: z
    .object({
      hackerNewsScore: z.number().optional(),
      hackerNewsComments: z.number().optional(),
      twitterLikes: z.number().optional(),
      twitterRetweets: z.number().optional(),
      twitterReplies: z.number().optional(),
    })
    .optional(),
});

// ✅ Type inference (for use with TypeScript)
export type TCreateNewsFeedInput = z.infer<typeof createNewsFeedValidationSchema>;
export type TUpdateNewsFeedInput = z.infer<typeof updateNewsFeedValidationSchema>;
