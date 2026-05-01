import { Request, Response } from "express";
export declare const getProducts: (req: Request, res: Response) => void;
export declare const getProductById: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
export declare const createProduct: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
export declare const updateProducts: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
export declare const deleteProduct: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
export declare const getProductByCategory: (req: Request, res: Response) => void;
//# sourceMappingURL=productsControllers.d.ts.map