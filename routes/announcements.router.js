const express = require("express");
const router = express.Router();

// Import Controllers
const { announcementController } = require("../controller");

// Define Routes
router.post("/", announcementController.addAnnouncement);
router.post("/update", announcementController.updateAnnouncement);
router.post("/delete", announcementController.deleteAnnouncement);
router.post("/toggle-status", announcementController.toggleAnnouncementStatus);
router.get("/all", announcementController.getAllAnnouncements); // Optional: Get all announcements
router.get("/get-by-stream", announcementController.getAllAnnouncementsByStream); // Optional: Get all announcements

module.exports = router;
