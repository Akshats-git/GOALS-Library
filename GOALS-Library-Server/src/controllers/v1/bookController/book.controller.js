const mongoose = require('mongoose');
const httpStatus = require('http-status-codes');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const { bookService, userService, librarianService } = require('../../../services');

const createBook = catchAsync(async (req, res) => {
  try {
    const bookPayload = {
      name: req.body.name,
      author: req.body.author,
      count: req.body.count,
      cover: req.body.cover,
      tags: req.body.tags,
    };

    const book = await bookService.createBook(bookPayload);

    // Send success response after transaction
    res.status(201).send({
      message: 'Book registered successfully.',
      bookDetails: {
        ...book.toObject(),
      },
    });
  } catch (error) {
    res.status(500).send({ message: 'Error registering book.', error: error.message });
  }
});

const getBooks = catchAsync(async (req, res) => {
  const result = await bookService.queryBook();
  res.send(result);
});

const getBookById = catchAsync(async (req, res) => {
  const book = await bookService.getBookById(req.params.bookId);
  if (!book) throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  res.send(book);
});

const updateBook = catchAsync(async (req, res) => {
  const { bookId } = req.params;
  const { userId, status, returnDate, issueDate } = req.body; // Fetch returnDate from body

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let book, user;

    if (status === 'issue') {
      // Issue the book: Add userId, issueDate, and returnDate to book's students and add bookId to user's books
      const calculatedReturnDate = new Date();
      calculatedReturnDate.setDate(issueDate.getDate() + 21); // Set return date to 3 weeks later

      book = await bookService.updateBookById(
        bookId,
        {
          $addToSet: {
            students: { userId: userId.toString(), issueDate, returnDate: calculatedReturnDate }, // Add user to students array with dates
          },
          $pull: { requestedBy: { userId: userId.toString() } }, // Remove user from requestedBy array
          $inc: { count: -1 }, // Decrease the book count by 1
        },
        { session }
      );

      if (!book) {
        console.error('Book not found during issue');
        throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
      }

      user = await userService.updateUserById(
        userId,
        {
          $addToSet: {
            books: { bookId: bookId.toString(), issueDate, returnDate: calculatedReturnDate },
          }, // Add book to user's books array
          $pull: { requestedBooks: { bookId: bookId.toString() } }, // Remove book from requestedBooks array
        },
        { session }
      );

      if (!user) {
        console.error('User not found during issue');
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }
    } else if (status === 'return') {
      // 1. Fetch the existing book entry to get the original issueDate
      const currentBook = await bookService.getBookById(bookId);
      const currentStudent = currentBook.students.find((student) => student.userId.toString() === userId.toString());
    
      if (!currentStudent) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Student entry not found for this book');
      }
    
      const { issueDate } = currentStudent; // Store the original issueDate
    
      // Notify users in the notify array
      for (const user of currentBook.notify) {
        await librarianService.notify(user.email, currentBook.name, currentBook.author);
      }
    
      // Remove all users from notify array
      book = await bookService.updateBookById(
        bookId,
        {
          $pull: { students: { userId: userId.toString() }, returnedBy: { userId: userId.toString() }, notify: {} }, // Remove the user entry and clear notify array
          $inc: { count: 1 }, // Increase the book count by 1
        },
        { session }
      );
    
      if (!book) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
      }
    
      // 3. Add the new entry to the book's students array with the original issueDate and updated returnDate
      await bookService.updateBookById(
        bookId,
        {
          $addToSet: {
            history: { userId: userId.toString(), issueDate: new Date(issueDate), returnDate: new Date(returnDate) }, // Add the user back with original issue date and new return date
          },
        },
        { session }
      );
    
      // 4. Remove the bookId from user's books array
      await userService.updateUserById(
        userId,
        {
          $pull: { books: { bookId: bookId.toString() }, returnedBooks: { bookId: bookId.toString() }, notify: {bookId: bookId.toString()} }, // Remove the book entry
        },
        { session }
      );
    
      // 5. Add the new entry to the user's books array with the original issueDate and updated returnDate
      await userService.updateUserById(
        userId,
        {
          $addToSet: {
            history: { bookId: bookId.toString(), issueDate: new Date(issueDate), returnDate: new Date(returnDate) }, // Add the book back with original issue date and new return date
          },
        },
        { session }
      );
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid status');
    }
    await session.commitTransaction(); // Commit transaction if everything goes well
    session.endSession();
    return res.status(httpStatus.OK).send({ message: 'Book returned successfully' });
    } catch (error) {
      session.abortTransaction(); // Abort transaction if an error occurs
      session.endSession();
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Error returning book', error: error.message });
    }
});
    

