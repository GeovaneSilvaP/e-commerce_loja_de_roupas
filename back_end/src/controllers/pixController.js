"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPixPayment = void 0;
const mercadopago_1 = require("mercadopago");
const connection_1 = require("../db/connection");
const client = new mercadopago_1.MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
});
function query(sql, values = []) {
    return new Promise((resolve, reject) => {
        connection_1.connection.query(sql, values, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        });
    });
}
const createPixPayment = async (req, res) => {
    try {
        const { total } = req.body;
        const user = req.user;
        if (!total) {
            return res.status(400).json({ message: "Total é obrigatório" });
        }
        // Busca email do usuário no banco pelo id
        const result = await query("SELECT email FROM users WHERE id = ?", [user.id]);
        if (!result.length) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
        const email = result[0].email;
        const payment = new mercadopago_1.Payment(client);
        const pixResult = await payment.create({
            body: {
                transaction_amount: Number(Number(total).toFixed(2)),
                description: "Compra na MyStore",
                payment_method_id: "pix",
                payer: {
                    email,
                },
            },
        });
        return res.json({
            id: pixResult.id,
            status: pixResult.status,
            qr_code: pixResult.point_of_interaction?.transaction_data?.qr_code,
            qr_code_base64: pixResult.point_of_interaction?.transaction_data?.qr_code_base64,
        });
    }
    catch (error) {
        console.error("Erro Pix:", error);
        return res.status(500).json({ error: error.message });
    }
};
exports.createPixPayment = createPixPayment;
//# sourceMappingURL=pixController.js.map