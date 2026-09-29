import { z } from "zod";

export const registerUseSchema = z
  .object({
    firstName: z.string().min(3, "First name can't be empty"),
    lastName: z
      .string()
      .min(3, "Username must be atleast 3 character")
      .optional(),
    email: z.email("Email is required"),
    password: z.string().min(6, "Password must be atleast 6 chharacters long"),
    role: z.enum(["USER", "SELLER", "ADMIN"]).optional(),
    phoneNumber: z
      .string()
      .min(6, "Phone number must be minimum 9 digits")
      .max(12, "Phone number can't exceed 12 digits"),
  })
  .strict();

export type registerUserDTO = z.infer<typeof registerUseSchema>;
