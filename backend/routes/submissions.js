const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.post('/', submissionController.submitForm);

// Protected routes (admin only)
router.get('/:formId', authMiddleware, submissionController.getFormSubmissions);
router.get('/detail/:id', authMiddleware, submissionController.getSubmissionById);
router.get('/:formId/export', authMiddleware, submissionController.exportSubmissionsCSV);
router.delete('/:id', authMiddleware, submissionController.deleteSubmission);

module.exports = router;
