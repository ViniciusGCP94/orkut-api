const Joi = require('joi');

const schemaUsuario = Joi.object({
    nome: Joi.string().min(3).max(80).required().messages({
        "string.base": "O nome deve ser uma string.",
        "string.empty": "Digite seu nome.",
        "string.min": "O nome deve conter pelo menos 3 caracteres.",
        "string.max": "O nome deve conter no máximo 80 caracteres.",
        "any.required": "O nome é obrigatório."
    }), // nome
    email: Joi.string().email().required().messages({
        "string.base": "O email deve ser uma string.",
        "string.email": "O email é inválido.",
        "any.required": "O email é obrigatório.",
        "string.empty": "Digite seu email."
    }), // email
    senha: Joi.string().min(6).max(30).required().messages({
        "string.base": "A senha deve ser uma string.",
        "string.min": "A senha deve conter pelo menos 6 caracteres.",
        "string.max": "A senha deve conter no máximo 30 caracteres.",
        "any.required": "A senha é obrigatória.",
        "string.empty": "Digite sua senha."
    }) // senha
});

function validarUsuario(req, res, next) {
    const { error } = schemaUsuario.validate(req.body, { abortEarly: false });
    if (error) {
        console.log(error);
        return res.status(400).json({
            erro: error.details.map((detail) => detail.message)
        });
    }

    next();
}

module.exports = validarUsuario;