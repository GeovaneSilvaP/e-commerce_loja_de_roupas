"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pixController_1 = require("../controllers/pixController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
/**
 * Rotas de pagamento via PIX
 */
router.post("/pix", authMiddleware_1.authMiddleware, pixController_1.createPixPayment);
exports.default = router;
//# sourceMappingURL=pixRoutes.js.map