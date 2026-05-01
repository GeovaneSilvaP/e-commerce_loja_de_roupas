import { Router } from "express";
import { OrderController } from "../controllers/orderController";
import { authMiddleware } from "../middleware/authMiddleware";

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


export default router;
