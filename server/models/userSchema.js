const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensures unique email addresses
  },
  password: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  switches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Switch', // Reference to the Switch model
  }],
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);
