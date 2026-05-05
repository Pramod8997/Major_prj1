const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const Dish = require('../models/Dish');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Get all restaurants
router.get('/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Advanced search for restaurants and dishes
router.get('/search', async (req, res) => {
  try {
    const { q, type } = req.query; // type: 'restaurant' or 'dish' or 'all'
    let results = { restaurants: [], dishes: [] };
    
    if (!q) return res.json(results);
    const regex = new RegExp(q, 'i');
    
    if (type === 'restaurant' || !type || type === 'all') {
      results.restaurants = await Restaurant.find({ 
        $or: [{ name: regex }, { cuisineTypes: regex }] 
      });
    }
    
    if (type === 'dish' || !type || type === 'all') {
      results.dishes = await Dish.find({ name: regex });
    }
    
    res.json(results);
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

// ADMIN ROUTES
// Add a restaurant
router.post('/restaurants', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const newRestaurant = new Restaurant(req.body);
    const saved = await newRestaurant.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a restaurant
router.delete('/restaurants/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Restaurant.findByIdAndDelete(req.params.id);
    res.json({ message: 'Restaurant removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a dish to a restaurant
router.post('/restaurants/:id/dishes', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const newDish = new Dish(req.body);
    const savedDish = await newDish.save();
    
    // Add dish reference to restaurant
    const restaurant = await Restaurant.findById(req.params.id);
    restaurant.dishes.push(savedDish._id);
    await restaurant.save();

    res.json(savedDish);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a dish
router.delete('/dishes/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Optionally remove ref from restaurant, but simple delete here
    await Dish.findByIdAndDelete(req.params.id);
    res.json({ message: 'Dish removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
