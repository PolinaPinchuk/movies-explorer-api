require('dotenv').config();
const jwt = require('jsonwebtoken');
const UnAuthorizedErr = require('../errors/UnAuthorizedErr');

const { JWT_SECRET, NODE_ENV } = process.env;
const REQUIRED_AUTH = 'Необходима авторизация';

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnAuthorizedErr(REQUIRED_AUTH));
    return;
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key');
  } catch (err) {
    next(new UnAuthorizedErr(REQUIRED_AUTH));
    return;
  }
  req.user = payload;
  next();
};
