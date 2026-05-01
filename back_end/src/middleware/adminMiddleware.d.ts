import { Request, Response, NextFunction } from "express";
/**
 * Middleware de autorização para administradores
 *
 * Requer que o usuário esteja autenticado e tenha permissão de admin.
 */
export declare const adminMiddleware: (req: Request, res: Response, next: NextFunction) => Response | void;
//# sourceMappingURL=adminMiddleware.d.ts.map