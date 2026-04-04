import { Request, Response } from "express";
import { connection } from "../db/connection";

/* ==============================
   ADD AO CARRINHO
================================*/
export const addToCart = (req: Request, res: Response) => {
  const { product_id, quantity } = req.body;
  const user = (req as any).user;

  if (!user?.id) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  if (!product_id) {
    return res.status(400).json({ message: "product_id é obrigatório" });
  }

  const user_id = user.id;
  const qty = quantity && quantity > 0 ? quantity : 1;

  // VERIFICAR SE PRODUTO EXISTE
  const sqlProduct = "SELECT id FROM products WHERE id = ?";

  connection.query(sqlProduct, [product_id], (err, product: any) => {
    if (err) return res.status(500).json({ error: err });

    if (!product.length) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    // VERIFICAR SE JÁ EXISTE NO CARRINHO
    const sqlCheck =
      "SELECT quantity FROM cart_items WHERE product_id = ? AND user_id = ?";

    connection.query(sqlCheck, [product_id, user_id], (err, result: any) => {
      if (err) return res.status(500).json({ error: err });

      if (result.length > 0) {
        // ATUALIZA QUANTIDADE
        const sqlUpdate =
          "UPDATE cart_items SET quantity = quantity + ? WHERE product_id = ? AND user_id = ?";

        connection.query(sqlUpdate, [qty, product_id, user_id], (err) => {
          if (err) return res.status(500).json({ error: err });

          return res.json({ message: "Quantidade atualizada" });
        });
      } else {
        // INSERE NOVO ITEM
        const sqlInsert =
          "INSERT INTO cart_items (product_id, quantity, user_id) VALUES (?, ?, ?)";

        connection.query(sqlInsert, [product_id, qty, user_id], (err) => {
          if (err) return res.status(500).json({ error: err });

          return res.json({ message: "Adicionado ao carrinho" });
        });
      }
    });
  });
};

/* ==============================
   GET CARRINHO
================================*/
export const getCart = (req: Request, res: Response) => {
  const user = (req as any).user;

  if (!user?.id) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  const sql = `
    SELECT 
      c.product_id,
      c.quantity,
      p.name,
      p.price,
      p.image_url
    FROM cart_items c
    JOIN products p ON p.id = c.product_id
    WHERE c.user_id = ?
  `;

  connection.query(sql, [user.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    res.json(result);
  });
};

/* ==============================
   INCREASE
================================*/
export const increaseCart = (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;

  if (!user?.id) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  const sql =
    "UPDATE cart_items SET quantity = quantity + 1 WHERE product_id = ? AND user_id = ?";

  connection.query(sql, [id, user.id], (err, result: any) => {
    if (err) return res.status(500).json({ error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item não encontrado no carrinho" });
    }

    res.json({ message: "Quantidade aumentada" });
  });
};

/* ==============================
   DECREASE
================================*/
export const decreaseCart = (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;

  if (!user?.id) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  const user_id = user.id;

  // primeiro diminui
  const sqlDecrease =
    "UPDATE cart_items SET quantity = quantity - 1 WHERE product_id = ? AND user_id = ?";

  connection.query(sqlDecrease, [id, user_id], (err) => {
    if (err) return res.status(500).json({ error: err });

    // depois remove se <= 0
    const sqlDelete =
      "DELETE FROM cart_items WHERE product_id = ? AND user_id = ? AND quantity <= 0";

    connection.query(sqlDelete, [id, user_id], (err) => {
      if (err) return res.status(500).json({ error: err });

      res.json({ message: "Quantidade atualizada" });
    });
  });
};

/* ==============================
   REMOVE ITEM
================================*/
export const removeCartItem = (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;

  if (!user?.id) {
    return res.status(401).json({ message: "Usuário não autenticado" });
  }

  const sql =
    "DELETE FROM cart_items WHERE product_id = ? AND user_id = ?";

  connection.query(sql, [id, user.id], (err, result: any) => {
    if (err) return res.status(500).json({ error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item não encontrado" });
    }

    res.json({ message: "Item removido" });
  });
};