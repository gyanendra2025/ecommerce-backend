import prisma from "../../config/prisma.js";
import AppError from "../../utils/AppError.js";

import redis from "../../config/redis.js";

const PRODUCT_CACHE_TTL = 60; // seconds

const SORTABLE_FIELDS = ["price", "name", "createdAt"];

export const createProduct = async ({
  sku,
  name,
  description,
  price,
  initialQuantity,
}) => {
  const existing = await prisma.product.findUnique({
    where: { sku },
  });

  if (existing) {
    throw new AppError(409, "SKU already exists");
  }

  return prisma.product.create({
    data: {
      sku,
      name,
      description,
      price,
      inventory: {
        create: {
          availableQuantity: initialQuantity,
        },
      },
    },
    include: {
      inventory: true,
    },
  });
};

export const updateProduct = async (productId, data) => {
  const result = await prisma.product.updateMany({
    where: { id: productId },
    data,
  });
  if (result.count === 0) {
    throw new AppError(404, "Product not found");
  }
  try {
    await redis.del(`product:${productId}`);
  } catch (error) {
    console.error("Redis invalidation failed:", error.message);
  }
  return prisma.product.findUnique({
    where: { id: productId },
    include: { inventory: true },
  });
};

export const setInventory = async (productId, { availableQuantity }) => {
  const result = await prisma.inventory.updateMany({
    where: { productId },
    data: { availableQuantity },
  });
  if (result.count === 0) {
    throw new AppError(404, "Product not found");
  }
  try {
    await redis.del(`product:${productId}`);
  } catch (error) {
    console.error("Redis invalidation failed:", error.message);
  }
  return prisma.inventory.findUnique({ where: { productId } });
};

export const getProduct = async (productId, isAdmin) => {
  const cacheKey = `product:${productId}`;
  let cached = null;
  try {
    cached = await redis.get(cacheKey);
  } catch (error) {
    console.error("Redis read failed, falling back to DB:", error.message);
  }

  let product;
  if (cached) {
    product = JSON.parse(cached);
  } else {
    product = await prisma.product.findUnique({
      where: { id: productId },
      include: { inventory: true },
    });

    if (product) {
      try {
        await redis.set(
          cacheKey,
          JSON.stringify(product),
          "EX",
          PRODUCT_CACHE_TTL,
        );
      } catch (error) {
        console.error(
          "Redis write failed, continuing without cache:",
          error.message,
        );
      }
    }
  }

  if (!product || (!isAdmin && !product.isActive)) {
    throw new AppError(404, "Product not found");
  }

  return product;
};

export const listProducts = async ({
  search,
  minPrice,
  maxPrice,
  sortBy,
  order,
  page,
  limit,
  isAdmin,
}) => {
  const where = {
    ...(isAdmin ? {} : { isActive: true }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...((minPrice || maxPrice) && {
      price: {
        ...(minPrice && { gte: minPrice }),
        ...(maxPrice && { lte: maxPrice }),
      },
    }),
  };
  const orderByField = SORTABLE_FIELDS.includes(sortBy) ? sortBy : "createdAt";
  const orderDirection = order === "asc" ? "asc" : "desc";

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { [orderByField]: orderDirection },
      skip: (page - 1) * limit,
      take: limit,
      include: { inventory: true },
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, page, limit };
};
