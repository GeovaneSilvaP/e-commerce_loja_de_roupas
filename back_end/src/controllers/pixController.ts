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

    const result = await query("SELECT id, email FROM users WHERE id = ?", [user.id]);

    if (!result.length) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const email = result[0].email;

    const API_KEY = process.env.ASAAS_API_KEY!;
    const BASE_URL = process.env.ASAAS_BASE_URL!;

    // 1. Verifica ou cria customer
    let customerId: string;

    const existingCustomer = await query(
      "SELECT asaas_customer_id FROM users WHERE id = ?",
      [user.id]
    );

    if (existingCustomer[0]?.asaas_customer_id) {
      customerId = existingCustomer[0].asaas_customer_id;
    } else {
      const customerRes = await axios.post(
        `${BASE_URL}/customers`,
        {
          name: email.split("@")[0], // Asaas exige name não vazio e minimamente válido
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

      await query(
        "UPDATE users SET asaas_customer_id = ? WHERE id = ?",
        [customerId, user.id]
      );
    }

    // 2. Criar pagamento PIX — dueDate é obrigatório no Asaas
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);
    const dueDateStr = dueDate.toISOString().split("T")[0]; // "YYYY-MM-DD"

    const paymentRes = await axios.post(
      `${BASE_URL}/payments`,
      {
        customer: customerId,
        billingType: "PIX",
        value: Number(Number(total).toFixed(2)),
        dueDate: dueDateStr,
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

    // 3. Buscar QR Code — endpoint separado no Asaas
    const pixRes = await axios.get(
      `${BASE_URL}/payments/${payment.id}/pixQrCode`,
      {
        headers: {
          access_token: API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const pixData = pixRes.data;

    if (!pixData?.encodedImage || !pixData?.payload) {
      return res.status(500).json({
        error: "QR Code PIX não disponível",
        details: pixData,
      });
    }

    return res.json({
      id: payment.id,
      status: payment.status,
      qr_code: pixData.payload,           // texto "copia e cola"
      qr_code_base64: pixData.encodedImage, // imagem base64
    });

  } catch (error: any) {
    console.error("❌ ERRO ASAAS:");
    console.error("STATUS:", error.response?.status);
    console.error("DATA:", JSON.stringify(error.response?.data, null, 2));
    console.error("MESSAGE:", error.message);

    return res.status(500).json({
      error: error.response?.data?.errors?.[0]?.description
        || error.response?.data?.error
        || error.message,
    });
  }
};