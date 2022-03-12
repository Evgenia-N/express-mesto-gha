const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.headers.cookie.replace('mestoToken=', '');
  if (!token) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secretKey');
  } catch (err) {
    return res.status(403).send({ message: 'Нет доступа' });
  }

  req.user = payload;

  next();
  return null;
};
