const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { authMiddleware } = require('../middleware/authMiddleware');

// Get reviews for a restaurant
router.get('/:restaurantId', async (req, res) => {
  try {
    const reviews = await Review.find({ restaurant: req.params.restaurantId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add a review
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { restaurant, rating, comment } = req.body;
    const newReview = new Review({
      user: req.user.id,
      restaurant,
      rating,
      comment
    });
    const saved = await newReview.save();
    res.json(saved);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
