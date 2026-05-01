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
export declare class GetOrdersService {
    /**
     * Retorna todos os pedidos de um usuário com seus respectivos itens.
     *
     * Estratégia:
     * - Busca pedidos
     * - Busca itens em lote
     * - Agrupa em memória para evitar múltiplas queries (N+1 problem)
     */
    execute(user_id: number): Promise<Order[]>;
}
export {};
//# sourceMappingURL=GetOrdersService.d.ts.map