const deleteBook = catchAsync(async (req, res) => {
  const deletedBook = await bookService.deleteBookById(req.params.bookId);
  if (!deletedBook) throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  res.status(httpStatus.NO_CONTENT).send();
});

const requestBookById = catchAsync(async (req, res) => {
  const { bookId } = req.params; // Get bookId from request params
  const { userId } = req.body; // Get userId from the authenticated user
  const { status } = req.body; // Get status from the request body

  const session = await mongoose.startSession(); // Start a transaction session
  session.startTransaction();

  try {
    let user, book;

    if (status === 'issue') {
      // 1. Add the bookId to the user's requestedBooks array
      user = await userService.updateUserById(
        userId,
        { $addToSet: { requestedBooks: { bookId: bookId.toString() } } }, // Add the bookId to requestedBooks
        { new: true, session } // Ensure it uses the transaction session
      );

      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }

      // 2. Add the userId to the book's requestedBy array
      book = await bookService.updateBookById(
        bookId,
        { $addToSet: { requestedBy: { userId: userId.toString() } } }, // Add the userId to requestedBy
        { new: true, session } // Ensure it uses the transaction session
      );

      if (!book) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
      }
    } else if (status === 'return') {
      const { rating, comment } = req.body; // Get rating and comment from the request body

      if (!rating || !comment) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Rating and comment are required for return status');
      }

      // Check if the bookId is in the user's books before proceeding
      const userRecord = await userService.getUserById(userId); // Fetch the user's details

      if (!userRecord) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }

      const hasBook = userRecord.books.some((book) => book.bookId.toString() === bookId.toString()); // Check if the book exists in user's books

      if (!hasBook) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Book not found in user's issued books");
      }

      // Fetch the book details to get the current rating and feedback count
      const bookRecord = await bookService.getBookById(bookId);

      if (!bookRecord) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
      }

      // Calculate the new average rating
      const currentFeedbackCount = bookRecord.feedback.length;
      const currentRating = bookRecord.rating || 0; // Set to 0 if rating does not exist
      const newRating = (currentRating * currentFeedbackCount + rating) / (currentFeedbackCount + 1);

      // 1. Add the bookId to the user's returnedBooks array
      user = await userService.updateUserById(
        userId,
        { $addToSet: { returnedBooks: { bookId: bookId.toString() } } }, // Add the bookId to returnedBooks
        { new: true, session } // Ensure it uses the transaction session
      );

      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }

      // 2. Add the userId to the book's returnedBy array and update the rating and feedback
      book = await bookService.updateBookById(
        bookId,
        {
          $addToSet: {
            returnedBy: { userId: userId.toString() },
            feedback: { userId: userId.toString(), rating, comment }, // Add feedback
          },
          $set: { rating: newRating }, // Set the new average rating
        },
        { new: true, session } // Ensure it uses the transaction session
      );

      if (!book) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
      }
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid status value');
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Return success response
    res.status(httpStatus.OK).send({ message: 'Book request submitted successfully', book, user });
  } catch (error) {
    // Log the exact error to help debug
    console.error('Error requesting book by id:', error);

    // If there's an error, abort the transaction
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Request failed');
  }
});

const notifyBook = catchAsync(async (req, res) => {
  const { email } = req.body; // Get email from the request body

  // Add the email to the book's notify array
  const book = await bookService.updateBookById(
    req.params.bookId,
    { $addToSet: { notify: { email } } }, // Add the email to notify array
    { new: true } // Ensure it returns the updated document
  );

  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
  }

  const user = await userService.updateUserById(
    req.body.userId,
    { $addToSet: { notify: { bookId: req.params.bookId } } }, // Add the bookId to notify array
    { new: true } // Ensure it returns the updated document
  );

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  res.status(httpStatus.OK).send({ message: 'Email added to notify list successfully', book });
});

module.exports = {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  requestBookById,
  notifyBook,
};
