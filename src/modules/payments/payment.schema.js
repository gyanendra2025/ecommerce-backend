import { z } from "zod";

export const payOrderSchema = z.object({
  idempotencyKey: z.string().uuid("Invalid idempotency key"),
});
