const express = require('express');
const userRoutes = express.Router();
const { getUsers, getUser, createUser, updateUser, updateAvatar } = require('../controllers/users');

userRoutes.get('/users', getUsers)
userRoutes.get('/users/:userId', getUser)
userRoutes.post('/users', express.json(), createUser)
userRoutes.patch('/users/me', express.json(), updateUser)
userRoutes.patch('/users/me/avatar', express.json(), updateAvatar)

exports.userRoutes = userRoutes;