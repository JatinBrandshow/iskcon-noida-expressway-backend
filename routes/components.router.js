const express = require('express');
const router = express.Router();
const { componentsController } = require('../controller')
router.post('/', componentsController.createComponent);
router.get('/', componentsController.getAllComponents);
router.get('/category/:categoryName', componentsController.getComponentsByCategory);
router.get('/:id', componentsController.getComponentById);
router.put('/:id', componentsController.updateComponent);
router.delete('/:id', componentsController.deleteComponent);

module.exports = router;
