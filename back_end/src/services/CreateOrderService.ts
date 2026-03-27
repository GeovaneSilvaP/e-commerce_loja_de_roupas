import { connection } from "../db/connection";

function query(sql: string, values: any[] = []) {
  return new Promise<any>((resolve, reject) => {
    connection.query(sql, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

export class CreateOrderService {
  async execute(user_id: number, payment_method: string) {
    if (!user_id) {
      throw new Error("Usuário inválido");
    }

    if (!payment_method) {
      throw new Error("Forma de pagamento obrigatória");
    }

    // 1. Buscar carrinho
    const cartItems: any = await query(
      `SELECT c.product_id, c.quantity, p.price
     FROM cart_items c
     JOIN products p ON p.id = c.product_id
     WHERE c.user_id = ?`,
      [user_id],
    );

    if (!cartItems || cartItems.length === 0) {
      throw new Error("Carrinho vazio");
    }

    // 2. Calcular total
    let total = 0;
    for (const item of cartItems) {
      total += item.price * item.quantity;
    }

    // 3. Status
    let status = "pending";

    if (["pix", "credit_card"].includes(payment_method)) {
      status = "paid";
    }

    // 4. Criar pedido
    const orderResult: any = await query(
      "INSERT INTO orders (user_id, total, status, payment_method) VALUES (?, ?, ?, ?)",
      [user_id, total, status, payment_method],
    );

    const order_id = orderResult.insertId;

    // 5. Criar itens
    for (const item of cartItems) {
      await query(
        "INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)",
        [order_id, item.product_id, item.quantity, item.price],
      );
    }

    // 6. Limpar carrinho
    await query("DELETE FROM cart_items WHERE user_id = ?", [user_id]);

    return {
      order_id,
      total,
      status,
      message: "Pedido criado com sucesso",
    };
  }
}
