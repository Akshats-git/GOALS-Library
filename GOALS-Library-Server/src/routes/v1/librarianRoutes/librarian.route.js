const express = require('express');
const router = express.Router();
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const librarianValidation = require('../../../validations/librarian.validation');
const { librarianController } = require('../../../controllers');

router
  .route('/')
  .get(auth('all'), librarianController.getLibrarians)
  .post(auth('A'), validate(librarianValidation.createLibrarian), librarianController.createLibrarian);

router
  .route('/:librarianId')
  .get(auth('all'), validate(librarianValidation.getLibrarianById), librarianController.getLibrarianById)
  .put(auth('AL'), validate(librarianValidation.updateLibrarian), librarianController.updateLibrarian)
  .delete(auth('A'), validate(librarianValidation.deleteLibrarian), librarianController.deleteLibrarian);

router
  .route('/send-mail')
  .post(auth('AL'), validate(librarianValidation.sendMail), librarianController.sendMail);

router
  .route('/notify')
  .post(auth('AL'), validate(librarianValidation.notify), librarianController.notify);
module.exports = router;