import { Request, Response } from "express";
export declare const addToCart: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
export declare const getCart: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
export declare const increaseCart: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
export declare const decreaseCart: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
export declare const removeCartItem: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=cartItemsControllers.d.ts.map