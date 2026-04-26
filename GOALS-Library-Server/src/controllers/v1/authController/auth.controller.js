const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const { authService, userService, tokenService } = require('../../../services');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.body.email);
  res.status(httpStatus.NO_CONTENT).send();
});

const validator = catchAsync(async (req, res) => {
  const userPerson = await req.user;
  res.send({ user: userPerson });
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  verifyEmail,
  validator,
};
