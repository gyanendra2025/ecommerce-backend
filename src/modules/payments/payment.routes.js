import { Router } from "express";
import authenticate from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import rateLimit from "../../middleware/rateLimit.middleware.js";
import { payOrderSchema } from "./payment.schema.js";
import { pay } from "./payment.controller.js";
const payRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  keyPrefix: "pay",
  keyGenerator: (req) => req.user.id,
});

const router = Router();

router.use(authenticate);

router.post("/:orderId/pay", payRateLimit, validate(payOrderSchema), pay);

export default router;
