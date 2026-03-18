// models/Session.js
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    userId: { type: Number, required: true },
    token: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    deviceInfo: { type: Object }
});

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Session', sessionSchema);
