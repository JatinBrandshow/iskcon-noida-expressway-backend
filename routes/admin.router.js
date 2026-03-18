const express = require('express');
const router = express.Router();
const { adminController } = require('../controller');
const protect = require('../middlewares/authMiddleware.js');

// Public routes
router.post('/register', adminController.registerAdmin);
router.post('/login', adminController.loginAdmin);

// Protected routes
router.get('/me', protect, adminController.getAdminProfile);
router.get('/logOut', protect, adminController.logoutAdmin);

router.get("/all", protect, adminController.getAllAdmins);
router.put("/update/:id", protect, adminController.updateAdmin);
router.delete("/delete/:id", protect, adminController.deleteAdmin);


module.exports = router;
