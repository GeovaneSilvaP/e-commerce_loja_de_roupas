import { Request, Response } from "express";
import { connection } from "../db/connection";

export const getProducts = (req: Request, res: Response) => {
  connection.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

export const getProductById = (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "ID é obrigatório" });

  connection.query(
    "SELECT * FROM products WHERE id = ?",
    [id],
    (err, result: any) => {
      if (err) return res.status(500).json({ error: err });
      if (!result.length) return res.status(404).json({ message: "Produto não encontrado" });
      res.json(result[0]);
    }
  );
};

export const createProduct = (req: Request, res: Response) => {
  const { name, price, description, stock, category } = req.body; // ✅ category
  const image = (req.file as any)?.path;

  if (!name || !price || !stock) {
    return res.status(400).json({ message: "Nome, preço e estoque são obrigatórios" });
  }

  const sql =
    "INSERT INTO products (name, price, description, stock, image_url, category) VALUES (?, ?, ?, ?, ?, ?)"; // ✅

  connection.query(
    sql,
    [name, Number(price), description, Number(stock), image, category || "outros"], // ✅
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Produto criado com sucesso" });
    }
  );
};

export const updateProducts = (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price, description, stock, category } = req.body; // ✅ category
  const image = (req.file as any)?.path;

  if (!id) return res.status(400).json({ message: "ID é obrigatório" });

  let sql = "UPDATE products SET name=?, price=?, description=?, stock=?, category=?"; // ✅
  const params: any[] = [name, Number(price), description, Number(stock), category || "outros"]; // ✅

  if (image) {
    sql += ", image_url=?";
    params.push(image);
  }

  sql += " WHERE id=?";
  params.push(id);

  connection.query(sql, params, (err, result: any) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Produto não encontrado" });
    res.json({ message: "Produto atualizado com sucesso" });
  });
};

export const deleteProduct = (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "ID é obrigatório" });

  connection.query(
    "DELETE FROM products WHERE id = ?",
    [id],
    (err, result: any) => {
      if (err) return res.status(500).json({ error: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Produto não encontrado" });
      res.json({ message: "Produto deletado com sucesso" });
    }
  );
};

export const getProductByCategory = (req: Request, res: Response) => {
  const { category } = req.params;

  connection.query(
    "SELECT * FROM products WHERE category = ?",
    [category],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
};