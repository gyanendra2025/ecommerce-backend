import { Router } from "express";
import authenticate from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import { payOrderSchema } from "./payment.schema.js";
import { pay } from "./payment.controller.js";

const router = Router();

router.use(authenticate);

router.post("/:orderId/pay", validate(payOrderSchema), pay);

export default router;
