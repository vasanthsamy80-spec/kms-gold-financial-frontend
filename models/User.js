const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String },
  phone: { type: String },
  password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
