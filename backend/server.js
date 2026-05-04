const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const { router: authRoutes } = require('./routes/auth');
const ordersRoutes = require('./routes/orders');
const seedDB = require('./seed');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Use Routes
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);

// Connect to Persistent Local MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/food_delivery')
  .then(async () => {
    console.log('Connected to persistent MongoDB at mongodb://127.0.0.1:27017/food_delivery');
    
    // Check if database is empty to run seed automatically (optional fallback)
    const Restaurant = require('./models/Restaurant');
    const count = await Restaurant.countDocuments();
    if (count === 0) {
      console.log('Database empty, running initial seed...');
      await seedDB();
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB. Is MongoDB running locally?', err);
  });
