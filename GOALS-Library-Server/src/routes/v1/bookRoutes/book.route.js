const express = require('express');
const router = express.Router();
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const bookValidation = require('../../../validations/book.validation');
const { bookController } = require('../../../controllers');

router
  .route('/')
  .get(auth('all'), bookController.getBooks)
  .post(auth('AL'), validate(bookValidation.createBook), bookController.createBook);

router
  .route('/:bookId')
  .get(auth('all'), validate(bookValidation.getBookById), bookController.getBookById)
  .post(auth('all'), validate(bookValidation.requestBook), bookController.requestBookById)
  .patch(auth('all'), validate(bookValidation.notifyBook), bookController.notifyBook)
  .put(auth('AL'), validate(bookValidation.updateBook), bookController.updateBook)
  .delete(auth('AL'), validate(bookValidation.deleteBook), bookController.deleteBook);

module.exports = router;