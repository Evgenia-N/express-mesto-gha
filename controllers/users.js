const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateToken } = require('../middlewares/jwt');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const DuplicateError = require('../errors/DuplicateError');
const UnAuthorisedError = require('../errors/UnAuthorisedError');

const DUPLICATE_ERROR_CODE = 11000;
const SALT_ROUNDS = 10;

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user) {
      return res.status(200).send(user);
    }
    throw new NotFoundError('Пользователя с таким id не существует');
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
    return null;
  }
};

exports.getThisUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

exports.createUser = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Произошла ошибка при заполнении обязательных полей');
  }
  return bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({ message: 'Регистрация прошла успешно!', _id: user._id, email: user.email });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Произошла ошибка при заполнении обязательных полей'));
      }
      if (err.code === DUPLICATE_ERROR_CODE) {
        next(new DuplicateError('Пользователь с таким email уже зарегистрирован'));
      } else {
        next(err);
      }
      return null;
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Произошла ошибка при заполнении обязательных полей');
  }
  return User.findOne({ email }).select('+password')
    // .orFail(new Error('Переданы некорректные данные'))
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Переданы некорректные данные'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Переданы некорректные данные'));
          }
          const token = generateToken({ _id: user._id });
          res.cookie('mestoToken', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: true,
          });
          return res.status(200).send({ message: `С возвращением, ${user.name}!`, jwt: token });
        })
        .catch((err) => {
          next(new UnAuthorisedError(err.message));
        });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: req.body.name, about: req.body.about },
      {
        new: true,
        runValidators: true,
      },
    );
    if (user) {
      return res.status(200).send(user);
    }
    throw new NotFoundError('Пользователь не найден');
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Произошла ошибка при заполнении обязательных полей'));
    } else {
      next(err);
    }
    return null;
  }
};

exports.updateAvatar = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      {
        new: true,
        runValidators: true,
      },
    );
    if (user) {
      return res.status(200).send(user);
    }
    throw new NotFoundError('Пользователь не найден');
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Произошла ошибка при заполнении обязательных полей'));
    } else {
      next(err);
    }
    return null;
  }
};
