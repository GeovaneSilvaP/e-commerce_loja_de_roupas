import { Router } from "express";
import {
  addToCart,
  getCart,
  increaseCart,
  decreaseCart,
  removeCartItem,
} from "../controllers/cartItemsControllers";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/cart", authMiddleware, addToCart);
router.get("/cart", authMiddleware, getCart);
router.put("/cart/increase/:id", authMiddleware, increaseCart);
router.put("/cart/decrease/:id", authMiddleware, decreaseCart);
router.delete("/cart/:id", authMiddleware, removeCartItem);

export default router;