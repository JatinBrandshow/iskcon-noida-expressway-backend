const express = require("express")
const { noticeController } = require("../controller")
const router = express.Router()

// GET /api/notices - Get all notices with filtering and pagination
router.get("/", noticeController.getAllNotices)

// GET /api/notices/stats - Get notice statistics
router.get("/stats", noticeController.getNoticeStats)

// GET /api/notices/:id - Get single notice by ID
router.get("/:id", noticeController.getNoticeById)

// POST /api/notices - Create new notice
router.post("/", noticeController.createNotice)

// PUT /api/notices/:id - Update notice
router.put("/:id", noticeController.updateNotice)

// DELETE /api/notices/:id - Delete notice (soft delete)
router.delete("/:id", noticeController.deleteNotice)

module.exports = router
