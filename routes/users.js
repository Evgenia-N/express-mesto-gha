const express = require('express');

const userRoutes = express.Router();

const auth = require('../middlewares/auth');

const {
  getUsers, getUser, getThisUser, createUser, login, updateUser, updateAvatar,
} = require('../controllers/users');

userRoutes.get('/users', auth, getUsers);
userRoutes.get('/users/me', auth, getThisUser);
userRoutes.get('/users/:userId', auth, getUser);
userRoutes.post('/signin', express.json(), login);
userRoutes.post('/signup', express.json(), createUser);
userRoutes.patch('/users/me', auth, express.json(), updateUser);
userRoutes.patch('/users/me/avatar', auth, express.json(), updateAvatar);

module.exports = userRoutes;
