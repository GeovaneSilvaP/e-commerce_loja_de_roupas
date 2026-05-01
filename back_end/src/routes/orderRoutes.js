"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const orderController = new orderController_1.OrderController();
/**
 * Rotas de pedidos
 *
 * Todas requerem autenticação.
 */
router.post("/orders", authMiddleware_1.authMiddleware, orderController.create);
router.get("/orders", authMiddleware_1.authMiddleware, orderController.getAll);
router.patch("/orders/:id/cancel", authMiddleware_1.authMiddleware, orderController.cancel);
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map