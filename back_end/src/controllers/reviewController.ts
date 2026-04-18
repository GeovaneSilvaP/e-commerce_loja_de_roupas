import { Request, Response } from "express";
import { connection } from "../db/connection";

function query(sql: string, values: any[] = []) {
  return new Promise<any>((resolve, reject) => {
    connection.query(sql, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

/* ==============================
   CRIAR AVALIAÇÃO
================================*/
export const createReview = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { id: product_id } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Avaliação deve ser entre 1 e 5" });
    }

    // Verifica se já avaliou
    const existing = await query(
      "SELECT id FROM reviews WHERE product_id = ? AND user_id = ?",
      [product_id, user.id]
    );

    if (existing.length > 0) {
      // Atualiza se já avaliou
      await query(
        "UPDATE reviews SET rating = ? WHERE product_id = ? AND user_id = ?",
        [rating, product_id, user.id]
      );
      return res.json({ message: "Avaliação atualizada!" });
    }

    await query(
      "INSERT INTO reviews (product_id, user_id, rating) VALUES (?, ?, ?)",
      [product_id, user.id, rating]
    );

    return res.json({ message: "Avaliação enviada!" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

/* ==============================
   BUSCAR AVALIAÇÕES DO PRODUTO
================================*/
export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { id: product_id } = req.params;

    const result = await query(
      `SELECT 
        COUNT(*) as total,
        AVG(rating) as average,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one
       FROM reviews WHERE product_id = ?`,
      [product_id]
    );

    return res.json(result[0]);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};