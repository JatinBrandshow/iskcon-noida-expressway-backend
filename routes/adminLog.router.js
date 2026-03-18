// routes/adminLog.routes.js
const express = require('express');
const router = express.Router();
const { adminLogController } = require('../controller');
const protect = require('../middlewares/authMiddleware');

router.post('/save',protect, adminLogController.saveAdminLog);
router.get('/get',protect, adminLogController.getAdminLogs);


module.exports = router
