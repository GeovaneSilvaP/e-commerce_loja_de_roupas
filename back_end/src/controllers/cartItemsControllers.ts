/* ==============================
   ADD AO CARRINHO
================================*/
import { Request, Response } from "express";
import { connection } from "../db/connection";

export const addToCart = (req: Request, res: Response) => {
  const { product_id, quantity } = req.body;
  const user = (req as any).admin;

  console.log("USER:", user); // DEBUG

  if (!user) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  const user_id = user.id;

  const sqlCheck =
    "SELECT * FROM cart_items WHERE product_id = ? AND user_id = ?";

  connection.query(sqlCheck, [product_id, user_id], (err, result: any) => {
    if (err) return res.status(500).json(err);

    if (result.length > 0) {
      const sqlUpdate =
        "UPDATE cart_items SET quantity = quantity + ? WHERE product_id = ? AND user_id = ?";

      connection.query(sqlUpdate, [quantity, product_id, user_id], (err) => {
        if (err) return res.status(500).json(err);

        return res.json({ message: "Quantidade atualizada" });
      });
    } else {
      const sqlInsert =
        "INSERT INTO cart_items (product_id, quantity, user_id) VALUES (?, ?, ?)";

      connection.query(sqlInsert, [product_id, quantity, user_id], (err) => {
        if (err) return res.status(500).json(err);

        return res.json({ message: "Adicionado ao carrinho" });
      });
    }
  });
};

/* ==============================
   GET CARRINHO
================================*/
export const getCart = (req: Request, res: Response) => {
  const user_id = (req as any).admin.id;

  const sql = `
    SELECT c.product_id, c.quantity, p.name, p.price, p.image_url
    FROM cart_items c
    JOIN products p ON p.id = c.product_id
    WHERE c.user_id = ?
  `;

  connection.query(sql, [user_id], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
};

/* ==============================
   INCREASE CARRINHO
================================*/
export const increaseCart = (req: Request, res: Response) => {
  const { id } = req.params;
  const user_id = (req as any).admin.id;

  const sql =
    "UPDATE cart_items SET quantity = quantity + 1 WHERE product_id = ? AND user_id = ?";

  connection.query(sql, [id, user_id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Quantidade aumentada" });
  });
};

/* ==============================
   DECREASE CARRINHO
================================*/
export const decreaseCart = (req: Request, res: Response) => {
  const { id } = req.params;
  const user_id = (req as any).admin.id;

  const sql =
    "UPDATE cart_items SET quantity = quantity - 1 WHERE product_id = ? AND user_id = ?";

  connection.query(sql, [id, user_id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Quantidade diminuída" });
  });
};

/* ==============================
   REMOVE ITEM CARRINHO
================================*/
export const removeCartItem = (req: Request, res: Response) => {
  const { id } = req.params;
  const user_id = (req as any).admin.id;

  const sql = "DELETE FROM cart_items WHERE product_id = ? AND user_id = ?";

  connection.query(sql, [id, user_id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Item removido" });
  });
};
