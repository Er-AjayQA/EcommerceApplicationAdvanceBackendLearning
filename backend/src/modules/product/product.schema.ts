import { z } from "zod";

export const createProductSchema = z
  .object({
    categoryId: z.string(),
    productName: z
      .string()
      .min(2, "Product name must be atleast 2 characters long"),
    productDescription: z
      .string()
      .min(5, "Product description must be atleast 5 characters long"),
    price: z.string(),
    stock: z.string(),
  })
  .strict();

export const updateProductSchema = z
  .object({
    categoryId: z.string().optional(),
    productName: z
      .string()
      .min(2, "Product name must be atleast 2 characters long")
      .optional(),
    productDescription: z
      .string()
      .min(5, "Product description must be atleast 5 characters long")
      .optional(),
    price: z.string().optional(),
    stock: z.string().optional(),
    keepImageUrls: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((v) => (typeof v === "string" ? [v] : v)),
  })
  .strict();

export type createProductDTO = z.infer<typeof createProductSchema>;
export type updateProductDTO = z.infer<typeof updateProductSchema>;
