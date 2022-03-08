const Card = require('../models/card');
const user = require('../models/user');

exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    res.status(500).send({ message: 'На сервере произошла ошибка', ...err });
  }
};

exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const newCard = new Card({ name, link, owner: req.user._id });
    return res.status(201).send(await newCard.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Произошла ошибка при заполнении обязательных полей' });
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка', ...err });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    const deletedCard = await Card.findById(req.params.cardId);
    if (deletedCard) {
      if (user.id === deletedCard.owner) {
        await Card.findByIdAndRemove(req.params.cardId);
        return res.status(200).send({ message: 'Следующие данные были удалены', deletedCard });
      }
      return res.status(403).send({ message: 'Нет прав для удаления данного фото' });
    }
    return res.status(404).send({ message: 'Фото не найдено' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Ошибка удаления фото' });
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка', ...err });
  }
};

exports.likeCard = async (req, res) => {
  try {
    const likedCard = await Card.findById(req.params.cardId);
    if (likedCard) {
      await Card.findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user._id } },
        { new: true },
      );
      return res.status(200).send(likedCard);
    }
    return res.status(404).send({ message: 'Фото с таким id не существует' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Ошибка проставления отметки' });
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка', ...err });
  }
};

exports.dislikeCard = async (req, res) => {
  try {
    const dislikedCard = await Card.findById(req.params.cardId);
    if (dislikedCard) {
      await Card.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } },
        { new: true },
      );
      return res.status(200).send(dislikedCard);
    }
    return res.status(404).send({ message: 'Фото с таким id не существует' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Ошибка проставления отметки' });
    }
    return res.status(500).send({ message: 'На сервере произошла ошибка', ...err });
  }
};
