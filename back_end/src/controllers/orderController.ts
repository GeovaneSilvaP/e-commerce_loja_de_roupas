import { Request, Response } from "express";
import { CreateOrderService } from "../services/CreateOrderService";
import { GetOrdersService } from "../services/GetOrdersService";
import { connection } from "../db/connection"; // adiciona esse import

// função query local
function query(sql: string, values: any[] = []) {
  return new Promise<any>((resolve, reject) => {
    connection.query(sql, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

export class OrderController {
  async create(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      if (!user?.id) {
        return res.status(401).json({ message: "Usuário não autenticado" });
      }

      const { payment_method } = req.body;

      if (!payment_method) {
        return res
          .status(400)
          .json({ message: "Forma de pagamento obrigatória" });
      }

      const service = new CreateOrderService();
      const result = await service.execute(user.id, payment_method);

      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      if (!user || !user.id) {
        return res.status(401).json({ message: "Usuário não autenticado" });
      }

      const service = new GetOrdersService();
      const orders = await service.execute(user.id);

      return res.json(orders);
    } catch (error: any) {
      console.error("ERRO GET ORDERS:", error);
      return res.status(400).json({ error: error.message });
    }
  }

  async cancel(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const { id } = req.params;

      const orders: any[] = await query(
        "SELECT * FROM orders WHERE id = ? AND user_id = ?",
        [id, user.id],
      );

      if (!orders.length) {
        return res.status(404).json({ message: "Pedido não encontrado" });
      }

      if (orders[0].status === "cancelled") {
        return res.status(404).json({ message: "Pedido já cancelado" });
      }

      if (orders[0].status === "completed") {
        return res
          .status(404)
          .json({ message: "Pedido concluído não pode ser cancelado" });
      }

      await query("UPDATE orders SET status = 'cancelled' WHERE id = ?", [id]);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}

/* ==============================
   GET ALL ORDERS (ADMIN)
================================*/
export const getAllOrdersAdmin = async (req: Request, res: Response) => {
  try {
    const sql = `
      SELECT 
        o.id,
        o.total,
        o.status,
        o.payment_method,
        o.created_at,
        u.name AS user_name,
        u.email AS user_email
      FROM orders o
      JOIN users u ON u.id = o.user_id
      ORDER BY o.created_at DESC
    `;

    const orders: any[] = await query(sql);

    const itemsSql = `
      SELECT 
        oi.order_id,
        oi.name,
        oi.quantity,
        oi.price_at_purchase,
        oi.image_url
      FROM order_items oi
    `;

    const items: any[] = await query(itemsSql);

    const result = orders.map((order) => ({
      ...order,
      items: items.filter((item) => item.order_id === order.id),
    }));

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

/* ==============================
   UPDATE ORDER STATUS (ADMIN)
================================*/
export const updateOderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatues = ["pending", "paid", "completed", "cancelled"];

    if (!validStatues.includes(status)) {
      return res.status(400).json({ message: "Status inválido" });
    }

    await query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);

    return res.json({ message: "Status atualizado com sucesso" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

/* ==============================
   DELETE ORDER (ADMIN)
================================*/
export const deleteOrderAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const orders: any[] = await query("SELECT * FROM orders WHERE id = ?", [
      id,
    ]);

    if (!orders.length) {
      return res.status(400).json({ message: "Pedido não encontrado" });
    }

    await query("DELETE FROM order_items WHERE order_id = ?", [id]);
    await query("DELETE FROM orders WHERE id = ?", [id]);

    return res.json({ message: "Pedido excluído com sucesso" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
