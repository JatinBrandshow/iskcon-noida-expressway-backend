const express = require('express');
const router = express.Router();
const { permissionController } = require('../controller');

// Create or Update
router.post('/', permissionController.setPermission);

// Get all
router.get('/', permissionController.getAllPermissions);

// Get by admin
router.get('/admin/:adminId', permissionController.getPermissionsByAdmin);

// Get by ID
router.get('/:id', permissionController.getPermissionById);

// Delete
router.delete('/:id', permissionController.deletePermission);

module.exports = router;
