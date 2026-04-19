const Joi = require('joi');

const schemaPost = Joi.object({
    titulo: Joi.string().min(3).required().messages({
        "string.base": "O título deve ser uma string.",
        "string.empty": "Digite o título do post.",
        "string.min": "O título deve conter pelo menos 3 caracteres.",
        "any.required": "O título é obrigatório."
    }), // título
    conteudo: Joi.string().min(5).required().messages({
        "string.base": "O conteúdo deve ser uma string.",
        "string.empty": "Digite o conteúdo do post.",
        "string.min": "O conteúdo deve conter pelo menos 5 caracteres.",
        "any.required": "O conteúdo é obrigatório."
    }), // conteúdo
});

function validarPost(req, res, next) {
    const { error } = schemaPost.validate(req.body, { abortEarly: false });
    if (error) {
        console.log(error);
        return res.status(400).json({
            erro: error.details.map(e => e.message)
        });
    }
     next();
}

module.exports = validarPost;