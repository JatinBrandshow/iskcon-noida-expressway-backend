const mongoose = require("mongoose");

const calendarSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    heading: {
      type: String,
    },
    line: {
      type: String,
    },
    type: {
      type: String,
    },
    rashi: {
      type: String,
    },
    timings: {
      type: [String],
      default: [],
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
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Calendar = mongoose.model("Calendar", calendarSchema);

module.exports = Calendar;
