const express = require("express")
const { topperController } = require("../controller")
const router = express.Router()

// GET /api/toppers/stats - Get topper statistics
router.get("/stats", topperController.getTopperStats)

// GET /api/toppers - Get all toppers with optional filtering and pagination
router.get("/", topperController.getAllToppers)

// GET /api/toppers/:id - Get single topper by ID
router.get("/:id", topperController.getTopperById)

// POST /api/toppers - Create new topper
router.post("/", topperController.createTopper)

// PUT /api/toppers/:id - Update topper
router.put("/:id", topperController.updateTopper)

// DELETE /api/toppers/:id - Delete topper
router.delete("/:id", topperController.deleteTopper)

module.exports = router
