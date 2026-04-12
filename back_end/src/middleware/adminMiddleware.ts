import { Request, Response, NextFunction } from "express";

/**
 * Middleware de autorização para administradores
 *
 * Requer que o usuário esteja autenticado e tenha permissão de admin.
 */
export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  if (!req.user) {
    return res.status(401).json({ message: "Não autenticado" });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Acesso negado" });
  }

  next();
};