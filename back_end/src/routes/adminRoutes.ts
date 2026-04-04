import { Router } from "express";
import { loginAdmin, registerAdmin } from "../controllers/loginControllers";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";
import { getAllOrdersAdmin } from "../controllers/orderController";

const router = Router();

router.post("/admins/register", registerAdmin);
router.post("/admin/login", loginAdmin);

//Rota para admin ver todos os pedidos
router.get("/admin/orders", authMiddleware, adminMiddleware, getAllOrdersAdmin);

export default router;