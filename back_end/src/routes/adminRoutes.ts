import { Router } from "express";
import { loginAdmin, registerAdmin } from "../controllers/loginControllers"; // funções de admin

const router = Router();

router.post("/admins/register", registerAdmin);
router.post("/admin/login", loginAdmin);

export default router;