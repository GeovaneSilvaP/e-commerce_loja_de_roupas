import { Request, Response } from "express";
export declare class OrderController {
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getAll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    cancel(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const getAllOrdersAdmin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateOderStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=orderController.d.ts.map