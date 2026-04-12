import { connection } from "../db/connection";

/**
 * Executa queries no banco de dados com tipagem genérica.
 *
 * Garante tipagem forte no retorno e evita uso de "any".
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
 * Status possíveis de um pedido.
 */
type OrderStatus = "paid" | "pending" | "canceled";

/**
 * Representa um item de pedido.
 */
interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  name: string;
  image_url: string;
  quantity: number;
  price_at_purchase: number;
}

/**
 * Representa um pedido base (sem itens).
 */
interface OrderBase {
  id: number;
  user_id: number;
  total: number;
  status: OrderStatus;
  payment_method: string;
  created_at: string;
}

/**
 * Representa um pedido completo com itens.
 */
interface Order extends OrderBase {
  items: OrderItem[];
}

export class GetOrdersService {
  /**
   * Retorna todos os pedidos de um usuário com seus respectivos itens.
   *
   * Estratégia:
   * - Busca pedidos
   * - Busca itens em lote
   * - Agrupa em memória para evitar múltiplas queries (N+1 problem)
   */
  async execute(user_id: number): Promise<Order[]> {
    if (!user_id) {
      throw new Error("Usuário inválido");
    }

    const orders = await query<OrderBase[]>(
      `SELECT 
        id,
        user_id,
        total,
        status,
        payment_method,
        created_at
       FROM orders 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [user_id]
    );

    if (orders.length === 0) {
      return [];
    }

    const orderIds = orders.map((order) => order.id);

    const items = await query<OrderItem[]>(
      `SELECT 
        id,
        order_id,
        product_id,
        name,
        image_url,
        quantity,
        price_at_purchase
       FROM order_items 
       WHERE order_id IN (?)`,
      [orderIds]
    );

    /**
     * Agrupa itens por pedido utilizando abordagem otimizada.
     */
    const itemsMap: Record<number, OrderItem[]> = {};

    for (const item of items) {
      (itemsMap[item.order_id] ??= []).push(item);
    }

    /**
     * Combina pedidos com seus respectivos itens.
     */
    return orders.map((order) => ({
      ...order,
      items: itemsMap[order.id] ?? [],
    }));
  }
}