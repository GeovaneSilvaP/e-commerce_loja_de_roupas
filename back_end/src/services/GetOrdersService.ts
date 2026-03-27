import { connection } from "../db/connection";

function query(sql: string, values: any[] = []) {
  return new Promise<any>((resolve, reject) => {
    connection.query(sql, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

export class GetOrdersService {
  async execute(user_id: number) {
    const orders: any = await query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [user_id]
    );

    for (const order of orders) {
      const items = await query(
        `SELECT oi.*, p.name, p.image_url
         FROM order_items oi
         LEFT JOIN products p ON p.id = oi.product_id
         WHERE oi.order_id = ?`,
        [order.id]
      );

      order.items = items || [];
    }

    return orders;
  }
}