const Form = require('../models/Form');
const FormSubmission = require('../models/FormSubmission');
const { validateFormSubmission } = require('../middleware/validation');
const { Parser } = require('json2csv');

/**
 * Submit a form
 * POST /api/submissions
 */
exports.submitForm = async (req, res) => {
    try {
        const { formId, answers } = req.body;

        if (!formId || !answers) {
            return res.status(400).json({
                success: false,
                message: 'Form ID and answers are required'
            });
        }

        // Get form
        const form = await Form.findById(formId);

        if (!form) {
            return res.status(404).json({
                success: false,
                message: 'Form not found'
            });
        }

        if (!form.isActive) {
            return res.status(400).json({
                success: false,
                message: 'This form is no longer accepting submissions'
            });
        }

        // Validate submission
        const validation = validateFormSubmission(form.fields, answers);

        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            });
        }

        // Get client IP and user agent
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('user-agent');

        // Create submission
        const submission = new FormSubmission({
            formId: form._id,
            formVersion: form.version,
            answers: validation.validatedData,
            ipAddress,
            userAgent
        });

        await submission.save();

        res.status(201).json({
            success: true,
            message: 'Form submitted successfully',
            submissionId: submission._id
        });
    } catch (error) {
        console.error('Submit form error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while submitting form'
        });
    }
};

/**
 * Get submissions for a form
 * GET /api/submissions/:formId
 */
exports.getFormSubmissions = async (req, res) => {
    try {
        const { formId } = req.params;
        const { page = 1, limit = 20 } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get submissions
        const submissions = await FormSubmission.find({ formId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count
        const total = await FormSubmission.countDocuments({ formId });

        res.json({
            success: true,
            submissions,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get submissions error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching submissions'
        });
    }
};

/**
 * Get a single submission
 * GET /api/submissions/detail/:id
 */
exports.getSubmissionById = async (req, res) => {
    try {
        const submission = await FormSubmission.findById(req.params.id)
            .populate('formId', 'title description fields');

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        res.json({
            success: true,
            submission
        });
    } catch (error) {
        console.error('Get submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching submission'
        });
    }
};

/**
 * Export submissions as CSV
 * GET /api/submissions/:formId/export
 */
exports.exportSubmissionsCSV = async (req, res) => {
    try {
        const { formId } = req.params;

        // Get form to get field definitions
        const form = await Form.findById(formId);

        if (!form) {
            return res.status(404).json({
                success: false,
                message: 'Form not found'
            });
        }

        // Get all submissions
        const submissions = await FormSubmission.find({ formId }).sort({ createdAt: -1 });

        if (submissions.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No submissions found for this form'
            });
        }

        // Prepare data for CSV
        const csvData = submissions.map(submission => {
            const row = {
                'Submission ID': submission._id.toString(),
                'Submitted At': submission.createdAt.toISOString(),
                'IP Address': submission.ipAddress || 'N/A'
            };

            // Add all answers
            const answersObj = submission.answers.toObject ? submission.answers.toObject() : submission.answers;

            form.fields.forEach(field => {
                const value = answersObj[field.name];
                row[field.label] = value !== undefined && value !== null ?
                    (typeof value === 'object' ? JSON.stringify(value) : value) :
                    '';
            });

            return row;
        });

        // Convert to CSV
        const parser = new Parser();
        const csv = parser.parse(csvData);

        // Set headers for file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${form.title.replace(/\s+/g, '_')}_submissions.csv"`);
        res.send(csv);
    } catch (error) {
        console.error('Export CSV error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while exporting submissions'
        });
    }
};

/**
 * Delete a submission
 * DELETE /api/submissions/:id
 */
exports.deleteSubmission = async (req, res) => {
    try {
        const submission = await FormSubmission.findById(req.params.id);

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        await FormSubmission.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Submission deleted successfully'
        });
    } catch (error) {
        console.error('Delete submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting submission'
        });
    }
};
