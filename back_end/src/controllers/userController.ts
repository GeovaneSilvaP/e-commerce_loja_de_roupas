import { Request, Response } from "express";
import { connection } from "../db/connection";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* ==============================
   REGISTER USER
================================*/
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  connection.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hash],
    (err) => {
      res.json({ message: "Usuário criado com sucesso" });
    },
  );
};

/* ==============================
   LOGIN USER
================================*/
export const loginUser = (req: Request, res: Response) => {
  const { email, password } = req.body;

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
        process.env.JWT_SECRET || "SECRET_KEY",
        { expiresIn: "7d" },
      );

      res.json({ token });
    },
  );
};
