const fs = require('fs');
const path = require('path');
const logStream = fs.createWriteStream(path.join(__dirname, 'backend.log'), { flags: 'a' });

const originalLog = console.log;
const originalError = console.error;

console.log = function() {
  const args = Array.from(arguments);
  logStream.write(`[LOG] ${new Date().toISOString()}: ${args.join(' ')}\n`);
  originalLog.apply(console, args);
};

console.error = function() {
  const args = Array.from(arguments);
  logStream.write(`[ERR] ${new Date().toISOString()}: ${args.join(' ')}\n`);
  originalError.apply(console, args);
};

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const { router: authRoutes } = require('./routes/auth');
const ordersRoutes = require('./routes/orders');
const seedDB = require('./seed');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic route to check if server is up
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// Use Routes
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);

const startServer = async () => {
  try {
    // Attempt to connect to persistent Local MongoDB with a 2-second timeout
    console.log('Attempting to connect to persistent MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/food_delivery', {
      serverSelectionTimeoutMS: 2000
    });
    console.log('Connected to persistent MongoDB at mongodb://127.0.0.1:27017/food_delivery');
    
    // Seed if empty
    const Restaurant = require('./models/Restaurant');
    const count = await Restaurant.countDocuments();
    if (count === 0) {
      console.log('Database empty, running initial seed...');
      await seedDB();
    }
  } catch (err) {
    console.error('Failed to connect to persistent MongoDB. Falling back to mongodb-memory-server...', err.message);
    try {
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      await mongoose.connect(mongoUri);
      console.log(`Connected to in-memory MongoDB at ${mongoUri} (DATA WILL BE LOST ON RESTART)`);
      
      console.log('Running initial seed for memory DB...');
      await seedDB();
    } catch (innerErr) {
      console.error('Failed to start memory server:', innerErr.message);
    }
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
