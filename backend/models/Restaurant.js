const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  rating: { type: Number, default: 0 },
  deliveryTime: { type: String }, // e.g., "30-45 min"
  cuisineTypes: [{ type: String }],
  isVegetarian: { type: Boolean, default: false },
  location: { type: String },
  dishes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dish' }]
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
