import { Router } from "express";
import { uploadMiddleware } from "../middlewares/upload";
import {
  authLoginController,
  authRegisterController,
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { loginSchema, registerSchema } from "../validations/auth.validation";

const router = Router();
router.post(
  "/reg",
  uploadMiddleware.single("avatar"),
  validate(registerSchema),
  authRegisterController,
);
router.post("/login", validate(loginSchema), authLoginController);

export default router;
