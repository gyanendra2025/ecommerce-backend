import asyncHandler from "../../utils/asyncHandler.js";
import {
  createAddress,
  updateAddress,
  listAddress,
  deleteAddress,
} from "./address.service.js";

export const create = asyncHandler(async (req, res) => {
  const address = await createAddress(req.user.id, req.body);
  res.status(201).json({
    success: true,
    data: address,
  });
});

export const list = asyncHandler(async (req, res) => {
  const address = await listAddress(req.user.id);
  res.status(200).json({ success: true, data: address });
});

export const update = asyncHandler(async (req, res) => {
  const address = await updateAddress(req.user.id, req.params.id, req.body);
  res.status(200).json({ success: true, data: address });
});

export const remove = asyncHandler(async (req, res) => {
  await deleteAddress(req.user.id, req.params.id);
  res.status(204).send();
});
