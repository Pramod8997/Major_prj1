const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const Dish = require('../models/Dish');

// Get all restaurants
router.get('/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single restaurant with its dishes
router.get('/restaurants/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('dishes');
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
