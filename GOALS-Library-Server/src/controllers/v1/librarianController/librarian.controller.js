const mongoose = require('mongoose');
const httpStatus = require('http-status-codes');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const { librarianService, userService } = require('../../../services');

const createLibrarian = catchAsync(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let user;

  try {
    const userPayload = {
      name: req.body.name,
      email: req.body.email,
      Id: req.body.Id,
      password: req.body.password,
      role: 'librarian',
      phone: req.body.phone,
      profile: req.body.profile,
    };

    // Create the user
    user = await userService.createUser(userPayload, { session });

    const librarianPayload = {
      userId: user._id,
      sot: req.body.sot,
      eot: req.body.eot,
    };

    // Create the librarian
    const librarian = await librarianService.createLibrarian(librarianPayload, { session });

    await session.commitTransaction(); // Commit transaction if everything goes well
    session.endSession();

    // Send success response after transaction
    res.status(201).send({
      message: 'Librarian registered successfully.',
      librarianDetails: {
        ...user.toObject(),
        ...librarian.toObject(),
      },
    });
  } catch (error) {
    // If there's an error, abort the transaction and delete the user
    await session.abortTransaction();
    session.endSession();

    // Optional: Delete the created user if staff creation fails
    if (user) {
      await userService.deleteUserById(user._id);
    }

    // Send error response
    res.status(500).send({ message: 'Error registering librarian.', error: error.message });
  }
});

const getLibrarians = catchAsync(async (req, res) => {
  const result = await librarianService.queryLibrarian();
  res.send(result);
});

const getLibrarianById = catchAsync(async (req, res) => {
  const librarian = await librarianService.getLibrarianById(req.params.librarianId);
  if (!librarian) throw new ApiError(httpStatus.NOT_FOUND, 'Librarian not found');
  res.send(librarian);
});

const updateLibrarian = catchAsync(async (req, res) => {
  const librarian = await librarianService.updateLibrarianById(req.params.librarianId, req.body);
  if (!librarian) throw new ApiError(httpStatus.NOT_FOUND, 'Librarian not found');
  res.send(librarian);
});

const deleteLibrarian = catchAsync(async (req, res) => {
  const deletedLibrarian = await librarianService.deleteLibrarianById(req.params.librarianId);
  if (!deletedLibrarian) throw new ApiError(httpStatus.NOT_FOUND, 'Librarian not found');
  res.status(httpStatus.NO_CONTENT).send();
});

const sendMail = catchAsync(async (req, res) => {
  const { toEmail, subject, status, name, author, reminder=false } = req.body;

  // Send the email using the email service
  let endDate;
  if(reminder){
    endDate = req.body.endDate;
  }
  await librarianService.sendMail(toEmail, subject, status, name, author, reminder, endDate);

  res.status(httpStatus.OK).send({ message: 'Email sent successfully' });
});

const notify = catchAsync(async (req, res) => {
  const { email, name, author } = req.body;

  // Send the email using the email service
  await librarianService.notify(email, name, author);

  res.status(httpStatus.OK).send({ message: 'Email sent successfully' });
});

module.exports = {
  createLibrarian,
  getLibrarians,
  getLibrarianById,
  updateLibrarian,
  deleteLibrarian,
  sendMail,
  notify,
};
