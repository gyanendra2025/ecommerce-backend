import asyncHandler from "../../utils/asyncHandler.js";
import prisma from "../../config/prisma.js";
import AppError from "../../utils/AppError.js";

export const getProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  });
});
