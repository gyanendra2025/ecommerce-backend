import { Router } from "express";
import { register, login } from "./auth.controller.js";
import validate from "../../middleware/validate.middleware.js";
import { registerSchema, loginSchema } from "./auth.schema.js";
import rateLimit from "../../middleware/rateLimit.middleware.js";

const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyPrefix: "login",
});

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", loginRateLimit, validate(loginSchema), login);

export default router;
