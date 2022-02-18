const User = require('../models/user')

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  }
  catch(err){
    console.log(err)
    if (err.errors.name.name = 'ValidatorError') {
      return res.status(400).send(err.message)
    }
    res.status(500).send({message: "Произошла ошибка", ...err})
  }
}

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send({message: "Пользователь не найден"});
    }
  }
  catch(err){
    console.log(err)
    if (err.errors.name.name = 'ValidatorError') {
      return res.status(400).send(err.message)
    }
    res.status(500).send({message: "Произошла ошибка", ...err})
  }
}

exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body)
    res.status(201).send(await user.save());
    // const { name, about, avatar } = req.body; // получим из объекта запроса имя и описание пользователя
    //  User.create({ name, about, avatar });
  }
  catch(err){
    console.log(err)
    if (err.errors.name.name = 'ValidatorError') {
      return res.status(400).send(err.message)
    }
    res.status(500).send({message: "Произошла ошибка", ...err})
  }
}

exports.updateUser  = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id,
      { name: '', about: '' },
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
    if (err.errors.name.name = 'ValidatorError') {
      return res.status(400).send(err.message)
    }
    res.status(500).send({message: "Произошла ошибка", ...err})
  }
}

exports.updateAvatar  = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id,
      { avatar: '' },
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
    if (err.errors.name.name = 'ValidatorError') {
      return res.status(400).send(err.message)
    }
    res.status(500).send({message: "Произошла ошибка", ...err})
  }
}