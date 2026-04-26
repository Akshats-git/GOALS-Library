const Joi = require('joi');

const createLibrarian = {
  body: Joi.object().keys({
    // User model
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    phone: Joi.number().required(),
    Id: Joi.string().required(),
    profile: Joi.string(),

    // Libratian model
    sot: Joi.date().required(),
    eot: Joi.date().required(),
  }),
};

const updateLibrarian = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    phone: Joi.number().required(),
    Id: Joi.string().required(),
    profile: Joi.string().required(),

    // Staff model
    sot: Joi.date().required(),
    eot: Joi.date().required(),
  }),
};

const deleteLibrarian = {
  params: Joi.object().keys({
    librarianId: Joi.string().required(),
  }),
};
const getLibrarianById = {
  params: Joi.object().keys({
    librarianId: Joi.string().required(),
  }),
};
const sendMail = {
  body: Joi.object().keys({
    toEmail: Joi.string().email().required(),
    subject: Joi.string().required(),
    status: Joi.string().optional(),
    name: Joi.string().required(),
    author: Joi.string().required(),
    reminder: Joi.boolean().default(false),
    endDate: Joi.date().optional(),
  }),
}

const notify = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    author: Joi.string().required(),
  }),
}

module.exports = {
  createLibrarian,
  updateLibrarian,
  deleteLibrarian,
  getLibrarianById,
  sendMail,
  notify
};
