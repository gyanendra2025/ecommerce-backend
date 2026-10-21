import { z } from "zod";

export const createProductSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  initialQuantity: z.number().int().nonnegative().default(0),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  isActive: z.boolean().optional(),
});

export const inventorySchema = z.object({
  availableQuantity: z
    .number()
    .int()
    .nonnegative("Quantity cannot be negative"),
});
