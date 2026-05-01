"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductByCategory = exports.deleteProduct = exports.updateProducts = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const connection_1 = require("../db/connection");
const getProducts = (req, res) => {
    connection_1.connection.query("SELECT * FROM products", (err, results) => {
        if (err)
            return res.status(500).json({ error: err });
        res.json(results);
    });
};
exports.getProducts = getProducts;
const getProductById = (req, res) => {
    const { id } = req.params;
    if (!id)
        return res.status(400).json({ message: "ID é obrigatório" });
    connection_1.connection.query("SELECT * FROM products WHERE id = ?", [id], (err, result) => {
        if (err)
            return res.status(500).json({ error: err });
        if (!result.length)
            return res.status(404).json({ message: "Produto não encontrado" });
        res.json(result[0]);
    });
};
exports.getProductById = getProductById;
const createProduct = (req, res) => {
    const { name, price, description, stock, category } = req.body;
    const image = req.file?.path;
    if (!name || !price || !stock) {
        return res.status(400).json({ message: "Nome, preço e estoque são obrigatórios" });
    }
    const sql = "INSERT INTO products (name, price, description, stock, image_url, category) VALUES (?, ?, ?, ?, ?, ?)";
    connection_1.connection.query(sql, [name, Number(price), description, Number(stock), image, category || "outros"], (err) => {
        if (err)
            return res.status(500).json({ error: err });
        res.json({ message: "Produto criado com sucesso" });
    });
};
exports.createProduct = createProduct;
const updateProducts = (req, res) => {
    const { id } = req.params;
    const { name, price, description, stock, category } = req.body;
    const image = req.file?.path;
    if (!id)
        return res.status(400).json({ message: "ID é obrigatório" });
    let sql = "UPDATE products SET name=?, price=?, description=?, stock=?, category=?";
    const params = [name, Number(price), description, Number(stock), category || "outros"];
    if (image) {
        sql += ", image_url=?";
        params.push(image);
    }
    sql += " WHERE id=?";
    params.push(id);
    connection_1.connection.query(sql, params, (err, result) => {
        if (err)
            return res.status(500).json({ error: err });
        if (result.affectedRows === 0)
            return res.status(404).json({ message: "Produto não encontrado" });
        res.json({ message: "Produto atualizado com sucesso" });
    });
};
exports.updateProducts = updateProducts;
const deleteProduct = (req, res) => {
    const { id } = req.params;
    if (!id)
        return res.status(400).json({ message: "ID é obrigatório" });
    connection_1.connection.query("DELETE FROM products WHERE id = ?", [id], (err, result) => {
        if (err)
            return res.status(500).json({ error: err });
        if (result.affectedRows === 0)
            return res.status(404).json({ message: "Produto não encontrado" });
        res.json({ message: "Produto deletado com sucesso" });
    });
};
exports.deleteProduct = deleteProduct;
const getProductByCategory = (req, res) => {
    const { category } = req.params;
    connection_1.connection.query("SELECT * FROM products WHERE category = ?", [category], (err, results) => {
        if (err)
            return res.status(500).json({ error: err });
        res.json(results);
    });
};
exports.getProductByCategory = getProductByCategory;
//# sourceMappingURL=productsControllers.js.map