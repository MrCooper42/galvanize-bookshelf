'use strict';

const boom = require('boom');
const express = require('express');
const knex = require('../knex');
const humps = require('humps');

const ev = require('express-validation');
const validations = require('../validations/books');

const router = express.Router();

router.get('/', (req, res, next) => {
  knex('books')
    .orderBy('title')
    .then((rows) => {
      const books = humps.camelizeKeys(rows);

      res.send(books);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/:id', (req, res, next) => {
  const id = Number.parseInt(req.params.id);

  if (Number.isNaN(id)) {
    return next();
  }

  knex('books')
    .where('id', req.params.id)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(404, 'Not Found');
      }

      const book = humps.camelizeKeys(row);

      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/', ev(validations.post), (req, res, next) => {
  const title = req.body.title;
  const author = req.body.author;
  const coverUrl = req.body.coverUrl;
  const description = req.body.description;
  const genre = req.body.genre;

  if (!title || !title.trim()) {
    return next(boom.create(400, 'Fill out the title'));
  }

  if (!author || !author.trim()) {
    return next(boom.create(400, 'Fill out the author'));
  }

  if (!genre || !genre.trim()) {
    return next(boom.create(400, 'Fill out the genre'));
  }

  if (!description || !description.trim()) {
    return next(boom.create(400, 'Fill out the description'));
  }

  if (!coverUrl || !coverUrl.trim()) {
    return next(boom.create(400, 'Fill out the cover url'));
  }

  const insertBook = {
    title,
    author,
    genre,
    description,
    coverUrl
  };

  knex('books')
    .insert(humps.decamelizeKeys(insertBook), '*')
    .then((rows) => {
      const book = humps.camelizeKeys(rows[0]);

      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/:id', (req, res, next) => {
  const id = Number.parseInt(req.params.id);

  if (Number.isNaN(id)) {
    return next();
  }

  knex('books')
    .where('id', id)
    .first()
    .then((book) => {
      if (!book) {
        throw boom.create(404, 'Not Found');
      }

      const title = req.body.title;
      const author = req.body.author;
      const coverUrl = req.body.coverUrl;
      const description = req.body.description;
      const genre = req.body.genre;
      const updateBook = {};

      if (title) {
        updateBook.title = title;
      }

      if (author) {
        updateBook.author = author;
      }

      if (genre) {
        updateBook.genre = genre;
      }

      if (description) {
        updateBook.description = description;
      }

      if (coverUrl) {
        updateBook.coverUrl = coverUrl;
      }

      return knex('books')
        .update(humps.decamelizeKeys(updateBook), '*')
        .where('id', id);
    })
    .then((rows) => {
      const book = humps.camelizeKeys(rows[0]);

      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/:id', (req, res, next) => {
  const id = Number.parseInt(req.params.id);

  if (Number.isNaN(id)) {
    return next();
  }

  let book;

  knex('books')
    .where('id', id)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(404, 'Not Found');
      }

      book = humps.camelizeKeys(row);

      return knex('books')
        .del()
        .where('id', req.params.id);
    })
    .then(() => {
      delete book.id;
      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
