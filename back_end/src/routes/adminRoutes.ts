import { Router } from "express";
import { loginAdmin, registerAdmin } from "../controllers/loginControllers";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";
import { getAllOrdersAdmin, updateOderStatus } from "../controllers/orderController";

const router = Router();

/**
 * Rotas administrativas
 *
 * Requer autenticação e permissão de administrador.
 */
router.post("/admins/register", registerAdmin);
router.post("/admin/login", loginAdmin);
router.get("/admin/orders", authMiddleware, adminMiddleware, getAllOrdersAdmin);
router.patch("/admin/orders/:id/status", authMiddleware, adminMiddleware, updateOderStatus)

export default router;