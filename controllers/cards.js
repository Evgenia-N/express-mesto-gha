const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const Card = require('../models/card');

exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (err) {
    next(err);
  }
};

exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const newCard = new Card({ name, link, owner: req.user._id });
    return res.status(201).send(await newCard.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Произошла ошибка при заполнении обязательных полей'));
    }
    next(err);
    return null;
  }
};

exports.deleteCard = async (req, res, next) => {
  try {
    const deletedCard = await Card.findById(req.params.cardId);
    if (deletedCard) {
      if (req.user._id === deletedCard.owner._id.toString()) {
        await Card.findByIdAndRemove(req.params.cardId);
        return res.status(200).send({ message: 'Следующие данные были удалены', deletedCard });
      }
      throw new ForbiddenError('Нет прав для удаления данного фото');
    }
    throw new NotFoundError('Фото не найдено');
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Ошибка удаления фото'));
    }
    next(err);
    return null;
  }
};

exports.likeCard = async (req, res, next) => {
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
    throw new NotFoundError('Фото с таким id не существует');
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Ошибка проставления отметки'));
    }
    next(err);
    return null;
  }
};

exports.dislikeCard = async (req, res, next) => {
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
    throw new NotFoundError('Фото с таким id не существует');
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Ошибка проставления отметки'));
    }
    next(err);
    return null;
  }
};
