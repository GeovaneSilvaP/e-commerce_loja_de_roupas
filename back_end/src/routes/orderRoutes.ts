import { Router } from "express";
import { OrderController } from "../controllers/orderController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
const orderController = new OrderController();

router.post("/orders", authMiddleware, orderController.create);
router.get("/orders", authMiddleware, orderController.getAll);

export default router;