import { z } from "zod";

export const createAddressSchema = z
  .object({
    addressType: z.string().min(1, "Address type can't be empty"),
    addressLine1: z.string().min(1, "Address line can't be empty"),
    addressLine2: z.string().optional(),
    city: z.string().min(1, "City can't be empty"),
    state: z.string().min(1, "State can't be empty"),
    pincode: z.string().min(5, "Pincode should be atleast 5 characters"),
    country: z.string().min(1, "Country can't be empty"),
  })
  .strict();

export const updateAddressSchema = z
  .object({
    addressType: z.string().min(1, "Address type can't be empty").optional(),
    addressLine1: z.string().min(1, "Address line can't be empty").optional(),
    addressLine2: z.string().optional(),
    city: z.string().min(1, "City can't be empty").optional(),
    state: z.string().min(1, "State can't be empty").optional(),
    pincode: z
      .string()
      .min(5, "Pincode should be atleast 5 characters")
      .optional(),
    country: z.string().min(1, "Country can't be empty").optional(),
  })
  .strict();

export type createAddressDTO = z.infer<typeof createAddressSchema>;
export type updateAddressDTO = z.infer<typeof updateAddressSchema>;
