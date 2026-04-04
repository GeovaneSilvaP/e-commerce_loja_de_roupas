import { Request, Response } from "express";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { connection } from "../db/connection";

const client = new MercadoPagoConfig({
  accessToken: "APP_USR-5103648830774592-040413-7b4ffb66e03e5fa61d1e6d5a5f8965de-3313855160",
});

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

    // ✅ Busca email do usuário no banco pelo id
    const result = await query("SELECT email FROM users WHERE id = ?", [user.id]);

    if (!result.length) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const email = result[0].email;

    const payment = new Payment(client);

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
  } catch (error: any) {
    console.error("Erro Pix:", error);
    return res.status(500).json({ error: error.message });
  }
};