const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://10.50.49.216',
    'http://10.50.49.216:3000',
    'http://10.50.49.216:3001',
    'http://10.50.49.216:5173',
    'http://10.50.49.216:80',
    'http://10.50.49.216:8080'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = corsOptions;