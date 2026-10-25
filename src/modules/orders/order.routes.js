import { Router } from "express";
import authenticate from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/authorize.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import { createOrderSchema, updateStatusSchema } from "./order.schema.js";
import { create, updateStatus, getOne, list } from "./order.controller.js";

const router = Router();

router.use(authenticate); // every order route needs login

router.post("/", validate(createOrderSchema), create);
router.get("/", list);
router.get("/:id", getOne);
router.patch(
  "/:id/status",
  authorize("admin"),
  validate(updateStatusSchema),
  updateStatus,
);

export default router;
