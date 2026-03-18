const express = require("express");
const router = express.Router();

const { dashboardController} = require("../controller");

router.get("/all", dashboardController.getSlugStats);

module.exports = router;