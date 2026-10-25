import prisma from "../../config/prisma.js";
import AppError from "../../utils/AppError.js";
import { canTransition } from "../orders/order.statemachine.js";
import { charge } from "./fakePaymentGateway.js";

export const payOrder = async (userId, orderId, idempotencyKey) => {
  const existingPayment = await prisma.payment.findUnique({
    where: { idempotencyKey },
  });

  if (existingPayment && existingPayment.orderId !== orderId) {
    throw new AppError(
      409,
      "Idempotency key already used for a different order",
    );
  }

  if (
    existingPayment &&
    ["succeeded", "failed"].includes(existingPayment.status)
  ) {
    return existingPayment; // terminal outcome already known — don't reprocess
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: true },
  });
  if (!order) {
    throw new AppError(404, "Order not found");
  }

  let payment = existingPayment;
  if (!payment) {
    if (!canTransition(order.status, "payment_processing")) {
      throw new AppError(
        400,
        `Cannot process payment for order in ${order.status} state`,
      );
    }
    [payment] = await prisma.$transaction([
      prisma.payment.create({
        data: {
          orderId,
          idempotencyKey,
          amount: order.totalAmount,
          status: "pending",
        },
      }),
      prisma.order.update({
        where: { id: orderId },
        data: { status: "payment_processing" },
      }),
    ]);
  }

  let gatewayResult;
  try {
    gatewayResult = await charge(Number(order.totalAmount));
  } catch (error) {
    await prisma.payment.update({
      where: { idempotencyKey },
      data: { status: "timeout" },
    });
    throw new AppError(
      504,
      "Payment gateway timed out, retry with the same idempotency key",
    );
  }

  if (gatewayResult.success) {
    const [updatedPayment] = await prisma.$transaction([
      prisma.payment.update({
        where: { idempotencyKey },
        data: { status: "succeeded" },
      }),
      prisma.order.update({ where: { id: orderId }, data: { status: "paid" } }),
      ...order.items.map((item) =>
        prisma.inventory.update({
          where: { productId: item.productId },
          data: { reservedQuantity: { decrement: item.quantity } },
        }),
      ),
    ]);
    return updatedPayment;
  }

  const [updatedPayment] = await prisma.$transaction([
    prisma.payment.update({
      where: { idempotencyKey },
      data: { status: "failed" },
    }),
    prisma.order.update({ where: { id: orderId }, data: { status: "failed" } }),
    ...order.items.map((item) =>
      prisma.inventory.update({
        where: { productId: item.productId },
        data: {
          reservedQuantity: { decrement: item.quantity },
          availableQuantity: { increment: item.quantity },
        },
      }),
    ),
  ]);
  return updatedPayment;
};
