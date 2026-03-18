const express = require("express")
const { downloadController } = require("../controller")

const router = express.Router()

// Routes
router.get("/stats", downloadController.getDownloadStats)
router.get("/", downloadController.getAllDownloads)
router.get("/:id", downloadController.getDownloadById)
router.post("/", downloadController.createDownload)
router.put("/:id", downloadController.updateDownload)
router.delete("/:id", downloadController.deleteDownload)
router.get("/:id/download", downloadController.downloadFile)

module.exports = router
