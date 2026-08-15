import { Router } from "express";
import { contactSellerController } from "../controllers/contact.controller";

const router = Router();

router.post("/", contactSellerController);

export default router;