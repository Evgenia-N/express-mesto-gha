const User = require('../models/user')

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  }
  catch(err){
    console.log(err)
    res.status(500).send({message: "Произошла ошибка", ...err})
  }
}

exports.getUser = async (req, res) => {
  try {
    //console.log(req.params);
    //const { userId } = req.params;
    //const user = await User.find((item) => item._id === userId);
    const user = await User.findById(req.params.userId)
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send({message: "Пользователя с таким id не существует"});
    }
  }
  catch(err){
    console.log(err)
    if (err.name = 'ValidatorError') {
      return res.status(400).send({message: "Переданы некорректные данные"})
    }
    res.status(500).send({message: "Произошла ошибка", ...err})
  }
}

exports.createUser = async (req, res) => {
  try {
    console.log(req.body)
    const newUser = new User(req.body);
    res.status(201).send(await newUser.save());
  }
  catch(err){
    console.log(err)
    if (err.name = 'ValidatorError') {
      return res.status(400).send({message: "Произошла ошибка"})
    }
    res.status(500).send({message: "Произошла ошибка", ...err})
  }
}

exports.updateUser  = async (req, res) => {
  //console.log(req.body);
  try {
    if (req.body.name && req.body.about) {
      const user = await User.findByIdAndUpdate(req.user._id,
        { name: req.body.name, about: req.body.about},
        {
          new: true,
          runValidators: true
        }
      );
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send({message: "Пользователь не найден"});
      }
    }
    else {
      res.status(400).send({message: "Не заполнены обязательные поля"})
    }
  }
  catch(err){
    console.log(err)
    if (err.name = 'ValidatorError') {
      return res.status(400).send({message: "Произошла ошибка"})
    }
    res.status(500).send({message: "Произошла ошибка", ...err})
  }
}

exports.updateAvatar  = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id,
      { avatar: req.body.avatar },
      {
        new: true,
        runValidators: true
      }
    );
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send({message: "Пользователь не найден"});
    }
  }
  catch(err){
    console.log(err)
    if (err.name = 'ValidatorError') {
      return res.status(400).send(err.message)
    }
    res.status(500).send({message: "Произошла ошибка", ...err})
  }
}