import { connection } from "../db/connection";

/**
 * Executa queries no banco de dados com tipagem genérica.
 *
 * Permite definir o tipo de retorno esperado em cada chamada,
 * garantindo segurança e autocomplete.
 */
function query<T>(sql: string, values: unknown[] = []): Promise<T> {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result as T);
    });
  });
}

/**
 * Representa um item do carrinho com dados do produto.
 */
interface CartItem {
  product_id: number;
  quantity: number;
  price: number;
  name: string;
  image_url: string;
}

/**
 * DTO de resposta da criação de pedido.
 */
interface CreateOrderResponse {
  order_id: number;
  total: number;
  status: "paid" | "pending";
  payment_method: string;
  message: string;
}

export class CreateOrderService {
  /**
   * Cria um novo pedido baseado no carrinho do usuário.
   *
   * Regras:
   * - Usuário deve existir
   * - Carrinho não pode estar vazio
   * - Pedido é criado com status automático baseado no pagamento
   */
  async execute(
    user_id: number,
    payment_method: string
  ): Promise<CreateOrderResponse> {
    if (!user_id) {
      throw new Error("Usuário inválido");
    }

    if (!payment_method) {
      throw new Error("Forma de pagamento obrigatória");
    }

    const cartItems = await query<CartItem[]>(
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

    if (cartItems.length === 0) {
      throw new Error("Carrinho vazio");
    }

    /**
     * Calcula o valor total do pedido com base nos itens do carrinho.
     */
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    /**
     * Define status automaticamente conforme método de pagamento.
     */
    const status: "paid" | "pending" =
      payment_method === "pix" || payment_method === "credit_card"
        ? "paid"
        : "pending";

    const orderResult = await query<{ insertId: number }>(
      `INSERT INTO orders (user_id, total, status, payment_method) 
       VALUES (?, ?, ?, ?)`,
      [user_id, total, status, payment_method]
    );

    const order_id = orderResult.insertId;

    /**
     * Prepara inserção em lote dos itens do pedido.
     */
    const values: Array<
      [number, number, string, string, number, number]
    > = cartItems.map((item) => [
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

    /**
     * Remove itens do carrinho após criação do pedido.
     */
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