const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', formController.getAllForms);
router.get('/:id', formController.getFormById);

// Protected routes (admin only)
router.post('/', authMiddleware, formController.createForm);
router.put('/:id', authMiddleware, formController.updateForm);
router.delete('/:id', authMiddleware, formController.deleteForm);
router.put('/:id/reorder', authMiddleware, formController.reorderFields);

module.exports = router;
