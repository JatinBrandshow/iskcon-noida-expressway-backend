const express = require("express");
const router = express.Router();

// import Controllers
const { metaController } = require("../controller");

// Define Routes
router.get("/get", metaController.getMeta);
router.get("/list", metaController.list);
router.post("/add", metaController.addMeta);
router.post("/delete", metaController.deleteMeta);

module.exports = router;
