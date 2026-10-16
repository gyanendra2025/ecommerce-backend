import { z } from "zod";

export const createAddressSchema = z.object({
  label: z.string().min(1, "Label is required"),
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  isDefault: z.boolean().optional(),
});

export const updateAddressSchema = createAddressSchema.partial();
