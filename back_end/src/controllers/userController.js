"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const connection_1 = require("../db/connection");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = "SECRET_KEY";
/* ==============================
   REGISTER USER
================================*/
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }
    try {
        connection_1.connection.query("SELECT id FROM users WHERE email = ?", [email], async (err, result) => {
            if (err)
                return res.status(500).json({ error: err });
            if (result.length > 0) {
                return res.status(400).json({ message: "Email já cadastrado" });
            }
            const hash = await bcrypt_1.default.hash(password, 10);
            connection_1.connection.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hash], (err) => {
                if (err)
                    return res.status(500).json({ error: err });
                res.json({ message: "Usuário criado com sucesso" });
            });
        });
    }
    catch (error) {
        res.status(500).json({ message: "Erro interno no servidor" });
    }
};
exports.registerUser = registerUser;
/* ==============================
   LOGIN USER
================================*/
const loginUser = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email e senha obrigatórios" });
    }
    connection_1.connection.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if (err)
            return res.status(500).json(err);
        if (!result.length) {
            return res.status(401).json({ message: "Usuário não encontrado" });
        }
        const user = result[0];
        const valid = await bcrypt_1.default.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ message: "Senha inválida" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
        res.json({ token });
    });
};
exports.loginUser = loginUser;
//# sourceMappingURL=userController.js.map