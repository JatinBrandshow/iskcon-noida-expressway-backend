// models/PageParam.js
const mongoose = require("mongoose");

const PageParamSchema = new mongoose.Schema({
    pageid: { type: String, required: true },
    key: { type: String, required: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    pageType: { type: String }, // e.g., blog, horoscope, service etc.
    dataType: { type: String }, // e.g., string, number, boolean, image etc.
    status: { type: Boolean, default: true },
    deleteflag: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("PageParam", PageParamSchema);
