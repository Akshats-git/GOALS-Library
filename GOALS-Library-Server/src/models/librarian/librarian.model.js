const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const librarianSchema = mongoose.Schema(
  {
    // Reference to the User model
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sot: {
      type: Date,
      default: true,
      required: true,
    },
    eot: {
      type: Date,
      default: true,
      required: true,
    }
  },
  {
    timestamps: true,
  },
);

// Add plugins
librarianSchema.plugin(toJSON);
librarianSchema.plugin(paginate);

/**
 * @typedef Librarian
 */
const Librarian = mongoose.model('Librarian', librarianSchema);

module.exports = Librarian;
