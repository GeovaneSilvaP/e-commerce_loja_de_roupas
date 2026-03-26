/* ==============================
   REGISTRAR ADMIN
================================*/
import {Request, Response } from "express";
import { connection } from "../db/connection";
import { QueryError } from "mysql2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const hashPassword = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO admins (email, password) VALUES (?, ?)";

  connection.query(sql, [email, hashPassword], (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Admin criado com sucesso",
    });
  });
};

/* ==============================
   LOGIN ADMIN
================================*/
export const loginAdmin = (req: Request, res: Response) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM admins WHERE email = ?";

  connection.query(
    sql,
    [email],
    async (err: QueryError | null, result: any) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(401).json({
          message: "Admin não encontrado",
        });
      }

      const admin = result[0];

      const validPassword = await bcrypt.compare(password, admin.password);

      if (!validPassword) {
        return res.status(401).json({
          message: "Senha inválida",
        });
      }

      const token = jwt.sign(
        { id: admin.id },
        process.env.JWT_SECRET || "SECRET_KEY",
        { expiresIn: "1d" },
      );

      res.json({ token });
    },
  );
};
