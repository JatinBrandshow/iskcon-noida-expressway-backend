const express = require("express");
const router = express.Router();

const { editPathController} = require("../controller");

router.post('/all', editPathController.editPath);
router.get('/:page_id', editPathController.getSlugByPageId);

module.exports = router;