// models/AdminLog.js
const mongoose = require('mongoose');

const AdminLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  module: { type: String, required: true },        // e.g. "Login", "Pages", "Horoscope"
  action: { type: String, required: true },        // e.g. "login", "create", "edit", "delete", "generate"
  targetId: { type: mongoose.Schema.Types.Mixed }, // e.g. page_id, user_id, etc. (optional)
  targetLabel: { type: String },                   // e.g. "About Page", "John's Horoscope" (optional)
  description: { type: String },                   // detailed text, optional
  ipAddress: { type: String },
  userAgent: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('AdminLog', AdminLogSchema);
