const express = require('express');

const cardRoutes = express.Router();

const auth = require('../middlewares/auth');

const { validateCardInfo, validateCardId } = require('../middlewares/validation');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardRoutes.get('/cards', auth, getCards);
cardRoutes.post('/cards', auth, express.json(), validateCardInfo, createCard);
cardRoutes.delete('/cards/:cardId', auth, validateCardId, deleteCard);
cardRoutes.put('/cards/:cardId/likes', auth, validateCardId, likeCard);
cardRoutes.delete('/cards/:cardId/likes', auth, validateCardId, dislikeCard);

module.exports = cardRoutes;
