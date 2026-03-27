import { Request, Response } from "express";
import { CreateOrderService } from "../services/CreateOrderService";
import { GetOrdersService } from "../services/GetOrdersService";

export class OrderController {
  async create(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      if (!user || !user.id) {
        return res.status(401).json({ message: "Usuário não autenticado" });
      }

      const { payment_method } = req.body;

      const service = new CreateOrderService();

      const result = await service.execute(user.id, payment_method);

      return res.json(result);
    } catch (error: any) {
      console.error("ERRO CREATE ORDER:", error);
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const user = (req as any).user;

      if (!user || !user.id) {
        return res.status(401).json({ message: "Usuário não autenticado" });
      }

      const service = new GetOrdersService();

      const orders = await service.execute(user.id);

      return res.json(orders);
    } catch (error: any) {
      console.error("ERRO GET ORDERS:", error);
      return res.status(400).json({ error: error.message });
    }
  }
}