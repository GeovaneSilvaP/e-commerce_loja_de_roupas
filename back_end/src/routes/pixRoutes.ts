import { Router } from "express";
import { createPixPayment } from "../controllers/pixController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

/**
 * Rotas de pagamento via PIX
 */
router.post("/pix", authMiddleware, createPixPayment);

export default router;
