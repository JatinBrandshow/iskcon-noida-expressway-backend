const express = require("express");
const router = express.Router();
const multer = require("multer"); // Middleware for handling file uploads
const { uploadfileController } = require("../controller");
const { apikeyAuth } = require("../middlewares");

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" }); // Files will be temporarily stored in the "uploads" directory

// File upload route for multiple files
router.post("/", upload.array("files", 10), uploadfileController.uploadfile);
// "files" is the field name, and 10 is the maximum number of files allowed

module.exports = router;