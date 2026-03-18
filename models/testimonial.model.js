const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    position: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    company_name: { type: String, required: true, trim: true },
    company_city: { type: String, trim: true },
    company_country: { type: String, trim: true },
    page_ids: { type: [String], default: [] }, // Changed to array of strings
    image: { type: String },
    status: { type: Boolean, default: true },
    deleteflag: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);