import mysql, { Connection } from "mysql2";

export const connection: Connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mine_ecommerce",
});

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar", err);
    return;
  }

  console.log("Conectado ao MySQL!");
});
