import { Request, Response } from "express";
import { connection } from "../db/connection";

/* ==============================
   LISTAR PRODUTOS
================================*/
export const getProducts = (req: Request, res: Response) => {
  connection.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json({ error: err });

    res.json(results);
  });
};

/* ==============================
   PRODUTO POR ID
================================*/
export const getProductById = (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "ID é obrigatório" });
  }

  connection.query(
    "SELECT * FROM products WHERE id = ?",
    [id],
    (err, result: any) => {
      if (err) return res.status(500).json({ error: err });

      if (!result.length) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }

      res.json(result[0]);
    }
  );
};

/* ==============================
   CREATE PRODUCT
================================*/
export const createProduct = (req: Request, res: Response) => {
  const { name, price, description, stock } = req.body;
  const image = (req.file as any)?.path;

  // ✅ Log para ver o que chegou
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);
  console.log("IMAGE PATH:", image);

  if (!name || !price || !stock) {
    return res.status(400).json({ message: "Nome, preço e estoque são obrigatórios" });
  }

  if (isNaN(price) || isNaN(stock)) {
    return res.status(400).json({
      message: "Preço e estoque devem ser números",
    });
  }

  const sql =
    "INSERT INTO products (name, price, description, stock, image_url) VALUES (?, ?, ?, ?, ?)";

  connection.query(
    sql,
    [name, Number(price), description, Number(stock), image],
    (err) => {
      if (err) return res.status(500).json({ error: err });

      res.json({ message: "Produto criado com sucesso" });
    }
  );
};

/* ==============================
   UPDATE PRODUCT
================================*/
export const updateProducts = (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price, description, stock } = req.body;

  // Cloudinary retorna a URL completa em req.file.path
  const image = (req.file as any)?.path;

  if (!id) {
    return res.status(400).json({ message: "ID é obrigatório" });
  }

  let sql = "UPDATE products SET name=?, price=?, description=?, stock=?";
  const params: any[] = [name, Number(price), description, Number(stock)];

  if (image) {
    sql += ", image_url=?";
    params.push(image);
  }

  sql += " WHERE id=?";
  params.push(id);

  connection.query(sql, params, (err, result: any) => {
    if (err) return res.status(500).json({ error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    res.json({ message: "Produto atualizado com sucesso" });
  });
};

/* ==============================
   DELETAR PRODUTO
================================*/
export const deleteProduct = (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "ID é obrigatório" });
  }

  connection.query(
    "DELETE FROM products WHERE id = ?",
    [id],
    (err, result: any) => {
      if (err) return res.status(500).json({ error: err });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }

      res.json({ message: "Produto deletado com sucesso" });
    }
  );
};