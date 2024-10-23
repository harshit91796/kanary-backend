const mongoose = require('mongoose');

const BlacklistedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '7d', 
  },
});

const BlacklistedToken = mongoose.model('BlacklistedToken', BlacklistedTokenSchema);

module.exports = BlacklistedToken;
