import { Router } from "express";
import authenticate from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import { createAddressSchema, updateAddressSchema } from "./address.schema.js";
import { create, list, update, remove } from "./address.controller.js";

const router = Router();

router.use(authenticate); // each route is protected

router.post("/", validate(createAddressSchema), create);
router.get("/", list);
router.patch("/:id", validate(updateAddressSchema), update);
router.delete("/:id", remove);

export default router;
