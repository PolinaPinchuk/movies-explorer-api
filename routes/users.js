const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUserMe,
  updateUser,
} = require('../controllers/users');

router.get('/me', getUserMe);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().email().required(),
    }),
  }),
  updateUser,
);

module.exports = router;
