import { z } from "zod";

export const createCartSchema = z
  .object({
    productId: z.string(),
    quantity: z.number().min(1, "Minimum quantity should be atleast 1"),
  })
  .strict();

export type createCartDTO = z.infer<typeof createCartSchema>;
