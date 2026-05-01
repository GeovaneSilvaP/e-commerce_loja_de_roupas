"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const reviewController_1 = require("../controllers/reviewController");
const router = (0, express_1.Router)();
/**
 * Rotas de avaliações de produtos
 */
router.post("/products/:id/reviews", authMiddleware_1.authMiddleware, reviewController_1.createReview);
router.get("/products/:id/reviews", reviewController_1.getProductReviews);
exports.default = router;
//# sourceMappingURL=reviewRoutes.js.map