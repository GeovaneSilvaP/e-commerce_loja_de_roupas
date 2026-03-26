import express from "express";
import cors from "cors";
import path from "path";
import productsRoutes from "./routes/productsRoutes";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use(productsRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});