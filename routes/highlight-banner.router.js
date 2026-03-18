const express = require("express");
const router = express.Router();

// import Controllers
const { highlightBannerController } = require("../controller");
const { userAuth } = require("../middlewares/auth");

// Define Routes
router.post("/", userAuth, highlightBannerController.addHighlightBanner);
router.post("/update", userAuth, highlightBannerController.updateHighlightBanner);
router.post("/delete", userAuth, highlightBannerController.deleteHighlightBanner);
router.get("/", userAuth, highlightBannerController.getHighlightBannerById);
router.get("/list", userAuth, highlightBannerController.getHighlightBannerList);
router.get("/get-by-tags", highlightBannerController.getHighlightBannerByTagsAndStream);

module.exports = router;
