import prisma from "../config/prisma.js";

export const enqueue = async (type, payload) => {
  return prisma.job.create({
    data: { type, payload },
  });
};
