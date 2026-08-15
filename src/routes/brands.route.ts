import { Router } from "express";
import {
  getBrandsController,
} from "../controllers/brands.controller";

const router = Router();

router.get("/", getBrandsController);

export default router;
