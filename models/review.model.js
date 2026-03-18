// models/review.model.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
     page_ids: { 
      type: [String],  
      required: false,
      default: []      
    },
    course: { type: String, required: true, trim: true },
    company_name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String },
    status: { type: Boolean, default: true },
    deleteflag: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
