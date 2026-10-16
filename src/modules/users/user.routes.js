import { Router } from "express";
import { getProfile } from "./user.controller.js";
import authenticate from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/me", authenticate, getProfile);

export default router;
