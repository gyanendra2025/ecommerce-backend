import prisma from "../../config/prisma.js";
import AppError from "../../utils/AppError.js";

// upsert means find existing if so update, if not create new.
const getOrCreateCart = async (userId) => {
  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
};

export const addToCart = async (userId, productId, quantity) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product || !product.isActive) {
    throw new AppError(404, "Product not found");
  }

  const cart = await getOrCreateCart(userId);
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: { cartId: cart.id, productId },
    },
  });

  if (existingItem) {
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
    },
  });
};

export const getCart = async (userId) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });

  if (!cart) {
    return { items: [], total: 0 };
  }

  const items = cart.items.map((item) => ({
    productId: item.productId,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
    subtotal: Number(item.product.price) * item.quantity,
  }));

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  return { items, total };
};

export const updateCartItem = async (userId, productId, quantity) => {
  const result = await prisma.cartItem.updateMany({
    where: { productId, cart: { userId } },
    data: { quantity },
  });
  if (result.count === 0) {
    throw new AppError(404, "Cart item not found");
  }
};

export const removeFromCart = async (userId, productId) => {
  const result = await prisma.cartItem.deleteMany({
    where: { productId, cart: { userId } },
  });

  if (result.count === 0) {
    throw new AppError(404, "Cart item not found");
  }
};
