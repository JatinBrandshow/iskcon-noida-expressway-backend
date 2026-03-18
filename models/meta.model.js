const mongoose = require("mongoose");

const metaSchema = new mongoose.Schema(
  {
    pageid: {
      type: Number,
      required: true,
    },
    metatitle: {
      type: String,
      required: true,
    },
    metaDescription: {
      type: String,
      required: true,
    },
    metaKeywords: {
      type: Array,
      required: true,
    },
    path: {
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

const Meta = mongoose.model("meta", metaSchema);

module.exports = Meta;
