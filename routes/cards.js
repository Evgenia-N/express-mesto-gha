const express = require('express');

const cardRoutes = express.Router();

const auth = require('../middlewares/auth');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardRoutes.get('/cards', auth, getCards);
cardRoutes.post('/cards', auth, express.json(), createCard);
cardRoutes.delete('/cards/:cardId', auth, express.json(), deleteCard);
cardRoutes.put('/cards/:cardId/likes', auth, express.json(), likeCard);
cardRoutes.delete('/cards/:cardId/likes', auth, express.json(), dislikeCard);

module.exports = cardRoutes;
