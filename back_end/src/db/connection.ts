import mysql, { Pool } from "mysql2";

const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.on("error", (err) => {
  console.error("MySQL pool error:", err.code);
});

pool.getConnection((err, conn) => {
  if (err) {
    console.error("Erro ao conectar ao MySQL:", err);
    return;
  }
  console.log("Conectado ao MySQL!");
  conn.release();
});

export { pool as connection };