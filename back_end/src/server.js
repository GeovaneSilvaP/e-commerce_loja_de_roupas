"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const productsRoutes_1 = __importDefault(require("./routes/productsRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const pixRoutes_1 = __importDefault(require("./routes/pixRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 3000;
/**
 * Middlewares globais
 *
 * Responsáveis por:
 * - Interpretar requisições JSON
 * - Habilitar comunicação entre diferentes origens (CORS)
 */
app.use(express_1.default.json());
app.use((0, cors_1.default)());
/**
 * Registro das rotas da aplicação
 *
 * Cada módulo representa um domínio da aplicação
 * (produtos, carrinho, pedidos, usuários, etc.)
 */
app.use(productsRoutes_1.default);
app.use(cartRoutes_1.default);
app.use(adminRoutes_1.default);
app.use(orderRoutes_1.default);
app.use(userRoutes_1.default);
app.use(pixRoutes_1.default);
app.use(reviewRoutes_1.default);
/**
 * Servir arquivos estáticos
 *
 * Permite acesso público aos arquivos enviados (uploads),
 * como imagens de produtos.
 */
app.use("/uploads", express_1.default.static(path_1.default.resolve(__dirname, "../uploads")));
/**
 * Middleware global de tratamento de erros
 *
 * Centraliza o tratamento de erros da aplicação,
 * garantindo respostas padronizadas e evitando vazamento
 * de informações sensíveis.
 *
 * Deve ser o último middleware registrado.
 */
app.use((err, _req, res, _next) => {
    if (err instanceof Error) {
        console.error("ERRO GLOBAL:", {
            message: err.message,
            stack: err.stack,
        });
        return res.status(500).json({
            message: err.message,
        });
    }
    console.error("ERRO DESCONHECIDO:", err);
    return res.status(500).json({
        message: "Erro interno do servidor",
    });
});
/**
 * Inicialização do servidor
 */
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
//# sourceMappingURL=server.js.map