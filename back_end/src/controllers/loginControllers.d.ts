import { Request, Response } from "express";
export declare const registerUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const loginUser: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
export declare const registerAdmin: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const loginAdmin: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=loginControllers.d.ts.map