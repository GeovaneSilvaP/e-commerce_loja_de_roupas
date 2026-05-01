"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
/**
 * Middleware de autorização para administradores
 *
 * Requer que o usuário esteja autenticado e tenha permissão de admin.
 */
const adminMiddleware = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Não autenticado" });
    }
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Acesso negado" });
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
//# sourceMappingURL=adminMiddleware.js.map