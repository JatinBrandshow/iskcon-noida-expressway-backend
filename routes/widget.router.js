const express = require("express");
const { widgetController } = require("../controller");

const router = express.Router();

// Route to create a new slug
router.get("/", widgetController.getWidgetData);

module.exports = router;
