import { JwtPayload } from "jsonwebtoken";

export interface AuthUser {
  id: number;
  isAdmin: boolean;
}

/**
 * Extensão global do Request do Express
 */
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
