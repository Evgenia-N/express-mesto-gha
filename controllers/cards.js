const Card = require('../models/card')

exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    if (cards.length > 0) {
      res.status(200).send(cards);
    }
    else {
      res.status(200).send({message: "Отсутствуют данные для отображения"});
    }
  }
  catch(err){
    console.log(err)
    res.status(500).send({message: "Произошла внутренняя ошибка сервера", ...err})
  }
}

exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const newCard = new Card({name, link, owner: req.user._id});
    res.status(201).send(await newCard.save());
  }
  catch(err){
    console.log(err)
    if (err.name = 'ValidatorError') {
      return res.status(400).send({message: "Произошла ошибка при заполнении обязательных полей"})
    }
    res.status(500).send({message: "Произошла внутренняя ошибка сервера", ...err})
  }
}

exports.deleteCard = async (req, res) => {
  try {
    const deletedCard = await Card.findById(req.params.cardId);
    if (deletedCard) {
      await Card.findByIdAndRemove(req.params.cardId);
      res.status(200).send({message:"Следующие данные были удалены", deletedCard});
    }
    else {
      res.status(404).send({message:"Фото не найдено"});
    }
  }
  catch(err){
    console.log(err)
    if (err.name = 'ValidatorError') {
      return res.status(400).send({message: "Ошибка удаления фото"})
    }
    res.status(500).send({message: "Произошла внутренняя ошибка сервера", ...err})
  }
}

exports.likeCard = async (req, res) => {
  try {
    const likedCard = await Card.findById(req.params.cardId);
    if (likedCard) {
      await Card.findByIdAndUpdate(req.params.cardId,
        { $addToSet: { likes: req.user._id } },
        { new: true },
        );
        res.status(200).send(likedCard);
    }
    else {
      return res.status(404).send({message: "Фото с таким id не существует"})
    }
  }
  catch(err){
    console.log(err)
    if (err.name = 'ValidatorError') {
      return res.status(400).send({message: "Ошибка проставления отметки"});
    }
    res.status(500).send({message: "Произошла внутренняя ошибка сервера", ...err})
  }
}

exports.dislikeCard = async (req, res) => {
  try {
    const dislikedCard = await Card.findById(req.params.cardId);
    if (dislikedCard) {
      await Card.findByIdAndUpdate(req.params.cardId,
        { $pull: { likes: req.user._id } },
        { new: true },
      ) ;
        res.status(200).send(dislikedCard);
    }
    else {
      return res.status(404).send({message: "Фото с таким id не существует"})
    }
  }
  catch(err){
    console.log(err)
    if (err.name = 'ValidatorError') {
      return res.status(400).send({message: "Ошибка проставления отметки"})
    }
    res.status(500).send({message: "Произошла внутренняя ошибка сервера", ...err})
  }
}