import { Router } from "express";
import authenticate from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import { addToCartSchema, updateCartItemSchema } from "./cart.schema.js";
import { add, view, update, remove } from "./cart.controller.js";

const router = Router();

router.use(authenticate); // cart always needs login

router.post("/", validate(addToCartSchema), add);
router.get("/", view);
router.patch("/:productId", validate(updateCartItemSchema), update);
router.delete("/:productId", remove);

export default router;
