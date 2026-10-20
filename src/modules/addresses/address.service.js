import prisma from "../../config/prisma.js";
import AppError from "../../utils/AppError.js";

export const createAddress = async (userId, data) => {
  return prisma.address.create({
    data: { ...data, userId },
  });
};

export const listAddress = async (userId) => {
  return prisma.address.findMany({
    where: { userId },
  });
};

export const updateAddress = async (userId, addressId, data) => {
  const result = await prisma.address.updateMany({
    where: { id: addressId, userId },
    data,
  });

  if (result.count === 0) {
    throw new AppError(404, "address not found");
  }

  return prisma.address.findUnique({ where: { id: addressId } });
};

export const deleteAddress = async (userId, addressId) => {
  const result = await prisma.address.deleteMany({
    where: { id: addressId, userId },
  });

  if (result.count === 0) {
    throw new AppError(404, "Address not found");
  }
};
