const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validateRegister = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Некорректный email',
        'any.required': 'Обязательное поле',
      }),
    password: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Минимальная длина пароля 2 символа',
        'string.max': 'Максимальная длина пароля 30 символов',
      }),
    name: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина имени 2 символа',
        'string.max': 'Максимальная длина имени 30 символов',
      }),
    about: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина строки о себе 2 символа',
        'string.max': 'Максимальная длина строки о себе 30 символов',
      }),
    avatar: Joi.string()
      .custom((value) => {
        if (!validator.isURL(value, { require_protocol: true })) {
          throw new Error('Неправильный формат ссылки');
        }
        return value;
      }),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Некорректный email',
        'any.required': 'Обязательное поле',
      }),
    password: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Минимальная длина пароля 2 символа',
        'string.max': 'Максимальная длина пароля 30 символов',
        'any.required': 'Обязательное поле',
      }),
  }),
});

const validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Минимальная длина имени 2 символа',
        'string.max': 'Максимальная длина имени 30 символов',
        'any.required': 'Обязательное поле',
      }),
    about: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Минимальная длина строки о себе 2 символа',
        'string.max': 'Максимальная длина строки о себе 30 символов',
        'any.required': 'Обязательное поле',
      }),
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});

const validateCardInfo = celebrate({
  body: Joi.object().keys({
    link: Joi.string().required()
      .custom((value) => {
        if (!validator.isURL(value, { require_protocol: true })) {
          throw new Error('Неправильный формат ссылки');
        }
        return value;
      })
      .messages({
        'any.required': 'Обязательное поле',
      }),
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Минимальная длина названия 2 символа',
        'string.max': 'Максимальная длина названия 30 символов',
        'any.required': 'Обязательное поле',
      }),
  }),
});

const validateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required()
      .custom((value) => {
        if (!validator.isURL(value, { require_protocol: true })) {
          throw new Error('Неправильный формат ссылки');
        }
        return value;
      })
      .messages({
        'any.required': 'Обязательное поле',
      }),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  validateRegister,
  validateLogin,
  validateUserInfo,
  validateUserId,
  validateCardInfo,
  validateCardId,
  validateAvatar,
};
