import { z } from "zod";

export const createOrderSchema = z.object({
  addressId: z.string().uuid("Invalid address ID"),
});

export const updateStatusSchema = z.object({
  status: z.enum([
    "pending",
    "payment_processing",
    "paid",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
    "failed",
  ]),
});
