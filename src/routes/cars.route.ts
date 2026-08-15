import { Router } from "express";
import { uploadMiddleware } from "../middlewares/upload";
import { authMiddleware } from "../middlewares/auth";
import {
  deleteCarController,
  getCarsController,
  getMyCarsController,
  getOneCarController,
  postCarController,
  updateCarController,
} from "../controllers/cars.controller";
import { validate } from "../middlewares/validate";
import { CarSchema } from "../validations/cars.validation";

const router = Router();

router.post(
  "/",
  authMiddleware,
  uploadMiddleware.array("images", 10),
  validate(CarSchema),
  postCarController,
);

router.get("/", getCarsController);

router.get("/my", authMiddleware, getMyCarsController);

router.get("/:id", getOneCarController);

router.delete("/:id", authMiddleware, deleteCarController);

router.patch(
  "/:id",
  authMiddleware,
  uploadMiddleware.array("images", 10),
  validate(CarSchema),
  updateCarController,
);

export default router;
