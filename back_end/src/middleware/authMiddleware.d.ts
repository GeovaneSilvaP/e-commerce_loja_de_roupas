import { Request, Response, NextFunction } from "express";
/**
 * Middleware de autenticação
 *
 * Responsável por:
 * - Validar token JWT
 * - Extrair dados do usuário
 * - Anexar usuário à requisição
 */
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => Response | void;
//# sourceMappingURL=authMiddleware.d.ts.map