const Joi = require('joi');
const books = require('../utils/books');


const createBook = {
  body: Joi.object().keys({
    // User model
    name: Joi.string().required(),
    author: Joi.string().required(),
    count: Joi.number().required(),
    cover: Joi.string().required(),
    tags: Joi.array().items(Joi.string().valid(...books)).required(),
    students: Joi.array().items(Joi.string()),
  }),
};

const requestBook = {
  body: Joi.object().keys({
    name: Joi.string(),
    author: Joi.string(),
    count: Joi.number(),
    cover: Joi.string(),
    tags: Joi.array().items(Joi.string().valid(...books)),
    userId: Joi.string(),
    students: Joi.array().items(Joi.string()),
    status: Joi.string().valid('issue', 'return'),
    issueDate: Joi.date(),
    returnDate: Joi.date(),
    rating: Joi.number().min(1).max(5),
    comment: Joi.string(),
  }),
};

const updateBook = {
  body: Joi.object().keys({
    name: Joi.string(),
    author: Joi.string(),
    count: Joi.number(),
    cover: Joi.string(),
    tags: Joi.array().items(Joi.string().valid(...books)),
    userId: Joi.string(),
    students: Joi.array().items(Joi.string()),
    status: Joi.string().valid('issue', 'return'),
    issueDate: Joi.date(),
    returnDate: Joi.date()
  }),
};

const deleteBook = {
  params: Joi.object().keys({
    bookId: Joi.string().required(),
  }),
};
const getBookById = {
  params: Joi.object().keys({
    bookId: Joi.string().required(),
  }),
};

const notifyBook = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    userId: Joi.string().required(),
  }),
};

module.exports = {
  createBook,
  updateBook,
  deleteBook,
  getBookById,
  requestBook,
  notifyBook,
};
