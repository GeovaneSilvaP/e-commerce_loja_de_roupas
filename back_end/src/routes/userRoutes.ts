import { Router, Request, Response } from "express";
import { loginUser, registerUser } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import { connection } from "../db/connection";

// Execute uma vez no banco:
// ALTER TABLE users ADD COLUMN cpf VARCHAR(14) NULL;
// ALTER TABLE users ADD COLUMN asaas_customer_id VARCHAR(100) NULL;

const router = Router();

function query(sql: string, values: any[] = []) {
  return new Promise<any>((resolve, reject) => {
    connection.query(sql, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

router.post("/register", registerUser);
router.post("/login", loginUser);

// Salvar CPF do usuário logado
router.patch("/users/cpf", authMiddleware, async (req: Request, res: Response) => {
  const { cpf } = req.body;
  const user = (req as any).user;

  const cleaned = cpf?.replace(/\D/g, "");

  if (!cleaned || cleaned.length !== 11) {
    return res.status(400).json({ error: "CPF inválido" });
  }

  await query("UPDATE users SET cpf = ? WHERE id = ?", [cleaned, user.id]);

  return res.json({ message: "CPF salvo com sucesso" });
});

export default router;