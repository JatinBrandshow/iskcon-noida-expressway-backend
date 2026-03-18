// routes/param.routes.js
const express = require('express');
const router = express.Router();
const { extraParamsDataController } = require('../controller');

router.post('/create', extraParamsDataController.createParam);
router.get('/all', extraParamsDataController.getAllParams);
router.get('/:id', extraParamsDataController.getParamById);
router.put('/:id', extraParamsDataController.updateParam);
router.delete('/:id', extraParamsDataController.deleteParam);
router.get('/used-holders/:pageid', extraParamsDataController.getUsedHoldersByPageId);

module.exports = router;
