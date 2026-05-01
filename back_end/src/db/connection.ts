import mysql, { Connection } from "mysql2";

export const connection: Connection = mysql.createConnection({
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
});

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar", err);
    return;
  }

  console.log("Conectado ao MySQL!");
});