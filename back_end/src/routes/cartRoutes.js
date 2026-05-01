"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartItemsControllers_1 = require("../controllers/cartItemsControllers");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
/**
 * Rotas de carrinho
 *
 * Todas requerem usuário autenticado.
 */
router.post("/cart", authMiddleware_1.authMiddleware, cartItemsControllers_1.addToCart);
router.get("/cart", authMiddleware_1.authMiddleware, cartItemsControllers_1.getCart);
router.put("/cart/increase/:id", authMiddleware_1.authMiddleware, cartItemsControllers_1.increaseCart);
router.put("/cart/decrease/:id", authMiddleware_1.authMiddleware, cartItemsControllers_1.decreaseCart);
router.delete("/cart/:id", authMiddleware_1.authMiddleware, cartItemsControllers_1.removeCartItem);
exports.default = router;
//# sourceMappingURL=cartRoutes.js.map