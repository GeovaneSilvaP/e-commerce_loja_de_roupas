/* ==============================
   ROTAS DE CARRINHO
================================*/
import { Router } from "express";

import { authMiddleware } from "../middleware/authMiddleware";

import {
  addToCart,
  decreaseCart,
  getCart,
  increaseCart,
  removeCartItem,
} from "../controllers/cartItemsControllers";

const router = Router();

router.get("/cart", authMiddleware, getCart);

router.post("/cart", authMiddleware, addToCart);

router.put("/cart/:id/increase", authMiddleware, increaseCart);

router.put("/cart/:id/decrease", authMiddleware, decreaseCart);

router.delete("/cart/:id", authMiddleware, removeCartItem);

export default router;