import asyncHandler from "../../utils/asyncHandler.js";
import { payOrder } from "./payment.service.js";

export const pay = asyncHandler(async (req, res) => {
  const payment = await payOrder(
    req.user.id,
    req.params.orderId,
    req.body.idempotencyKey,
  );
  res.status(200).json({ success: true, data: payment });
});
