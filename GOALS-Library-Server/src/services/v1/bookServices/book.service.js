const { Book } = require('../../../models');
const ApiError = require('../../../utils/ApiError');
const httpStatus = require('http-status-codes');
const mongoose = require('mongoose');

const createBook = async (bookBody) => {
  const bookData = await Book.create(bookBody);

  return bookData;
};

const queryBook = async () => {
  const books = await Book.find();

  return books;
};

const getBookById = async (id) => {
  return Book.findById(id);
};

const updateBookById = async (bookId, updateBody) => {
  const book = await Book.findOneAndUpdate({ _id: bookId }, updateBody, {
    new: true, // Return the updated document
    runValidators: true, // Ensure validation rules are applied during update
  });

  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }

  return book;
};

const deleteBookById = async (bookId) => {
  const bookDetails = await getBookById(bookId);
  if (!bookDetails) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }
  await bookDetails.remove();
};

module.exports = {
  createBook,
  queryBook,
  getBookById,
  updateBookById,
  deleteBookById,
};
