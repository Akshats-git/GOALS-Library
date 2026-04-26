const { Librarian } = require('../../../models');
const ApiError = require('../../../utils/ApiError');
const httpStatus = require('http-status-codes');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const createLibrarian = async (librarianBody) => {
  const librarianData = await Librarian.create(librarianBody);

  return librarianData;
};

const queryLibrarian = async () => {
  const librarians = await Librarian.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'userDetails',
      },
    },
    { $unwind: '$userDetails' },
    {
      $addFields: {
        userDetails: {
          $mergeObjects: ['$userDetails', '$$ROOT'],
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: '$userDetails',
      },
    },
  ]);

  return librarians;
};

const getLibrarianById = async (id) => {
  const librarianDetails = await Librarian.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'userDetails',
      },
    },
    { $unwind: '$userDetails' },
    {
      $addFields: {
        userDetails: {
          $mergeObjects: ['$userDetails', '$$ROOT'],
        },
      },
    },
    {
      $replaceRoot: {
        newRoot: '$userDetails',
      },
    },
  ]);

  if (!librarianDetails || librarianDetails.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Librarian not found');
  }

  return librarianDetails[0];
};

const updateLibrarianById = async (librarianId, updateBody) => {
  const librarian = await Librarian.findOneAndUpdate({ _id: librarianId }, updateBody, {
    new: true, // Return the updated document
    runValidators: true, // Ensure validation rules are applied during update
  });

  if (!librarian) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Librarian not found');
  }

  return librarian;
};

const deleteLibrarianById = async (librarianId) => {
  const librarianDetails = await getLibrarianById(librarianId);
  if (!librarianDetails) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Librarian not found');
  }
  await librarianDetails.remove();
};
const findById = async (id) => {
  const librarian = await Librarian.findOne({ userId: id });
  return await getLibrarianById(librarian.userId);
};
const sendMail = async (toEmail, subject, status, name, author, reminder, endDate) => {
  try {
    // Create the transporter object using Gmail service
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      port: 465,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    let mailOptions;
    if (!reminder) {
      // Normal issue/return email
      mailOptions = {
        from: process.env.EMAIL,
        to: toEmail,
        subject: subject,
        html: `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Document</title>
          </head>
          <body>
              <p>Hello,</p> 
              <p>Your request to ${
                status === 'issue' ? 'issue' : 'return'
              } "<strong>${name}</strong>" by "<strong>${author}</strong>" has been successfully processed.</p> 
              <p>Kindly contact the librarian and decide a convenient time to ${
                status === 'issue' ? 'collect' : 'handover'
              } the book.</p> 
              <p>NOTE: You have to return the issued book within 21 days.</p>
              <p>Thank you for issuing a book from GOALS Library!</p> 
              <p>Best regards,</p> 
              <p><strong>Akshat Gupta,</strong></p> 
              <em>Librarian, General Oratory and Literary Society, GOALS</em><br> 
              <em>Indian Institute of Technology, Bhilai</em>
          </body>
          </html>`,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      };
    } else {
      // Format endDate before using it in the reminder email
      const formattedEndDate = new Date(endDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      // Reminder email with formatted date
      mailOptions = {
        from: process.env.EMAIL,
        to: toEmail,
        subject: subject,
        html: `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Document</title>
          </head>
          <body>
              <p>Hello,</p> 
              <p>This is a gentle reminder that the following book borrowed from the GOALS library is due for return soon: </p>
              <ul>
                  <li><strong>Book Name:</strong> ${name}</li>
                  <li><strong>Author:</strong> ${author}</li>
                  <li><strong>Due Date:</strong> ${formattedEndDate}</li>
              </ul> 
              <p>Please return or renew your book before the due date.</p> 
              <p>If you have any questions or need assistance with renewing the book, feel free to contact us at <a href="mailto:akshatg@iitbhilai.ac.in">akshatg@iitbhilai.ac.in</a> or visit the library.</p>
              <p>Thank you for issuing a book from GOALS Library!</p> 
              <p>Best regards,</p> 
              <p><strong>Akshat Gupta,</strong></p> 
              <em>Librarian, General Oratory and Literary Society, GOALS</em><br> 
              <em>Indian Institute of Technology, Bhilai</em>
          </body>
          </html>`,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      };
    }

    // Send email using nodemailer
    await transporter.sendMail(mailOptions);

    console.log('Email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error sending email');
  }
};

const notify = async (email, name, author) => {
  try {
    // Create the transporter object using Gmail service
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Ensure the correct service name is used
      secure: true, // For 465 port, secure should be true
      port: 465, // Port for secure SMTP
      auth: {
        user: process.env.EMAIL, // Sender email address
        pass: process.env.PASSWORD, // App-specific password (if 2FA enabled)
      },
    });
    console.log('1');
    // Define mail options with properly escaped HTML string
    const mailOptions = {
      from: process.env.EMAIL, // Sender address
      to: email, // Receiver email
      subject: 'Availability Notification', // Email subject
      html: `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Document</title>
          </head>
          <body>
              <p>Hello,</p> 
              <p>We are pleased to inform you that "<strong>${name}</strong>" by "<strong>${author}</strong>" is currently available in the library.</p> 
              <p>Please feel free to visit our website to borrow the book. If you have any questions, feel free to reach out.</p> 
              <p>Thank you for your interest!</p> 
              <p>Best regards,</p> 
              <p><strong>Akshat Gupta,</strong></p> 
              <em>Librarian, General Oratory and Literary Society, GOALS</em><br> 
              <em>Indian Institute of Technology, Bhilai</em>
          </body>
          </html>`,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    };

    // Send email using nodemailer
    await transporter.sendMail(mailOptions);

    console.log('Email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error sending email');
  }
};

module.exports = {
  createLibrarian,
  queryLibrarian,
  getLibrarianById,
  updateLibrarianById,
  deleteLibrarianById,
  findById,
  sendMail,
  notify,
};
