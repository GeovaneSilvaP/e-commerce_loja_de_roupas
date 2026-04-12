import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { createReview, getProductReviews } from "../controllers/reviewController";

const router = Router();

/**
 * Rotas de avaliações de produtos
 */
router.post("/products/:id/reviews", authMiddleware, createReview);
router.get("/products/:id/reviews", getProductReviews);

export default router;