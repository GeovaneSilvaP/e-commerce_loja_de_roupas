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

    // 1. Buscar carrinho (COM DADOS COMPLETOS)
    const cartItems: any[] = await query(
      `SELECT 
        c.product_id,
        c.quantity,
        p.price,
        p.name,
        p.image_url
       FROM cart_items c
       JOIN products p ON p.id = c.product_id
       WHERE c.user_id = ?`,
      [user_id]
    );

    if (!cartItems.length) {
      throw new Error("Carrinho vazio");
    }

    // 2. Calcular total (mais limpo)
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // 3. Status automático
    const status =
      payment_method === "pix" || payment_method === "credit_card"
        ? "paid"
        : "pending";

    // 4. Criar pedido
    const orderResult: any = await query(
      `INSERT INTO orders (user_id, total, status, payment_method) 
       VALUES (?, ?, ?, ?)`,
      [user_id, total, status, payment_method]
    );

    const order_id = orderResult.insertId;

    // 5. Inserir itens (EM LOTE - MUITO MAIS RÁPIDO)
    const values = cartItems.map((item) => [
      order_id,
      item.product_id,
      item.name,
      item.image_url,
      item.quantity,
      item.price,
    ]);

    await query(
      `INSERT INTO order_items 
       (order_id, product_id, name, image_url, quantity, price_at_purchase) 
       VALUES ?`,
      [values]
    );

    // 6. Limpar carrinho
    await query("DELETE FROM cart_items WHERE user_id = ?", [user_id]);

    return {
      order_id,
      total,
      status,
      payment_method,
      message: "Pedido criado com sucesso",
    };
  }
}