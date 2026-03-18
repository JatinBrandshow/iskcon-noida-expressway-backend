const express = require("express");
const { slugController } = require("../controller");

const router = express.Router();
const multer = require("multer");
const { userAuth } = require("../middlewares/auth");
const upload = multer({ storage: multer.memoryStorage() }); // or diskStorage


// Route to create a new slug
// router.post('/', slugController.insert);

// Route to create a new slug
router.post("/add", userAuth, slugController.addPageInactive);
router.post("/update", userAuth, upload.any(), slugController.update);

// // Route to get all slugs
router.post("/getParents", userAuth, slugController.getParent);

// // Route to get all slugs
router.post("/getList", userAuth, slugController.getList);

// // Route to get all slugs
router.get("/getbytype", userAuth, slugController.getSlugByType);

// // Route to get all slugs
router.get("/getbyid", userAuth, slugController.getById);

router.get('/', slugController.getBySlug)

module.exports = router;
