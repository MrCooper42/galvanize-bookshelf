'use strict';

const Joi = require('joi');

module.exports.post = {
  body: {
    title: Joi.string()
      .label('Title')
      .required()
      .trim()
      .regex(/^[A-Z\s]{2,30}$/i),
    author: Joi.string()
      .label('Author')
      .required()
      .trim()
      .regex(/[\w\-'\s]/),
    genre: Joi.string()
      .label('Genre')
      .required()
      .trim()
      .regex(/[\w\-'\s]/),
    description: Joi.string()
      .label('Description')
      .required()
      .trim(),
    coverUrl: Joi.string()
      .label('Cover URL')
      .trim()
      .regex(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi)
  }
};
