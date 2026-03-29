import { Request, Response } from "express";
import { connection } from "../db/connection";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* ==============================
   REGISTER ADMIN
================================*/
export const registerAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email e senha obrigatórios" });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  connection.query(
    "SELECT id FROM admins WHERE email = ?",
    [email],
    (err, result: any) => {
      if (result.length > 0) {
        return res.status(400).json({ message: "Admin já existe" });
      }

      connection.query(
        "INSERT INTO admins (email, password) VALUES (?, ?)",
        [email, hashPassword],
        (err) => {
          if (err) return res.status(500).json({ error: err });

          res.json({ message: "Admin criado com sucesso" });
        },
      );
    },
  );
};

/* ==============================
   LOGIN ADMIN
================================*/
export const loginAdmin = (req: Request, res: Response) => {
  const { email, password } = req.body;

  connection.query(
    "SELECT * FROM admins WHERE email = ?",
    [email],
    async (err, result: any) => {
      if (err) return res.status(500).json({ error: err });

      if (!result.length) {
        return res.status(401).json({ message: "Admin não encontrado" });
      }

      const admin = result[0];

      const valid = await bcrypt.compare(password, admin.password);

      if (!valid) {
        return res.status(401).json({ message: "Senha inválida" });
      }

      const token = jwt.sign(
        { id: admin.id, isAdmin: true },
        process.env.JWT_SECRET || "SECRET_KEY",
        { expiresIn: "1d" },
      );

      res.json({ token });
    },
  );
};
