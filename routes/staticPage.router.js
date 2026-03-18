const express = require("express");
const { staticPageController } = require("../controller");

const router = express.Router();

// Route to create a new slug
router.post("/", staticPageController.createStaticPage);

module.exports = router;
