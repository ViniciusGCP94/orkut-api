const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.usuario = decoded;
        console.log(req.usuario);
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
}

module.exports = auth;