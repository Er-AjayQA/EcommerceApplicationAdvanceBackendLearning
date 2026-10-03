import { z } from "zod";

export const addressResponseSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    addressType: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string().nullable(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    country: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export type addressResponseDTO = z.infer<typeof addressResponseSchema>;
