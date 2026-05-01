"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCartItem = exports.decreaseCart = exports.increaseCart = exports.getCart = exports.addToCart = void 0;
const connection_1 = require("../db/connection");
/* ==============================
   ADD AO CARRINHO
================================*/
const addToCart = (req, res) => {
    const { product_id, quantity } = req.body;
    const user = req.user;
    if (!user?.id) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }
    if (!product_id) {
        return res.status(400).json({ message: "product_id é obrigatório" });
    }
    const user_id = user.id;
    const qty = quantity && quantity > 0 ? quantity : 1;
    // VERIFICAR SE PRODUTO EXISTE
    const sqlProduct = "SELECT id FROM products WHERE id = ?";
    connection_1.connection.query(sqlProduct, [product_id], (err, product) => {
        if (err)
            return res.status(500).json({ error: err });
        if (!product.length) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }
        if (product[0].stock <= 0) {
            return res.status(400).json({ message: "Produto fora de estoque" });
        }
        // VERIFICAR SE JÁ EXISTE NO CARRINHO
        const sqlCheck = "SELECT quantity FROM cart_items WHERE product_id = ? AND user_id = ?";
        connection_1.connection.query(sqlCheck, [product_id, user_id], (err, result) => {
            if (err)
                return res.status(500).json({ error: err });
            if (result.length > 0) {
                // ATUALIZA QUANTIDADE
                if (result[0].quantity >= product[0].stock) {
                    return res
                        .status(400)
                        .json({ message: "Quantidade máxima em estoque atingida" });
                }
                const sqlUpdate = "UPDATE cart_items SET quantity = quantity + ? WHERE product_id = ? AND user_id = ?";
                connection_1.connection.query(sqlUpdate, [qty, product_id, user_id], (err) => {
                    if (err)
                        return res.status(500).json({ error: err });
                    return res.json({ message: "Quantidade atualizada" });
                });
            }
            else {
                // INSERE NOVO ITEM
                const sqlInsert = "INSERT INTO cart_items (product_id, quantity, user_id) VALUES (?, ?, ?)";
                connection_1.connection.query(sqlInsert, [product_id, qty, user_id], (err) => {
                    if (err)
                        return res.status(500).json({ error: err });
                    return res.json({ message: "Adicionado ao carrinho" });
                });
            }
        });
    });
};
exports.addToCart = addToCart;
/* ==============================
   GET CARRINHO
================================*/
const getCart = (req, res) => {
    const user = req.user;
    if (!user?.id) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }
    const sql = `
    SELECT 
      c.product_id,
      c.quantity,
      p.name,
      p.price,
      p.image_url
    FROM cart_items c
    JOIN products p ON p.id = c.product_id
    WHERE c.user_id = ?
  `;
    connection_1.connection.query(sql, [user.id], (err, result) => {
        if (err)
            return res.status(500).json({ error: err });
        res.json(result);
    });
};
exports.getCart = getCart;
/* ==============================
   INCREASE
================================*/
const increaseCart = (req, res) => {
    const { id } = req.params;
    const user = req.user;
    if (!user?.id) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }
    const sql = "UPDATE cart_items SET quantity = quantity + 1 WHERE product_id = ? AND user_id = ?";
    connection_1.connection.query(sql, [id, user.id], (err, result) => {
        if (err)
            return res.status(500).json({ error: err });
        if (result.affectedRows === 0) {
            return res
                .status(404)
                .json({ message: "Item não encontrado no carrinho" });
        }
        res.json({ message: "Quantidade aumentada" });
    });
};
exports.increaseCart = increaseCart;
/* ==============================
   DECREASE
================================*/
const decreaseCart = (req, res) => {
    const { id } = req.params;
    const user = req.user;
    if (!user?.id) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }
    const user_id = user.id;
    // primeiro diminui
    const sqlDecrease = "UPDATE cart_items SET quantity = quantity - 1 WHERE product_id = ? AND user_id = ?";
    connection_1.connection.query(sqlDecrease, [id, user_id], (err) => {
        if (err)
            return res.status(500).json({ error: err });
        // depois remove se <= 0
        const sqlDelete = "DELETE FROM cart_items WHERE product_id = ? AND user_id = ? AND quantity <= 0";
        connection_1.connection.query(sqlDelete, [id, user_id], (err) => {
            if (err)
                return res.status(500).json({ error: err });
            res.json({ message: "Quantidade atualizada" });
        });
    });
};
exports.decreaseCart = decreaseCart;
/* ==============================
   REMOVE ITEM
================================*/
const removeCartItem = (req, res) => {
    const { id } = req.params;
    const user = req.user;
    if (!user?.id) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }
    const sql = "DELETE FROM cart_items WHERE product_id = ? AND user_id = ?";
    connection_1.connection.query(sql, [id, user.id], (err, result) => {
        if (err)
            return res.status(500).json({ error: err });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Item não encontrado" });
        }
        res.json({ message: "Item removido" });
    });
};
exports.removeCartItem = removeCartItem;
//# sourceMappingURL=cartItemsControllers.js.map