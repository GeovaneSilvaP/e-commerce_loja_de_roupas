import { Router } from "express";
import { upload } from "../config/multer";

import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";

import {
  getProducts,
  createProduct,
  deleteProduct,
  getProductById,
  updateProducts,
  getProductByCategory,
} from "../controllers/productsControllers";

const router = Router();

/**
 * Rotas de produtos
 */


// Público
router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.get("/products/category/:category", getProductByCategory);

// Admin
router.post(
  "/products",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  createProduct,
);

router.put(
  "/products/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  updateProducts,
);

router.delete("/products/:id", authMiddleware, adminMiddleware, deleteProduct);

export default router;
