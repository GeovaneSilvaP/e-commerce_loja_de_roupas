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
export declare class CreateOrderService {
    /**
     * Cria um novo pedido baseado no carrinho do usuário.
     *
     * Regras:
     * - Usuário deve existir
     * - Carrinho não pode estar vazio
     * - Pedido é criado com status automático baseado no pagamento
     */
    execute(user_id: number, payment_method: string): Promise<CreateOrderResponse>;
}
export {};
//# sourceMappingURL=CreateOrderService.d.ts.map