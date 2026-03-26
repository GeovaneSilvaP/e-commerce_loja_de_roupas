import { Router } from "express";

import { upload } from "../config/multer";

import { authMiddleware } from "../middleware/authMiddleware";

import {
  getProducts,
  createProduct,
  deleteProduct,
  getProductById,
  updateProducts,
} from "../controllers/productsControllers";

import { loginAdmin, registerAdmin } from "../controllers/loginControllers";

import {
  addToCart,
  decreaseCart,
  getCart,
  increaseCart,
  removeCartItem,
} from "../controllers/cartItemsControllers";

const router = Router();

/* ==============================
   ROTAS DE PRODUTOS
================================*/

router.get("/products", getProducts);

router.get("/products/:id", getProductById);

router.post("/products", authMiddleware, upload.single("image"), createProduct);

router.put(
  "/products/:id",
  authMiddleware,
  upload.single("image"),
  updateProducts,
);

router.delete("/products/:id", authMiddleware, deleteProduct);

/* ==============================
   ROTAS DE ADMIN
================================*/

router.post("/admins/register", registerAdmin);

router.post("/admin/login", loginAdmin);

/* ==============================
   ROTAS DE CARRINHO
================================*/
router.get("/cart", authMiddleware, getCart);

router.post("/cart", authMiddleware, addToCart);

router.put("/cart/:id/increase", authMiddleware, increaseCart);

router.put("/cart/:id/decrease", authMiddleware, decreaseCart);

router.delete("/cart/:id", authMiddleware, removeCartItem);

export default router;
