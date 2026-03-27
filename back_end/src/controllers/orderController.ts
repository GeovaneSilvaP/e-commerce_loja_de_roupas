import { Request, Response } from "express";
import { CreateOrderService } from "../services/CreateOrderService";
import { GetOrdersService } from "../services/GetOrdersService";

export class OrderController {
  async create(req: Request, res: Response) {
    try {
      const user = (req as any).admin;

      if (!user) {
        return res.status(401).json({ message: "Usuário não autenticado" });
      }

      const service = new CreateOrderService();

      const result = await service.execute(user.id);

      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const user = (req as any).admin;

      const service = new GetOrdersService();

      const orders = await service.execute(user.id);

      return res.json(orders);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
