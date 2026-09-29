import { z } from "zod";
import { Role } from "../../generated/prisma/enums.js";

export const authResponseSchema = z.object({
  id: z.uuid(),
  firstName: z.string(),
  lastName: z.string().nullable(),
  email: z.string(),
  phoneNumber: z.string(),
  role: Role,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type authResponseDTO = z.infer<typeof authResponseSchema>;
