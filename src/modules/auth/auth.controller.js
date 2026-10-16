import { registerUser, loginUser } from "./auth.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
  const { user, token } = await registerUser(req.body);

  res.status(201).json({
    success: true,
    data: {
      user,
      token,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await loginUser(req.body);
  res.status(200).json({
    success: true,
    data: {
      user,
      token,
    },
  });
});
