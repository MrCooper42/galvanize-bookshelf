'use strict';

const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const express = require('express');
const knex = require('../knex');
const humps = require('humps');

const router = express.Router();

router.post('/', (req, res, next) => {
  const {
    email,
    password
  } = req.body;

  if (!email || !email.trim()) {
    return next(boom.create(400, 'Email must not be blank'));
  }

  if (!password || password.length < 8) {
    return next(boom.create(
      400,
      'Password must be at least 8 characters long'
    ));
  }

  knex('users')
    .select(knex.raw('1=1'))
    .where('email', email)
    .first()
    .then((exists) => {
      if (exists) {
        throw boom.create(400, 'Email already exists');
      }

      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      const {
        firstName,
        lastName
      } = req.body;
      const createUser = {
        firstName,
        lastName,
        email,
        hashedPassword
      };

      return knex('users')
        .insert(humps.decamelizeKeys(createUser), '*');
    })
    .then((rows) => {
      const user = humps.camelizeKeys(rows[0]);

      delete user.hashedPassword;

      req.session.userId = user.id;

      res.send(user);
    })
    .catch((err) => {
      next(err, 'errererrz');
    });
});

module.exports = router;
