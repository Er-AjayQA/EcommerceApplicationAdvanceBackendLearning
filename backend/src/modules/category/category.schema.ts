import { z } from "zod";

export const createCategorySchema = z
  .object({
    categoryName: z
      .string()
      .min(3, "Category name should be atleast 3 characters"),
    categoryDescription: z.string(),
  })
  .strict();

export type createCategoryDTO = z.infer<typeof createCategorySchema>;
