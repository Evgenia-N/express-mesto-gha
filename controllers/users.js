const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateToken } = require('../middlewares/jwt');

const DUPLICATE_ERROR_CODE = 11000;
const SALT_ROUNDS = 10;

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ message: 'На сервере произошла ошибка', ...err });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user) {
      return res.status(200).send(user);
    }
    return res.status(404).send({ message: 'Пользователя с таким id не существует' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка', ...err });
  }
};

exports.getThisUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ message: 'На сервере произошла ошибка', ...err });
  }
};

exports.createUser = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'Произошла ошибка при заполнении обязательных полей' });
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
        return res.status(400).send({ message: 'Произошла ошибка при заполнении обязательных полей' });
      }
      if (err.code === DUPLICATE_ERROR_CODE) {
        return res.status(409).send({ message: 'Пользователь с таким email уже зарегистрирован' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка', ...err });
    });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'Произошла ошибка при заполнении обязательных полей' });
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
            maxAge: 3600 * 24 * 7,
            httpOnly: true,
            sameSite: true,
          });
          return res.status(200).send({ message: `С возвращением, ${user.name}!`, jwt: token });
        })
        .catch((err) => {
          res.status(401).send({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(404).send({ message: err.message, ...err });
    });
};

exports.updateUser = async (req, res) => {
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
    return res.status(404).send({ message: 'Пользователь не найден' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Произошла ошибка при заполнении обязательных полей' });
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка', ...err });
  }
};

exports.updateAvatar = async (req, res) => {
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
    return res.status(404).send({ message: 'Пользователь не найден' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Произошла ошибка при заполнении обязательных полей' });
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка', ...err });
  }
};
