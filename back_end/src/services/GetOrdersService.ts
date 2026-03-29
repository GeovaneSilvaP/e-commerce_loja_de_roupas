import { connection } from "../db/connection";

// TIPAGEM DOS ITENS
type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  name: string;
  image_url: string;
  quantity: number;
  price_at_purchase: number;
};

// TIPAGEM DOS PEDIDOS
type Order = {
  id: number;
  user_id: number;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
  items?: OrderItem[];
};

// FUNÇÃO QUERY PADRÃO
function query<T = any>(sql: string, values: any[] = []): Promise<T> {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (err, result:any) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

export class GetOrdersService {
  async execute(user_id: number): Promise<Order[]> {
    if (!user_id) {
      throw new Error("Usuário inválido");
    }

    // 1. Buscar pedidos
    const orders = await query<Order[]>(
      `SELECT * FROM orders 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [user_id]
    );

    if (!orders.length) return [];

    const orderIds = orders.map((o) => o.id);

    // 2. Buscar todos os itens
    const items = await query<OrderItem[]>(
      `SELECT * FROM order_items 
       WHERE order_id IN (?)`,
      [orderIds]
    );

    // 3. Criar mapa de itens (CORRIGIDO)
    const itemsMap: Record<number, OrderItem[]> = {};

    for (const item of items) {
      (itemsMap[item.order_id] ??= []).push(item);
    }

    // 4. Montar resposta final
    const result = orders.map((order) => ({
      ...order,
      items: itemsMap[order.id] || [],
    }));

    return result;
  }
}