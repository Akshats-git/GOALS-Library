const mongoose = require('mongoose');
const httpStatus = require('http-status');
const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const errorConverter = (err, req, res, next) => {
  let error = err;

  if (error?.code === 11000) {
    const duplicateField = Object.keys(error.keyPattern || {})[0] || 'field';
    const duplicateValue = error.keyValue ? error.keyValue[duplicateField] : '';
    const message = duplicateValue
      ? `${duplicateField} already exists: ${duplicateValue}`
      : `${duplicateField} already exists`;
    error = new ApiError(httpStatus.BAD_REQUEST, message, true, err.stack);
  }

  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode ||
      (error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR);
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
