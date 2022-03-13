const jwt = require('jsonwebtoken');
const UnAuthorisedError = require('../errors/UnAuthorisedError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.mestoToken;
  if (!token) {
    throw new UnAuthorisedError('Необходима авторизация');
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secretKey');
  } catch (err) {
    next(new UnAuthorisedError('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
