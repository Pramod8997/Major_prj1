const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  items: [
    {
      dishId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish' },
      name: String,
      price: Number,
      qty: Number
    }
  ],
  totalAmount: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  deliveryAddress: {
    street: String,
    city: String,
    zip: String
  },
  status: { type: String, enum: ['pending', 'accepted', 'cooking', 'out_for_delivery', 'delivered', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
