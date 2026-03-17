import { NextFunction, Request, Response } from "express";
import { connection } from "../db/connection";
import { QueryError, QueryResult } from "mysql2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* ==============================
   LISTAR PRODUTOS
================================*/
export const getProducts = (req: Request, res: Response) => {
  const sql = "SELECT * FROM products";

  connection.query(sql, (err: QueryError | null, results: QueryResult) => {
    if (err) {
      res.status(500).json(err);
      return;
    }

    res.json(results);
  });
};

/* ==============================
   CRIAR PRODUTO
================================*/
export const createProduct = (req: Request, res: Response) => {
  console.log(req.body);
  console.log(req.file);

  const { name, price, description, stock } = req.body;

  const image = req.file?.filename;

  const sql =
    "INSERT INTO products (name, price, description, stock, image_url) VALUES (?, ?, ?, ?, ?)";

  connection.query(sql, [name, price, description, stock, image], (err) => {
    if (err) {
      console.log("ERRO MYSQL:", err);
      return res.status(500).json(err);
    }

    res.json({
      message: "Produto criado com sucesso",
    });
  });
};

/* ==============================
   PRODUTO POR ID
================================*/
export const getProductById = (req: Request, res: Response) => {
  const { id } = req.params;

  const sql = "SELECT * FROM products WHERE id = ?";

  connection.query(
    sql,
    [id],
    (err: QueryError | null, results: QueryResult) => {
      if (err) {
        res.status(500).json(err);
        return;
      }

      res.json(results);
    },
  );
};

/* ==============================
   ATUALIZAR PRODUTO
================================*/
export const updateProducts = (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price, description, stock } = req.body;

  const image = req.file?.filename;

  const sql =
    "UPDATE products SET name = ?, price = ?, description = ?, stock = ?, image_url = ? WHERE id = ?";

  connection.query(
    sql,
    [name, price, description, stock, image, id],
    (err: QueryError | null, results: QueryResult) => {
      if (err) {
        res.status(500).json(err);
        return;
      }

      res.json({
        message: "Produto atualizado com sucesso",
        results,
      });
    },
  );
};

/* ==============================
   DELETAR PRODUTO
================================*/
export const deleteProduct = (req: Request, res: Response) => {
  const { id } = req.params;

  const sql = "DELETE FROM products WHERE id = ?";

  connection.query(
    sql,
    [id],
    (err: QueryError | null, results: QueryResult) => {
      if (err) {
        res.status(500).json(err);
        return;
      }

      res.json({
        message: "Produto deletado com sucesso",
        results,
      });
    },
  );
};

/* ==============================
   REGISTRAR ADMIN
================================*/
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

/* ==============================
   MIDDLEWARE AUTH
================================*/
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não enviado" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token inválido" });
  }

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");

    (req as any).admin = decoded;

    next();
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }
};
