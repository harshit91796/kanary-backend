const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  actionType: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
  },
  userRole: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  additionalData: mongoose.Schema.Types.Mixed,
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Log = mongoose.model('Log', LogSchema);

module.exports = Log;
