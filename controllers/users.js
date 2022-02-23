const User = require('../models/user');

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

exports.createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    return res.status(201).send(await newUser.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Произошла ошибка при заполнении обязательных полей' });
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка', ...err });
  }
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
