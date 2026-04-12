import { Router } from "express";
import { loginUser, registerUser } from "../controllers/userController";

const router = Router();

/**
 * Rotas de autenticação de usuários
 */
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;