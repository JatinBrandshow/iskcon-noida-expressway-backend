const express = require("express");
const router = express.Router();

const { newsDetailPageController} = require("../controller");

router.get("/all", newsDetailPageController.getNewsDetailPages);

module.exports = router;