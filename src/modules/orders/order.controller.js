import asyncHandler from "../../utils/asyncHandler.js";
import {
  createOrder,
  updateOrderStatus,
  getOrder,
  listOrders,
} from "./order.service.js";

export const create = asyncHandler(async (req, res) => {
  const order = await createOrder(req.user.id, req.body.addressId);
  res.status(201).json({ success: true, data: order });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const order = await updateOrderStatus(req.params.id, req.body.status);
  res.status(200).json({ success: true, data: order });
});

export const getOne = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === "admin";
  const order = await getOrder(req.user.id, req.params.id, isAdmin);
  res.status(200).json({ success: true, data: order });
});

export const list = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === "admin";
  const orders = await listOrders(req.user.id, isAdmin);
  res.status(200).json({ success: true, data: orders });
});
