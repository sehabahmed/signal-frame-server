import z from "zod";

// Zod schema for creating a new test
const createTestSchema = z.object({
  body: z.object({
    test: z.string().min(1, "Test field is required"),
    test2: z.number({
      message: "Test2 must be a number",
    }),
    tests: z
      .array(z.string().min(1, "Each test item must be a non-empty string"))
      .min(1, "Tests array must contain at least one item"),
  }),
});

export const TestValidations = { createTestSchema };
