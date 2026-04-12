import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

/**
 * Payload esperado do token JWT.
 */
interface TokenPayload extends JwtPayload {
  id: number;
  isAdmin?: boolean;
}

/**
 * Middleware de autenticação
 *
 * Responsável por:
 * - Validar token JWT
 * - Extrair dados do usuário
 * - Anexar usuário à requisição
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return res.status(401).json({ message: "Token inválido" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    req.user = {
      id: decoded.id,
      isAdmin: decoded.isAdmin ?? false,
    };

    next();
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }
};