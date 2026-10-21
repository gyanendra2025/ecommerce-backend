import { Router } from "express";
import authenticate from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/authorize.middleware.js";
import optionalAuthenticate from "../../middleware/optionalAuth.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import {
  createProductSchema,
  updateProductSchema,
  inventorySchema,
} from "./product.schema.js";
import {
  create,
  update,
  updateInventory,
  getOne,
  list,
} from "./product.controller.js";

const router = Router();

// public — browse, no login needed
router.get("/", optionalAuthenticate, list);
router.get("/:id", optionalAuthenticate, getOne);

// admin-only — write operations
router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createProductSchema),
  create,
);
router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(updateProductSchema),
  update,
);
router.patch(
  "/:id/inventory",
  authenticate,
  authorize("admin"),
  validate(inventorySchema),
  updateInventory,
);

export default router;
