"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOrdersService = void 0;
const connection_1 = require("../db/connection");
/**
 * Executa queries no banco de dados com tipagem genérica.
 *
 * Garante tipagem forte no retorno e evita uso de "any".
 */
function query(sql, values = []) {
    return new Promise((resolve, reject) => {
        connection_1.connection.query(sql, values, (err, result) => {
            if (err)
                return reject(err);
            resolve(result);
        });
    });
}
class GetOrdersService {
    /**
     * Retorna todos os pedidos de um usuário com seus respectivos itens.
     *
     * Estratégia:
     * - Busca pedidos
     * - Busca itens em lote
     * - Agrupa em memória para evitar múltiplas queries (N+1 problem)
     */
    async execute(user_id) {
        if (!user_id) {
            throw new Error("Usuário inválido");
        }
        const orders = await query(`SELECT 
        id,
        user_id,
        total,
        status,
        payment_method,
        created_at
       FROM orders 
       WHERE user_id = ? 
       ORDER BY created_at DESC`, [user_id]);
        if (orders.length === 0) {
            return [];
        }
        const orderIds = orders.map((order) => order.id);
        const items = await query(`SELECT 
        id,
        order_id,
        product_id,
        name,
        image_url,
        quantity,
        price_at_purchase
       FROM order_items 
       WHERE order_id IN (?)`, [orderIds]);
        /**
         * Agrupa itens por pedido utilizando abordagem otimizada.
         */
        const itemsMap = {};
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
exports.GetOrdersService = GetOrdersService;
//# sourceMappingURL=GetOrdersService.js.map