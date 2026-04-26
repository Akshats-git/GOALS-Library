const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');
const { books } = require('../../utils/books');
const threeWeeksLater = require('../../utils/helper');

const bookSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    count: {
      type: Number,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
        enum: books,
      },
    ],
    students: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
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
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
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
    requestedBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    returnedBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    feedback: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    notify: [
      {
        email: {
          type: String,
          required: true,
        }
      }
    ]
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
bookSchema.plugin(toJSON);
bookSchema.plugin(paginate);

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
