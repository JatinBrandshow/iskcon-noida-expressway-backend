const { Announcements } = require("../models");

const addAnnouncement = async (req, res) => {
  try {
    const { title, link, status, stream } = req.body;

    if (!title || !link) {
      return res.status(400).json({
        status: false,
        message: "Title and link are required",
        data: false,
      });
    }

    const newAnnouncement = new Announcements({
      title,
      link,
      status: status !== undefined ? status : true,
      stream: stream || null, // Optional stream
    });

    await newAnnouncement.save();

    return res.status(201).json({
      status: true,
      message: "Announcement added successfully",
      data: newAnnouncement,
    });
  } catch (error) {
    console.error("Error adding announcement:", error);
    return res.status(500).json({
      status: false,
      message: "Server error while adding announcement",
      data: false,
    });
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const { _id, title, link, status, stream } = req.body;

    if (!_id) {
      return res.status(400).json({
        status: false,
        message: "Announcement _id is required",
        data: false,
      });
    }

    const existing = await Announcements.findById(_id);
    if (!existing) {
      return res.status(404).json({
        status: false,
        message: "Announcement not found",
        data: false,
      });
    }

    if (title) existing.title = title;
    if (link) existing.link = link;
    if (status !== undefined) existing.status = status;
    if (stream !== undefined) existing.stream = stream;

    const updatedAnnouncement = await existing.save();

    return res.status(200).json({
      status: true,
      message: "Announcement updated successfully",
      data: updatedAnnouncement,
    });
  } catch (error) {
    console.error("Error updating announcement:", error);
    return res.status(500).json({
      status: false,
      message: "Server error while updating announcement",
      data: false,
    });
  }
};

const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcements.find().sort({ createdAt: -1 });
    return res.status(200).json({
      status: true,
      message: "All announcements fetched successfully",
      data: announcements,
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return res.status(500).json({
      status: false,
      message: "Server error while fetching announcements",
      data: false,
    });
  }
};
const getAllAnnouncementsByStream = async (req, res) => {
  try {
    const { stream } = req.query;

    // base query (only active announcements)
    const query = { status: true };

    // if stream id is provided, add filter
    if (stream) {
      query.stream = stream;
    }

    const announcements = await Announcements.find(query)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: true,
      message: "Announcements fetched successfully",
      data: announcements,
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return res.status(500).json({
      status: false,
      message: "Server error while fetching announcements",
      data: false,
    });
  }
};



const deleteAnnouncement = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        status: false,
        message: "Announcement _id is required",
        data: false,
      });
    }

    const deleted = await Announcements.findByIdAndDelete(_id);

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Announcement not found",
        data: false,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Announcement deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return res.status(500).json({
      status: false,
      message: "Server error while deleting announcement",
      data: false,
    });
  }
};
const toggleAnnouncementStatus = async (req, res) => {
  try {
    const { _id, status } = req.body;

    if (!_id || typeof status !== "boolean") {
      return res.status(400).json({
        status: false,
        message: "_id and boolean status are required",
        data: false,
      });
    }

    const announcement = await Announcements.findById(_id);
    if (!announcement) {
      return res.status(404).json({
        status: false,
        message: "Announcement not found",
        data: false,
      });
    }

    announcement.status = status;
    const updated = await announcement.save();

    return res.status(200).json({
      status: true,
      message: `Announcement ${status ? "activated" : "deactivated"} successfully`,
      data: updated,
    });
  } catch (error) {
    console.error("Error toggling status:", error);
    return res.status(500).json({
      status: false,
      message: "Server error while updating status",
      data: false,
    });
  }
};
module.exports = {
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  toggleAnnouncementStatus,
  getAllAnnouncements,
  getAllAnnouncementsByStream
};

