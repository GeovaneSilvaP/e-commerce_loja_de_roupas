import { Request, Response } from "express";
import { connection } from "../db/connection";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = "SECRET_KEY";

/* ==============================
   REGISTER USER
================================*/
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios" });
  }

  try {
    connection.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
      async (err, result: any) => {
        if (err) return res.status(500).json({ error: err });

        if (result.length > 0) {
          return res.status(400).json({ message: "Email já cadastrado" });
        }

        const hash = await bcrypt.hash(password, 10);

        connection.query(
          "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
          [name, email, hash],
          (err) => {
            // agora trata erro do INSERT
            if (err) return res.status(500).json({ error: err });
            res.json({ message: "Usuário criado com sucesso" });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};

/* ==============================
   LOGIN USER
================================*/
export const loginUser = (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email e senha obrigatórios" });
  }

  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result: any) => {
      if (err) return res.status(500).json(err);

      if (!result.length) {
        return res.status(401).json({ message: "Usuário não encontrado" });
      }

      const user = result[0];
      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return res.status(401).json({ message: "Senha inválida" });
      }

      const token = jwt.sign(
        { id: user.id },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({ token });
    }
  );
};