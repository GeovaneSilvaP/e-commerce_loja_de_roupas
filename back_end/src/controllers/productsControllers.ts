import { Request, Response } from "express";
import { connection } from "../db/connection";
import { QueryError, QueryResult } from "mysql2";

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