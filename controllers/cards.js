const { response } = require('express');
const Card = require('../models/card')

exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  }
  catch(err){
    console.log(err)
    if (err.errors.name.name = 'ValidatorError') {
      return res.status(400).send(err.message)
    }
    res.status(500).send({message: "Произошла ошибка", ...err})
  }
}

exports.createCard = async (req, res) => {
  try {
    const card = new Card(req.body)
    res.status(201).send(await card.save());
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

exports.deleteCard = async (req, res) => {
  try {
    const deletedCard = Card.findByIdAndRemove(req.params.cardId);
    //await deletedCard.deleteOne(req.params.cardId)
    res.status(200).send(deletedCard);
  }
  catch(err){
    console.log(err)
    if (err.errors.name.name = 'ValidatorError') {
      return res.status(400).send(err.message)
    }
    res.status(500).send({message: "Произошла ошибка", ...err})
  }
}

exports.likeCard = async (req, res) => {
  try {
    const likedCard = Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.params.id } },
    { new: true },
    );
    res.status(200).send(likedCard);
  }
  catch(err){
    console.log(err)
    if (err.errors.name.name = 'ValidatorError') {
      return res.status(400).send(err.message)
    }
    res.status(500).send({message: "Произошла ошибка", ...err})
  }
}

exports.dislikeCard = async (req, res) => {
  try {
    const dislikedCard = Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.params.id } },
    { new: true },
  ) ;
    res.status(200).send(dislikedCard);
  }
  catch(err){
    console.log(err)
    if (err.errors.name.name = 'ValidatorError') {
      return res.status(400).send(err.message)
    }
    res.status(500).send({message: "Произошла ошибка", ...err})
  }
}