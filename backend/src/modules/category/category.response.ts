import { z } from "zod";

export const categoryResponseSchema = z
  .object({
    id: z.string(),
    categoryName: z.string(),
    categoryDescription: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type categoryResponseDTO = z.infer<typeof categoryResponseSchema>;
