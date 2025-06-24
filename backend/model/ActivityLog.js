const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: String,
  action: String, // "REGISTERED", "UPDATED", "DELETED"
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActivityLog', activitySchema);
