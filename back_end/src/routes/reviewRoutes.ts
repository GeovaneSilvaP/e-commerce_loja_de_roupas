import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { createReview, getProductReviews } from "../controllers/reviewController";

const router = Router();

router.post("/products/:id/reviews", authMiddleware, createReview);
router.get("/products/:id/reviews", getProductReviews);

export default router;