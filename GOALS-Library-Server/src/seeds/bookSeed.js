const mongoose = require('mongoose');
const { Book } = require('../models');
require('../config/config');

const seedBooks = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/library-management');
    console.log('Connected to MongoDB');

    // Clear existing books (optional - comment out if you want to preserve existing data)
    // await Book.deleteMany({});

    const booksData = [
      {
        name: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        count: 5,
        cover: 'https://images.unsplash.com/photo-1543632706-a0c45fba60be?w=400',
        tags: ['Classics', 'Fiction'],
      },
      {
        name: '1984',
        author: 'George Orwell',
        count: 4,
        cover: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400',
        tags: ['Science Fiction', 'Classics', 'Thriller'],
      },
      {
        name: 'Pride and Prejudice',
        author: 'Jane Austen',
        count: 6,
        cover: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
        tags: ['Romance', 'Classics', 'Fiction'],
      },
      {
        name: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        count: 5,
        cover: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400',
        tags: ['Classics', 'Fiction'],
      },
      {
        name: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        count: 3,
        cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
        tags: ['Fiction', 'Young Adult', 'Classics'],
      },
      {
        name: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        count: 7,
        cover: 'https://images.unsplash.com/photo-1457537314424-01cf2c6ac6c5?w=400',
        tags: ['Non-Fiction', 'History', 'Philosophy'],
      },
      {
        name: 'A Brief History of Time',
        author: 'Stephen Hawking',
        count: 4,
        cover: 'https://images.unsplash.com/photo-1503842095447-dca6ad2b3e12?w=400',
        tags: ['Science', 'Technology', 'Non-Fiction'],
      },
      {
        name: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        count: 5,
        cover: 'https://images.unsplash.com/photo-1496180727852-4d70d75c477f?w=400',
        tags: ['Psychology', 'Self-help', 'Non-Fiction'],
      },
      {
        name: 'The Art of War',
        author: 'Sun Tzu',
        count: 6,
        cover: 'https://images.unsplash.com/photo-1544716278-ca5e3af2abd8?w=400',
        tags: ['Philosophy', 'Business', 'Classics'],
      },
      {
        name: 'Atomic Habits',
        author: 'James Clear',
        count: 8,
        cover: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
        tags: ['Self-help', 'Psychology', 'Non-Fiction'],
      },
      {
        name: 'Dune',
        author: 'Frank Herbert',
        count: 3,
        cover: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400',
        tags: ['Science Fiction', 'Adventure', 'Fantasy'],
      },
      {
        name: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien',
        count: 4,
        cover: 'https://images.unsplash.com/photo-1543632706-a0c45fba60be?w=400',
        tags: ['Fantasy', 'Adventure', 'Classics'],
      },
      {
        name: 'Harry Potter and the Philosopher\'s Stone',
        author: 'J.K. Rowling',
        count: 7,
        cover: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400',
        tags: ['Young Adult', 'Fantasy', 'Adventure'],
      },
      {
        name: 'The Chronicles of Narnia',
        author: 'C.S. Lewis',
        count: 5,
        cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
        tags: ['Fantasy', 'Children', 'Adventure'],
      },
      {
        name: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        count: 4,
        cover: 'https://images.unsplash.com/photo-1457537314424-01cf2c6ac6c5?w=400',
        tags: ['Fantasy', 'Adventure', 'Young Adult'],
      },
      {
        name: 'The Silent Patient',
        author: 'Alex Michaelides',
        count: 5,
        cover: 'https://images.unsplash.com/photo-1503842095447-dca6ad2b3e12?w=400',
        tags: ['Mystery', 'Thriller', 'Fiction'],
      },
      {
        name: 'The Girl with the Dragon Tattoo',
        author: 'Stieg Larsson',
        count: 6,
        cover: 'https://images.unsplash.com/photo-1496180727852-4d70d75c477f?w=400',
        tags: ['Mystery', 'Thriller', 'Crime'],
      },
      {
        name: 'A Brief History of Everything',
        author: 'Ken Wilber',
        count: 3,
        cover: 'https://images.unsplash.com/photo-1544716278-ca5e3af2abd8?w=400',
        tags: ['Philosophy', 'Non-Fiction', 'Science'],
      },
      {
        name: 'The Code of the Extraordinary Mind',
        author: 'Vishen Lakhiani',
        count: 4,
        cover: 'https://images.unsplash.com/photo-1543632706-a0c45fba60be?w=400',
        tags: ['Self-help', 'Psychology', 'Business'],
      },
      {
        name: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen',
        count: 5,
        cover: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400',
        tags: ['Technology', 'Engineering', 'Mathematics'],
      },
    ];

    // Insert books into the database
    const result = await Book.insertMany(booksData);
    console.log(`\n✅ Successfully seeded ${result.length} books into the database!\n`);

    // Display the seeded books
    console.log('Seeded Books:');
    result.forEach((book, index) => {
      console.log(`${index + 1}. ${book.name} by ${book.author} (${book.count} copies) - Tags: ${book.tags.join(', ')}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding books:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the seed function
seedBooks();
