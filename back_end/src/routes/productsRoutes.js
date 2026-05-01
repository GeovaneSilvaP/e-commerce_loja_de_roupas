"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = require("../config/multer");
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const productsControllers_1 = require("../controllers/productsControllers");
const router = (0, express_1.Router)();
/**
 * Rotas de produtos
 */
// Público
router.get("/products", productsControllers_1.getProducts);
router.get("/products/:id", productsControllers_1.getProductById);
router.get("/products/category/:category", productsControllers_1.getProductByCategory);
// Admin
router.post("/products", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, multer_1.upload.single("image"), productsControllers_1.createProduct);
router.put("/products/:id", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, multer_1.upload.single("image"), productsControllers_1.updateProducts);
router.delete("/products/:id", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, productsControllers_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=productsRoutes.js.map