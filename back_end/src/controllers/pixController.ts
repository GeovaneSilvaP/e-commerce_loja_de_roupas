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

    if (!total) {
      return res.status(400).json({ message: "Total é obrigatório" });
    }

    // Buscar email do usuário
    const result = await query("SELECT email FROM users WHERE id = ?", [user.id]);

    if (!result.length) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const email = result[0].email;

    // Criar cliente no Asaas
    const customerResponse = await axios.post(
      `${process.env.ASAAS_BASE_URL}/customers`,
      {
        name: "Cliente Teste",
        email: email,
      },
      {
        headers: {
          access_token: process.env.ASAAS_API_KEY,
        },
      }
    );

    const customerId = customerResponse.data.id;

    // Criar cobrança PIX
    const paymentResponse = await axios.post(
      `${process.env.ASAAS_BASE_URL}/payments`,
      {
        customer: customerId,
        billingType: "PIX",
        value: Number(Number(total).toFixed(2)),
        description: "Compra na MyStore",
      },
      {
        headers: {
          access_token: process.env.ASAAS_API_KEY,
        },
      }
    );

    const payment = paymentResponse.data;

    return res.json({
      id: payment.id,
      status: payment.status,
      qr_code: payment.pixQrCode,
      qr_code_base64: payment.pixQrCodeImage,
    });

  } catch (error: any) {
    console.error("Erro Asaas:", error.response?.data || error.message);
    return res.status(500).json({
      error: error.response?.data || error.message,
    });
  }
};