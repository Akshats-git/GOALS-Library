const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const { userService } = require('../../../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const whishlist = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const { bookId, status } = req.body;

  if (status === 'add') {
    const user = await userService.updateUserById(userId, { $addToSet: { whishlist: { bookId } } });
    res.send(user);
  } else if (status === 'remove') {
    const user = await userService.updateUserById(userId, { $pull: { whishlist: { bookId } } });
    res.send(user);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid status');
  }
});

const notify = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const { bookId } = req.body;

  const user = await userService.updateUserById(userId, { $addToSet: { notify: { bookId } } });
  res.send(user);
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  whishlist,
  notify,
};
