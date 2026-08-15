import { Router } from "express";
import { getProfileController } from "../controllers/profile.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();
router.get("/", authMiddleware, getProfileController);

export default router;
