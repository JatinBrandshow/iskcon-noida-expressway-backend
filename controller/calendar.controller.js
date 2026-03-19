const mongoose = require("mongoose");
const { Calendar } = require("../models");
const calendarService = require("../services/calendar.service");

const getTithi = async (req, res) => {
  try {
    console.log("Calendar [getTithi] Request Body:", req.body);
    const {
      date,
      language,
      day,
      month,
      year,
      min,
      hour,
      latitude,
      longitude,
      timezone,
    } = req.body;

    // Manual validation since middleware might be bypassed or not used for all fields
    if (!year || !month) {
      return res.status(400).json({ 
        status: false, 
        message: "Year and Month are required", 
        data: false 
      });
    }

    const calendar = await calendarService.getTithiData(
      date,
      day,
      month,
      year,
      min || 0,
      hour || 12,
      latitude || 28.5355,
      longitude || 77.391,
      timezone || 5.5,
      language || 'en'
    );
    
    console.log("Calendar [getTithi] Service Response Success");

    if (!calendar || (calendar.tithi && calendar.tithi.length == 0)) {
      return res.status(404).json({ status: false, message: "Calendar not found", data: calendar });
    }

    return res.status(200).json({ status: true, message: "Calendar found", data: calendar });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: error.message, data: false });
  }
};

const getTithiByDate = async (req, res) => {
  try {
    const {
      date,
      language,
      day,
      month,
      year,
      min,
      hour,
      latitude,
      longitude,
      timezone,
    } = req.body;

    const calendar = await calendarService.getTithiDataForDate(
      date,
      day,
      month,
      year,
      min,
      hour,
      latitude,
      longitude,
      timezone,
      language
    );

    if (!calendar || !calendar.tithi) {
      return res.status(404).json({ status: false, message: "Tithi data not found", data: calendar });
    }

    return res.status(200).json({ status: true, message: "Tithi data found", data: calendar });
  } catch (error) {
    console.error("Error fetching Tithi data:", error);
    return res.status(500).json({ status: false, message: "Internal server error", data: false });
  }
};

// Admin methods for manual entries
const addCalender = async (req, res) => {
  try {
    const { date, heading, line, type, rashi } = req.body;

    const existingEntry = await Calendar.findOne({
      date: date.split('T')[0],
      type,
      rashi,
      status: true,
      deleteflag: false,
    });

    if (existingEntry) {
      return res.status(409).json({
        status: false,
        message: "Calendar entry already exists",
        data: existingEntry,
      });
    }

    const calendarEntry = new Calendar({
      date: date.split('T')[0],
      heading,
      line,
      type,
      rashi,
    });

    const savedEntry = await calendarEntry.save();

    res.json({
      status: true,
      message: "Calendar entry created successfully",
      data: savedEntry,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error creating calendar entry",
      data: error.message,
    });
  }
};

const getCalender = async (req, res) => {
  try {
    const calendar = await Calendar.find({ status: true, deleteflag: false });
    res.json({
      status: true,
      message: "Calendar entries found",
      data: calendar,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error getting calendar entries",
      data: error.message,
    });
  }
};

const getCalenderById = async (req, res) => {
  try {
    const { id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid calendar id", data: false });
    }

    const calendar = await Calendar.findById(id);
    if (!calendar) {
      return res.status(404).json({ status: false, message: "Calendar entry not found", data: false });
    }
    return res.json({ status: true, message: "Calendar entry found", data: calendar });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Error getting calendar entry", data: error.message });
  }
};

const getCalenderBydate = async (req, res) => {
  try {
    const { date, rashi } = req.body;
    const calendar = await Calendar.find({
      date: date.split('T')[0],
      rashi: rashi,
      status: true,
      deleteflag: false,
    });

    if (!calendar || calendar.length === 0) {
      return res.status(404).json({ status: false, message: "Calendar entry not found", data: false });
    }
    res.json({ status: true, message: "Calendar entry found", data: calendar });
  } catch (error) {
    res.status(500).json({ status: false, message: "Error getting calendar entry", data: error.message });
  }
};

const updateCalender = async (req, res) => {
  try {
    const { id, date, heading, line, type, rashi } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: false, message: "Invalid calendar id", data: false });
    }

    const calendar = await Calendar.findById(id);
    if (!calendar) {
      return res.status(404).json({ status: false, message: "Calendar entry not found", data: false });
    }

    if (date) calendar.date = date.split('T')[0];
    if (heading) calendar.heading = heading;
    if (line) calendar.line = line;
    if (type) calendar.type = type;
    if (rashi) calendar.rashi = rashi;

    await calendar.save();

    return res.json({ status: true, message: "Calendar entry updated successfully", data: calendar });
  } catch (error) {
    res.status(500).json({ status: false, message: "Error updating calendar entry", data: error.message });
  }
};

const deleteCalenderdetails = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ status: false, message: "Invalid calendar id", data: false });
    }
    const calendar = await Calendar.findById(_id);
    if (!calendar) {
      return res.status(404).json({ status: false, message: "Calendar entry not found", data: false });
    }
    calendar.deleteflag = true;
    calendar.status = false;
    await calendar.save();
    res.json({ status: true, message: "Calendar entry deleted successfully", data: calendar });
  } catch (error) {
    res.status(500).json({ status: false, message: "Error deleting calendar entry", data: error.message });
  }
};

module.exports = {
  getTithi,
  getTithiByDate,
  addCalender,
  getCalender,
  getCalenderById,
  getCalenderBydate,
  updateCalender,
  deleteCalenderdetails,
};
