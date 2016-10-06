'use strict';

const Joi = require('joi');

module.exports.post = {
  body: {
    firstName: Joi.string()
      .label('First Name')
      .required()
      .trim()
      .regex(/^[A-Z\s]{2,30}$/i),

    lastName: Joi.string()
      .label('Last Name')
      .required()
      .trim()
      .regex(/^[a-z\s]{2,30}$/i),

    email: Joi.string()
      .label('Email')
      .required()
      .email()
      .regex(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i)
      .trim(),

    password: Joi.string()
      .label('Password')
      .required()
      .trim()
      .min(8)
      .strip()
  }
};
