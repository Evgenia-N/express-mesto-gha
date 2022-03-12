const express = require('express');

const userRoutes = express.Router();

const auth = require('../middlewares/auth');

const {
  validateRegister, validateUserInfo, validateUserId, validateAvatar,
} = require('../middlewares/validation');

const {
  getUsers, getUser, getThisUser, createUser, login, updateUser, updateAvatar,
} = require('../controllers/users');

userRoutes.get('/users', auth, getUsers);
userRoutes.get('/users/me', auth, getThisUser);
userRoutes.get('/users/:userId', validateUserId, auth, getUser);
userRoutes.post('/signin', express.json(), validateRegister, login);
userRoutes.post('/signup', express.json(), validateRegister, createUser);
userRoutes.patch('/users/me', auth, express.json(), validateUserInfo, updateUser);
userRoutes.patch('/users/me/avatar', auth, express.json(), validateAvatar, updateAvatar);

module.exports = userRoutes;
