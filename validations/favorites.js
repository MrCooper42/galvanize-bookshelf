'use strict';

const Joi = require('joi');

module.exports.post = {
  body: {
    userId: Joi.number()
      .label('User ID')
      .required()
      .integer()
      .positive(),
    BookId: Joi.number()
      .label('Book ID')
      .required()
      .integer()
      .positive()
  }
};
