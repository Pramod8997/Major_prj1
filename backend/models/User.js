const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  addresses: [{
    street: String,
    city: String,
    zip: String,
    label: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Other' }
  }],
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

module.exports = mongoose.model('User', userSchema);
