const express = require("express");
const pool = require("./config/db"); 

const app = express();
app.use(express.json()); 

app.get("/", (req, res) => {
    res.send("<h1>Lanchonete DB - API Ativa!</h1>");
});

app.get("/pedidos", async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT 
                p.id AS pedido_id,
                c.nome AS cliente,
                prod.nome AS produto,
                ip.quantidade,
                ip.preco_unidade
            FROM pedidos p
            JOIN clientes c ON p.cliente_id = c.id
            JOIN itens_pedido ip ON ip.pedido_id = p.id
            JOIN produtos prod ON ip.produto_id = prod.id
            ORDER BY p.id DESC;
        `);
        res.json(resultado.rows);
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao buscar pedidos da lanchonete" });
    }
});

app.post("/produtos", async (req, res) => {
    try {
        const { nome, preco } = req.body;
        const resultado = await pool.query(
            "INSERT INTO produtos (nome, preco) VALUES ($1, $2) RETURNING *",
            [nome, preco]
        );
        res.status(201).json(resultado.rows[0]);
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao cadastrar produto" });
    }
});

module.exports = app;