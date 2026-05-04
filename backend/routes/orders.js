const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { authMiddleware } = require('../middleware/authMiddleware');

// Place a new order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { restaurant, items, totalAmount } = req.body;
    
    const newOrder = new Order({
      user: req.user.id,
      restaurant,
      items,
      totalAmount
    });

    const order = await newOrder.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get user's order history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 }).populate('restaurant', 'name');
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
