const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

exports.generateToken = (payload) => jwt.sign(payload, NODE_ENV === 'production' ? JWT_SECRET : 'secretKey', { expiresIn: '7d' });
