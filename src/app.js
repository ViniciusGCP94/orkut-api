const express = require('express');
const pool = require('./config/db')
const validarUsuario = require('./validations/usuarios');
const validarPost = require('./validations/posts');

const app = express();
app.use(express.json());

function formatarData(data) {
    return new Date(data).toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
    });
}

app.get('/', (req, res) => {
    res.send('<h1>Bem-vindo à API do OrkutVNW!</h1>');
});

// GET dos usuários
app.get('/usuarios', async (req, res) => {
    try{
        const resultado = await pool.query(`
        SELECT
           *
        FROM usuarios;
    `);
        res.json(resultado.rows);

    } catch (erro){
        res.status(500).json({ error: 'Erro ao buscar dados dos usuários' });
    }
})

// GET das postagens
app.get('/posts', async (req, res) => {
    try {
        const resultado = await pool.query(`
        SELECT
            usuarios.id AS usuario_id,
            usuarios.nome,
            postagens.titulo,
            postagens.conteudo,
            postagens.criado_em,
            postagens.id AS post_id
        FROM postagens
        JOIN usuarios 
        ON postagens.usuario_id = usuarios.id
        ORDER BY postagens.criado_em DESC
        `);

        const dadosFormatados = resultado.rows.map((post) => ({
            ...post,
            criado_em: formatarData(post.criado_em),
        }));

        res.json(dadosFormatados);
    }

    catch (erro){
        res.status(500).json({ error: 'Erro ao buscar os posts' });
    }
})


//Post das postagens
app.post('/posts', validarPost, async (req, res) => {
    try {
        const { titulo, conteudo, usuario_id } = req.body;
        const resultado = await pool.query(`
            INSERT INTO postagens (titulo, conteudo, usuario_id)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [titulo, conteudo, usuario_id]
        );
        const dadosFormatados = resultado.rows.map((post) => ({
            ...post,
            criado_em: formatarData(post.criado_em),
        }));

        res.status(201).json({
            mensagem: 'Post criado com sucesso!',
            post: dadosFormatados[0]
        });
    } catch (erro) {
        res.status(500).json({ 
            error: 'Erro ao criar a postagem' 
        });
    }
})

//Post dos usuários
app.post('/usuarios', validarUsuario, async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        const resultado = await pool.query(`
            INSERT INTO usuarios (nome, email, senha)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [nome, email, senha]
        );
        const dadosFormatados = resultado.rows.map((post) => ({
            ...post,
            criado_em: formatarData(post.criado_em),
        }));

        res.status(201).json({
            mensagem: 'Usuário criado com sucesso!',
            usuario: dadosFormatados[0]
        });

    } catch (erro) {
        res.status(500).json({
            error: 'Erro ao criar o usuário'
        });
    }
})


app.put('/posts/:id', validarPost, async (req, res) => {
    try{
        const { id } = req.params;
        const {titulo, conteudo} = req.body;
        const resultado = await pool.query(`
            UPDATE 
            postagens SET titulo = $1, conteudo = $2 WHERE id = $3 RETURNING *`,
            [titulo, conteudo, id],
            );
        const dadosFormatados = resultado.rows.map((post) => ({
            ...post,
            criado_em: formatarData(post.criado_em),
        }));
        res.status(200).json({
            mensagem: 'Post atualizado com sucesso!',
            post: dadosFormatados[0]
            });
    } catch (erro){
        res.status(500).json({
            error: 'Erro ao atualizar o post'
        });
    }
})

// DELETE dos posts
app.delete('/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query(`
            DELETE FROM postagens WHERE id = $1 RETURNING *`,
            [id],
        );
        res.status(200).json({
            mensagem: 'Post deletado com sucesso!'
    });
    } catch (erro) {
        res.status(500).json({
            error: 'Erro ao deletar o post'
        });
    }
})
module.exports = app;