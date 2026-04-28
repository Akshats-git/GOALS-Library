const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('../plugins');
const { roles } = require('../../config/roles');
const threeWeeksLater = require('../../utils/helper');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
    },
    Id: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: roles,
      default: 'student',
    },
    profile: {
      type: String,
      default: 'https://res.cloudinary.com/dipqjlyj2/image/upload/v1733733540/xehutfiegx0gukttbbil.png',
    },
    books: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Book',
        },
        issueDate: {
          type: Date,
          default: Date.now, // Automatically set the issue date when the book is issued
        },
        returnDate: {
          type: Date,
          default: null, // Initially set to null until the book is returned
        },
      },
    ],
    history: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Book',
        },
        issueDate: {
          type: Date,
          default: Date.now, // Automatically set the issue date when the book is issued
        },
        returnDate: {
          type: Date,
          default: null, // Initially set to null until the book is returned
        },
      },
    ],
    requestedBooks: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Book',
        },
      },
    ],
    returnedBooks: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Book',
        },
      },
    ],
    whishlist: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Book',
        },
      },
    ],
    notify: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Book',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if phone is taken
 * @param {number|string} phone - The user's phone
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isPhoneTaken = async function (phone, excludeUserId) {
  const user = await this.findOne({ phone, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if institute Id is taken
 * @param {string} Id - The user's institute id
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isInstituteIdTaken = async function (Id, excludeUserId) {
  const user = await this.findOne({ Id, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
