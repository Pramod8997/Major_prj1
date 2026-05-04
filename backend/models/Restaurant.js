const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  rating: { type: Number, default: 0 },
  deliveryTime: { type: String }, // e.g., "30-45 min"
  dishes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dish' }]
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
