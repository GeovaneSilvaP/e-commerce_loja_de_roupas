import "dotenv/config";

import express, {
  Application,
  Request,
  Response,
  NextFunction,
} from "express";
import cors from "cors";
import path from "path";

import productsRoutes from "./routes/productsRoutes";
import cartRoutes from "./routes/cartRoutes";
import adminRoutes from "./routes/adminRoutes";
import orderRoutes from "./routes/orderRoutes";
import userRoutes from "./routes/userRoutes";
import pixRoutes from "./routes/pixRoutes";
import reviewRoutes from "./routes/reviewRoutes";

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

/**
 * Middlewares globais
 *
 * Responsáveis por:
 * - Interpretar requisições JSON
 * - Habilitar comunicação entre diferentes origens (CORS)
 */
app.use(express.json());
app.use(cors());

/**
 * Registro das rotas da aplicação
 *
 * Cada módulo representa um domínio da aplicação
 * (produtos, carrinho, pedidos, usuários, etc.)
 */
app.use(productsRoutes);
app.use(cartRoutes);
app.use(adminRoutes);
app.use(orderRoutes);
app.use(userRoutes);
app.use(pixRoutes);
app.use(reviewRoutes);

/**
 * Servir arquivos estáticos
 *
 * Permite acesso público aos arquivos enviados (uploads),
 * como imagens de produtos.
 */
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

/**
 * Middleware global de tratamento de erros
 *
 * Centraliza o tratamento de erros da aplicação,
 * garantindo respostas padronizadas e evitando vazamento
 * de informações sensíveis.
 *
 * Deve ser o último middleware registrado.
 */
app.use(
  (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): Response => {
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
  }
);

/**
 * Inicialização do servidor
 */
app.listen(PORT, (): void => {
  console.log(`Servidor rodando na porta ${PORT}`);
});