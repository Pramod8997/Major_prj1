const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const seedDB = require('./seed');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Use API Routes
app.use('/api', apiRoutes);

// Start MongoDB Memory Server and Connect
const startServer = async () => {
  try {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri);
    console.log(`Connected to in-memory MongoDB at ${mongoUri}`);
    
    // Seed the database with mock data
    await seedDB();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer();
