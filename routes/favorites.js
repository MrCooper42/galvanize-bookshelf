'use strict';

const express = require('express');
const boom = require('boom');
const knex = require('../knex');
const humps = require('humps');

const ev = require('express-validation');
const validations = require('../validations/favorites');

const router = express.Router();

const authorized = (req, res, next) => {
  if (!req.session.userId) {
    return next(boom.create(401, 'Unauthorized'));
  }

  next();
};

router.get('/', authorized, (req, res, next) => {
  knex('favorites')
    .innerJoin('books', 'books.id', 'favorites.book_id')
    .where('favorites.user_id', req.session.userId)
    .orderBy('books.title', 'ASC')
    .then((rows) => {
      const bestest = humps.camelizeKeys(rows);

      res.send(bestest);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/check', authorized, (req, res, next) => {
  const bookId = Number.parseInt(req.query.bookId);

  if (!Number.isInteger(bookId)) {
    return next(boom.create(400, 'Book ID must be an integer'));
  }

  knex('books')
    .innerJoin('favorites', 'favorites.book_id', 'books.id')
    .where({
      'favorites.book_id': bookId,
      'favorites.user_id': req.session.userId
    })
    .first()
    .then((row) => {
      if (row) {
        return res.send(true);
      }

      res.send(false);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/', authorized, (req, res, next) => {
  ev(validations.post)
  const bookId = Number.parseInt(req.body.bookId);

  if (Number.isInteger(bookId) === false) {
    return next(boom.create(400, 'Book ID must be an integer'));
  }

  knex('books')
    .where('id', bookId)
    .first()
    .then((book) => {
      if (!book) {
        throw boom.create(404, 'Book not found');
      }

      const newFavorite = {
        bookId,
        userId: req.session.userId
      };

      return knex('favorites')
        .insert(humps.decamelizeKeys(newFavorite), '*');
    })
    .then((rows) => {
      const favorite = humps.camelizeKeys(rows[0]);

      res.send(favorite);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/', authorized, (req, res, next) => {
  const bookId = Number.parseInt(req.body.bookId);

  if (!Number.isInteger(bookId)) {
    return next(boom.create(400, 'Book ID must be an integer'));
  }

  const clause = {
    book_id: bookId,
    user_id: req.session.userId
  };

  let favorite;

  knex('favorites')
    .where(clause)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(404, 'Favorite not found');
      }

      favorite = humps.camelizeKeys(row);

      return knex('favorites')
        .del()
        .where('id', favorite.id);
    })
    .then(() => {
      delete favorite.id;

      res.send(favorite);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
