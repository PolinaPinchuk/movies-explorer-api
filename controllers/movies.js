const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestErr = require('../errors/BadRequestErr');
const AccessError = require('../errors/AccessError');

const STATUS_OK = 200;
const STATUS_CREATED = 201;
const INCORRECT_DATA = 'Переданы некорректные данные';
const CARD_NOT_FOUND = 'Карточка не найдена';
const PROHIBITION_DEL_CARD = 'Нельзя удалять карточки других пользователей';

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    owner: req.user._id,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(STATUS_CREATED).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr(INCORRECT_DATA));
        return;
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.cardId)
    .orFail(new NotFoundError(CARD_NOT_FOUND))
    .then((movie) => {
      if (`${movie.owner}` !== req.user._id) {
        next(new AccessError(PROHIBITION_DEL_CARD));
        return;
      }
      Movie.findByIdAndRemove(req.params.cardId)
        .then(() => {
          res.status(STATUS_OK).send({ message: 'Карточка удалена' });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestErr(INCORRECT_DATA));
        return;
      }
      next(err);
    });
};
