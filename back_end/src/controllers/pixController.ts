import { Request, Response } from "express";
import axios from "axios";
import { connection } from "../db/connection";

function query(sql: string, values: any[] = []) {
  return new Promise<any>((resolve, reject) => {
    connection.query(sql, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

export const createPixPayment = async (req: Request, res: Response) => {
  try {
    const { total } = req.body;
    const user = (req as any).user;

    if (!total || Number(total) <= 0) {
      return res.status(400).json({ error: "Total inválido" });
    }

    // Buscar usuário
    const result = await query("SELECT id, email FROM users WHERE id = ?", [user.id]);

    if (!result.length) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const email = result[0].email;

    // Config
    const API_KEY = process.env.ASAAS_API_KEY!;
    const BASE_URL = process.env.ASAAS_BASE_URL!;

    // 🧠 1. Verifica se já tem customer salvo
    let customerId;

    const existingCustomer = await query(
      "SELECT asaas_customer_id FROM users WHERE id = ?",
      [user.id]
    );

    if (existingCustomer[0]?.asaas_customer_id) {
      customerId = existingCustomer[0].asaas_customer_id;
    } else {
      // cria cliente no Asaas
      const customerRes = await axios.post(
        `${BASE_URL}/customers`,
        {
          name: "Cliente",
          email: email,
        },
        {
          headers: {
            access_token: API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      customerId = customerRes.data.id;

      // salva no banco
      await query(
        "UPDATE users SET asaas_customer_id = ? WHERE id = ?",
        [customerId, user.id]
      );
    }

    // 💳 2. Criar pagamento PIX
    const paymentRes = await axios.post(
      `${BASE_URL}/payments`,
      {
        customer: customerId,
        billingType: "PIX",
        value: Number(Number(total).toFixed(2)),
        description: "Compra na MyStore",
      },
      {
        headers: {
          access_token: API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const payment = paymentRes.data;

    // valida retorno (evita quebrar frontend)
    if (!payment.pixQrCode) {
      return res.status(500).json({
        error: "Erro ao gerar QR Code PIX",
        details: payment,
      });
    }

    return res.json({
      id: payment.id,
      status: payment.status,
      qr_code: payment.pixQrCode,
      qr_code_base64: payment.pixQrCodeImage,
    });

  } catch (error: any) {
    console.error("❌ ERRO ASAAS:");
    console.error("STATUS:", error.response?.status);
    console.error("DATA:", JSON.stringify(error.response?.data, null, 2));
    console.error("MESSAGE:", error.message);

    return res.status(500).json({
      error: error.response?.data || error.message,
    });
  }
};