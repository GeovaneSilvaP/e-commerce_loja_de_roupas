import express from "express";
import cors from "cors";
import path from "path";
import "dotenv/config";

import productsRoutes from "./routes/productsRoutes";
import cartRoutes from "./routes/cartRoutes";
import adminRoutes from "./routes/adminRoutes";
import orderRoutes from "./routes/orderRoutes";
import userRoutes from "./routes/userRoutes";
import pixRoutes from "./routes/pixRoutes";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use(productsRoutes);
app.use(cartRoutes);
app.use(adminRoutes);
app.use(orderRoutes);
app.use(userRoutes);
app.use(pixRoutes);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
