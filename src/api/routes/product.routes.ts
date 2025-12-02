import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.jsx";
import {
  createProducts,
  getMyProducts,
  updateProduct,
  deleteProduct,
  getSelectedProduct,
  getPublicProducts,
  getPublicProductsById,
} from "../controllers/product.controller.js";

const router: ReturnType<typeof Router> = Router();

router.get("/public", getPublicProducts);
router.get("/public/:id", getPublicProductsById);
router.get("/", authMiddleware, getMyProducts);
router.get("/:id", authMiddleware, getSelectedProduct);
router.post("/", authMiddleware, createProducts);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

export default router;
