// models/faqModel.js
const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    page_id: {
      type: String, 
      required: true,
      trim: true
    },
    question: {  // Single question (not an array)
      type: String,
      required: true,
      trim: true
    },
    answer: {    // Single answer (not an array)
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: Boolean,
      default: true,
    },
    deleteflag: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true 
  }
);

module.exports = mongoose.model("Faq", faqSchema);