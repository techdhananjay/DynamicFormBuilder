const Form = require('../models/Form');

/**
 * Create a new form
 * POST /api/forms
 */
exports.createForm = async (req, res) => {
    try {
        const { title, description, fields } = req.body;

        // Validate required fields
        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Form title is required'
            });
        }

        // Create form
        const form = new Form({
            title,
            description,
            fields: fields || []
        });

        await form.save();

        res.status(201).json({
            success: true,
            message: 'Form created successfully',
            form
        });
    } catch (error) {
        console.error('Create form error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while creating form'
        });
    }
};

/**
 * Get all forms
 * GET /api/forms
 */
exports.getAllForms = async (req, res) => {
    try {
        const { includeInactive } = req.query;

        const query = includeInactive === 'true' ? {} : { isActive: true };

        const forms = await Form.find(query)
            .select('title description version isActive createdAt updatedAt')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: forms.length,
            forms
        });
    } catch (error) {
        console.error('Get forms error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching forms'
        });
    }
};

/**
 * Get single form by ID
 * GET /api/forms/:id
 */
exports.getFormById = async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);

        if (!form) {
            return res.status(404).json({
                success: false,
                message: 'Form not found'
            });
        }

        res.json({
            success: true,
            form
        });
    } catch (error) {
        console.error('Get form error:', error);

        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Form not found'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while fetching form'
        });
    }
};

/**
 * Update form
 * PUT /api/forms/:id
 */
exports.updateForm = async (req, res) => {
    try {
        const { title, description, fields, isActive } = req.body;

        let form = await Form.findById(req.params.id);

        if (!form) {
            return res.status(404).json({
                success: false,
                message: 'Form not found'
            });
        }

        // Update fields
        if (title !== undefined) form.title = title;
        if (description !== undefined) form.description = description;
        if (fields !== undefined) form.fields = fields;
        if (isActive !== undefined) form.isActive = isActive;

        // Increment version if fields changed
        if (fields !== undefined) {
            form.version += 1;
        }

        await form.save();

        res.json({
            success: true,
            message: 'Form updated successfully',
            form
        });
    } catch (error) {
        console.error('Update form error:', error);

        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Form not found'
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Server error while updating form'
        });
    }
};

/**
 * Delete form
 * DELETE /api/forms/:id
 */
exports.deleteForm = async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);

        if (!form) {
            return res.status(404).json({
                success: false,
                message: 'Form not found'
            });
        }

        await Form.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Form deleted successfully'
        });
    } catch (error) {
        console.error('Delete form error:', error);

        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Form not found'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while deleting form'
        });
    }
};

/**
 * Reorder form fields
 * PUT /api/forms/:id/reorder
 */
exports.reorderFields = async (req, res) => {
    try {
        const { fields } = req.body;

        if (!Array.isArray(fields)) {
            return res.status(400).json({
                success: false,
                message: 'Fields must be an array'
            });
        }

        const form = await Form.findById(req.params.id);

        if (!form) {
            return res.status(404).json({
                success: false,
                message: 'Form not found'
            });
        }

        // Update field order
        form.fields = fields;
        await form.save();

        res.json({
            success: true,
            message: 'Fields reordered successfully',
            form
        });
    } catch (error) {
        console.error('Reorder fields error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while reordering fields'
        });
    }
};
