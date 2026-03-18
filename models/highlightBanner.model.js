const mongoose = require("mongoose");

const highlightBannerSchema = new mongoose.Schema(
  {
    banner: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    bannerAlt:{
      type: String,
    },
    link: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
    },
    size: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      required: true,
      default: [],
    },
    stream: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    deleteflag: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Use PascalCase for the model name
const HighlightBanner = mongoose.model("HighlightBanner", highlightBannerSchema);

module.exports = HighlightBanner;
