const joi = require('joi');

const validateReg = joi.object({
  user_name: joi.string().required(),
  user_email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  user_password: joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});

const validateLogin = joi.object({
  user_email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  user_password: joi.string().min(8).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});

module.exports = { validateLogin, validateReg };
