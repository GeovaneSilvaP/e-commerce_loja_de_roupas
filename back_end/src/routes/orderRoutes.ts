import { Router } from "express";
import { OrderController } from "../controllers/orderController";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  getAllOrdersAdmin,
  updateOderStatus,
  deleteOrderAdmin,
} from "../controllers/orderController";

const router = Router();
const orderController = new OrderController();

/**
 * Rotas de pedidos
 *
 * Todas requerem autenticação.
 */
router.post("/orders", authMiddleware, orderController.create);
router.get("/orders", authMiddleware, orderController.getAll);
router.patch("/orders/:id/cancel", authMiddleware, orderController.cancel);

router.delete("/orders/:id", deleteOrderAdmin);

export default router;
