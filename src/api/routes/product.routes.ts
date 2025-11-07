import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
  createProducts,
  getMyProducts,
} from "../controllers/product.controller.js";

const router: ReturnType<typeof Router> = Router();


router.get("/", authMiddleware, getMyProducts);

router.post("/", authMiddleware, createProducts);

export default router;
