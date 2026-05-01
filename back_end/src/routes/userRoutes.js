"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
/**
 * Rotas de autenticação de usuários
 */
router.post("/register", userController_1.registerUser);
router.post("/login", userController_1.loginUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map