const express = require("express")
const { applicationController } = require("../controller")

const router = express.Router()

// POST /api/applications - Create new application
router.post("/", applicationController.createApplication)

// GET /api/applications - Get all applications
router.get("/", applicationController.getAllApplications)

// GET /api/applications/:id - Get application by ID
router.get("/:id", applicationController.getApplicationById)

// PUT /api/applications/:id/status - Update application status
router.put("/:id/status", applicationController.updateApplicationStatus)

module.exports = router