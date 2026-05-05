const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

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

// Update order status (Admin/Restaurant)
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Admin: Get all orders
router.get('/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('restaurant', 'name').populate('user', 'name email');
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
