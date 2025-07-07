// === FILE: models/User.js ===
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  pin: {
    type: String,
    unique: true,
    required: true
  },
  used: {
    type: Boolean,
    default: false
  },
  formData: {
    type: Object,
    default: null
  }
});

module.exports = mongoose.model('User', userSchema);