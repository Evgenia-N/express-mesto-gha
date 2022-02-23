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
    console.log(req.body);
    console.log(req.user._id);
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
    const deletedCard = ({_id: req.params.cardId});
    await Card.findOneAndRemove({_id: req.params.cardId});
    res.status(200).send({message:"Следующие данные были удалены", deletedCard});
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
    const likedCard = ({_id: req.params.cardId});
    await Card.findOneAndUpdate({_id: req.params.cardId},
    { $addToSet: { likes: req.user._id } },
    { new: true },
    );
    res.status(200).send(likedCard);
  }
  catch(err){
    console.log(err)
    if (err.name = 'ValidatorError') {
      return res.status(400).send({message: "Ошибка проставления отметки"})
    }
    res.status(500).send({message: "Произошла внутренняя ошибка сервера", ...err})
  }
}

exports.dislikeCard = async (req, res) => {
  try {
    const dislikedCard = ({_id: req.params.cardId});
    await Card.findOneAndUpdate({_id: req.params.cardId},
    { $pull: { likes: req.user._id } },
    { new: true },
  ) ;
    res.status(200).send(dislikedCard);
  }
  catch(err){
    console.log(err)
    if (err.name = 'ValidatorError') {
      return res.status(400).send({message: "Ошибка проставления отметки"})
    }
    res.status(500).send({message: "Произошла внутренняя ошибка сервера", ...err})
  }
}