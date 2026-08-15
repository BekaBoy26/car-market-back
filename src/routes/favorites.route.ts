import { Router } from "express";
import {
  deleteFavoriteController,
  getFavoritesController,
  postFavoriteController,
} from "../controllers/favorites.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();
router.post("/:carId", authMiddleware, postFavoriteController);
router.get("/", authMiddleware, getFavoritesController);
router.delete("/:carId", authMiddleware, deleteFavoriteController);

export default router;
