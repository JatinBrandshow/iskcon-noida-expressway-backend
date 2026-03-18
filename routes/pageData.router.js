// routes/pageParam.routes.js
const express = require("express");
const router = express.Router();
const { pageDataController } = require("../controller");

router.post("/add", pageDataController.addPageParam);
router.get("/all", pageDataController.getAllPageParams);
router.get("/get-by-pageid", pageDataController.getAllPageParamsByPageid);
router.get("/get-keys", pageDataController.getUniqueKeysByPageType);
router.put("/update/:id", pageDataController.updatePageParam);
router.delete("/delete/:id", pageDataController.deletePageParam);

module.exports = router;
