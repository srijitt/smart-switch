const mongoose = require('mongoose');

const switchSchema = new mongoose.Schema({
  serialId: {
    type: String,
    required: true,
    unique: true, // Ensures unique serial IDs
  },
  status: {
    type: String,
    default: 'off', // Default status is off
    enum: ['on', 'off'], // Allowed status options
  },
  name: {
    type: String,
    default: ''
  },
  ssid: {
    type: String,
    default: 'none', // Default ssid is none
  }
}, {timestamps: true});

module.exports = mongoose.model('Switch', switchSchema);
