import { z } from "zod";

export const createCategorySchema = z
  .object({
    categoryName: z
      .string()
      .min(2, "Category name should be atleast 2 characters"),
    categoryDescription: z
      .string()
      .min(2, "Category name should be atleast 2 characters"),
  })
  .strict();

export const updateCategorySchema = z
  .object({
    categoryName: z
      .string()
      .min(2, "Category name should be atleast 2 characters")
      .optional(),
    categoryDescription: z
      .string()
      .min(2, "Category name should be atleast 2 characters")
      .optional(),
  })
  .strict();

export type createCategoryDTO = z.infer<typeof createCategorySchema>;
export type updateCategoryDTO = z.infer<typeof updateCategorySchema>;
