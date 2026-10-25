import asyncHandler from "../../utils/asyncHandler.js";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
} from "./cart.service.js";

export const add = asyncHandler(async (req, res) => {
  const item = await addToCart(
    req.user.id,
    req.body.productId,
    req.body.quantity,
  );
  res.status(201).json({ success: true, data: item });
});

export const view = asyncHandler(async (req, res) => {
  const cart = await getCart(req.user.id);
  res.status(200).json({ success: true, data: cart });
});

export const update = asyncHandler(async (req, res) => {
  await updateCartItem(req.user.id, req.params.productId, req.body.quantity);
  res.status(200).json({ success: true });
});

export const remove = asyncHandler(async (req, res) => {
  await removeFromCart(req.user.id, req.params.productId);
  res.status(204).send();
});
