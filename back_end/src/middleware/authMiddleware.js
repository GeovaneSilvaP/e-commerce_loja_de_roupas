"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
/**
 * Middleware de autenticação
 *
 * Responsável por:
 * - Validar token JWT
 * - Extrair dados do usuário
 * - Anexar usuário à requisição
 */
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Token não fornecido" });
    }
    const [, token] = authHeader.split(" ");
    if (!token) {
        return res.status(401).json({ message: "Token inválido" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = {
            id: decoded.id,
            isAdmin: decoded.isAdmin ?? false,
        };
        next();
    }
    catch {
        return res.status(401).json({ message: "Token inválido" });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map