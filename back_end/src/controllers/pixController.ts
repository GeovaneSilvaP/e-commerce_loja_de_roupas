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

    const result = await query(
      "SELECT id, email, cpf, asaas_customer_id FROM users WHERE id = ?",
      [user.id]
    );

    if (!result.length) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const { email, cpf, asaas_customer_id } = result[0];

    const API_KEY = process.env.ASAAS_API_KEY!;
    const BASE_URL = process.env.ASAAS_BASE_URL!;

    // 1. Verifica ou cria customer
    let customerId: string;

    if (asaas_customer_id) {
      customerId = asaas_customer_id;
    } else {
      // CPF obrigatório para criar customer no Asaas
      if (!cpf) {
        return res.status(400).json({
          error: "CPF obrigatório para realizar pagamento via Pix",
          needsCpf: true,
        });
      }

      const cpfCnpj = cpf.replace(/\D/g, "");

      if (cpfCnpj.length !== 11) {
        return res.status(400).json({ error: "CPF inválido" });
      }

      const customerRes = await axios.post(
        `${BASE_URL}/customers`,
        {
          name: email.split("@")[0],
          email,
          cpfCnpj,
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

    // 2. Criar pagamento PIX
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);
    const dueDateStr = dueDate.toISOString().split("T")[0];

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

    // 3. Buscar QR Code
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
      qr_code: pixData.payload,
      qr_code_base64: pixData.encodedImage,
    });

  } catch (error: any) {
    console.error("❌ ERRO ASAAS:");
    console.error("STATUS:", error.response?.status);
    console.error("DATA:", JSON.stringify(error.response?.data, null, 2));
    console.error("MESSAGE:", error.message);

    return res.status(500).json({
      error:
        error.response?.data?.errors?.[0]?.description ||
        error.response?.data?.error ||
        error.message,
    });
  }
};