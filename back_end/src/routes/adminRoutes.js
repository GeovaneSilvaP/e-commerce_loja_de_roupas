"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loginControllers_1 = require("../controllers/loginControllers");
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const orderController_1 = require("../controllers/orderController");
const router = (0, express_1.Router)();
/**
 * Rotas administrativas
 *
 * Requer autenticação e permissão de administrador.
 */
router.post("/admins/register", loginControllers_1.registerAdmin);
router.post("/admin/login", loginControllers_1.loginAdmin);
router.get("/admin/orders", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, orderController_1.getAllOrdersAdmin);
router.patch("/admin/orders/:id/status", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, orderController_1.updateOderStatus);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map