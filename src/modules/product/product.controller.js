import asyncHandler from "../../utils/asyncHandler.js";
import {
  createProduct,
  updateProduct,
  setInventory,
  getProduct,
  listProducts,
} from "./product.service.js";

export const create = asyncHandler(async (req, res) => {
  const product = await createProduct(req.body);
  res.status(201).json({ success: true, data: product });
});

export const update = asyncHandler(async (req, res) => {
  const product = await updateProduct(req.params.id, req.body);
  res.status(200).json({ success: true, data: product });
});

export const updateInventory = asyncHandler(async (req, res) => {
  const inventory = await setInventory(req.params.id, req.body);
  res.status(200).json({ success: true, data: inventory });
});

export const getOne = asyncHandler(async (req, res) => {
  const isAdmin = req.user?.role === "admin";
  const product = await getProduct(req.params.id, isAdmin);
  res.status(200).json({ success: true, data: product });
});

export const list = asyncHandler(async (req, res) => {
  const isAdmin = req.user?.role === "admin";
  const result = await listProducts({
    search: req.query.search,
    minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
    maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    sortBy: req.query.sortBy,
    order: req.query.order,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 20,
    isAdmin,
  });
  res.status(200).json({ success: true, ...result });
});
