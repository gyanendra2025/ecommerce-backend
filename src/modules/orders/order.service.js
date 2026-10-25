import prisma from "../../config/prisma.js";
import AppError from "../../utils/AppError.js";
import { canTransition } from "./order.statemachine.js";

export const createOrder = async (userId, addressId) => {
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });

  if (!address) {
    throw new AppError(404, "Address not found");
  }

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: { include: { product: { include: { inventory: true } } } }, // query to fetch everything in one go, or you can write query for each piece, but this is good way.
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new AppError(400, "Cart is empty");
  }

  for (const item of cart.items) {
    if (!item.product.isActive) {
      throw new AppError(409, `${item.product.name} is no longer available`);
    }
    if (item.product.inventory.availableQuantity < item.quantity) {
      throw new AppError(409, `Insufficient stock for ${item.product.name}`);
    }
  }

  const totalAmount = cart.items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        addressId,
        totalAmount,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            productSku: item.product.sku,
            unitPrice: item.product.price,
            quantity: item.quantity,
            subtotal: Number(item.product.price) * item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    for (const item of cart.items) {
      const result = await tx.inventory.updateMany({
        where: {
          productId: item.productId,
          availableQuantity: { gte: item.quantity },
        },
        data: {
          availableQuantity: { decrement: item.quantity },
          reservedQuantity: { increment: item.quantity },
        },
      });

      if (result.count === 0) {
        throw new AppError(409, `Insufficient stock for ${item.product.name}`);
      }
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return newOrder;
  });

  return order;
};

export const updateOrderStatus = async (orderId, newStatus) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    throw new AppError(404, "Order not found");
  }

  if (!canTransition(order.status, newStatus)) {
    throw new AppError(
      400,
      `Cannot transition from ${order.status} to ${newStatus}`,
    );
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
  });
};
export const getOrder = async (userId, orderId, isAdmin) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, address: true },
  });

  if (!order || (!isAdmin && order.userId !== userId)) {
    throw new AppError(404, "Order not found");
  }

  return order;
};

export const listOrders = async (userId, isAdmin) => {
  return prisma.order.findMany({
    where: isAdmin ? {} : { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
};
