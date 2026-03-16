import { Router } from "express";
import { upload } from "../config/multer";
import {
  getProducts,
  createProduct,
  deleteProduct,
  getProductById,
  updateProducts,
  authMiddleware,
  registerAdmin,
  loginAdmin
} from "../controllers/productsControllers";

const router = Router();

/* ==============================
   ROTAS DE PRODUTOS
================================*/

router.get("/products", getProducts);

router.get("/products/:id", getProductById);

router.post(
  "/products",
  authMiddleware,
  upload.single("image"),
  createProduct
);

router.put(
  "/products/:id",
  authMiddleware,
  upload.single("image"),
  updateProducts
);

router.delete(
  "/products/:id",
  authMiddleware,
  deleteProduct
);

/* ==============================
   ROTAS DE ADMIN
================================*/

router.post("/admins/register", registerAdmin);

router.post("/admin/login", loginAdmin);

export default router;