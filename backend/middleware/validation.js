/**
 * Validates form submission data against form field definitions
 */
const validateFormSubmission = (formFields, submissionData) => {
    const errors = {};
    const validatedData = {};

    // Helper function to validate a single field
    const validateField = (field, value, fieldPath = field.name) => {
        // Check if required field is missing
        if (field.required && (value === undefined || value === null || value === '')) {
            errors[fieldPath] = `${field.label} is required`;
            return false;
        }

        // Skip further validation if field is not required and empty
        if (!field.required && (value === undefined || value === null || value === '')) {
            return true;
        }

        // Type-specific validation
        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errors[fieldPath] = `${field.label} must be a valid email address`;
                    return false;
                }
                break;

            case 'number':
                const numValue = Number(value);
                if (isNaN(numValue)) {
                    errors[fieldPath] = `${field.label} must be a number`;
                    return false;
                }

                // Check min/max validation
                if (field.validation) {
                    if (field.validation.min !== undefined && numValue < field.validation.min) {
                        errors[fieldPath] = field.validation.message ||
                            `${field.label} must be at least ${field.validation.min}`;
                        return false;
                    }
                    if (field.validation.max !== undefined && numValue > field.validation.max) {
                        errors[fieldPath] = field.validation.message ||
                            `${field.label} must be at most ${field.validation.max}`;
                        return false;
                    }
                }
                validatedData[fieldPath] = numValue;
                return true;

            case 'date':
                const dateValue = new Date(value);
                if (isNaN(dateValue.getTime())) {
                    errors[fieldPath] = `${field.label} must be a valid date`;
                    return false;
                }
                validatedData[fieldPath] = dateValue;
                return true;

            case 'text':
            case 'textarea':
                // Check regex validation
                if (field.validation && field.validation.regex) {
                    const regex = new RegExp(field.validation.regex);
                    if (!regex.test(value)) {
                        errors[fieldPath] = field.validation.message ||
                            `${field.label} format is invalid`;
                        return false;
                    }
                }

                // Check min/max length
                if (field.validation) {
                    if (field.validation.min && value.length < field.validation.min) {
                        errors[fieldPath] = field.validation.message ||
                            `${field.label} must be at least ${field.validation.min} characters`;
                        return false;
                    }
                    if (field.validation.max && value.length > field.validation.max) {
                        errors[fieldPath] = field.validation.message ||
                            `${field.label} must be at most ${field.validation.max} characters`;
                        return false;
                    }
                }
                break;

            case 'checkbox':
                // Checkbox can be boolean or array for multiple checkboxes
                if (Array.isArray(value)) {
                    validatedData[fieldPath] = value;
                } else {
                    validatedData[fieldPath] = Boolean(value);
                }
                return true;

            case 'radio':
            case 'select':
                // Validate that value is one of the options
                if (field.options && field.options.length > 0) {
                    const validOption = field.options.find(opt => opt.value === value);
                    if (!validOption) {
                        errors[fieldPath] = `${field.label} has an invalid selection`;
                        return false;
                    }

                    // Check for nested fields based on selection
                    if (validOption.nestedFields && validOption.nestedFields.length > 0) {
                        validOption.nestedFields.forEach(nestedField => {
                            const nestedFieldName = `${field.name}_${nestedField.name}`;
                            const nestedValue = submissionData[nestedFieldName];
                            validateField(nestedField, nestedValue, nestedFieldName);
                        });
                    }
                }
                break;
        }

        // Store validated data if not already set
        if (validatedData[fieldPath] === undefined) {
            validatedData[fieldPath] = value;
        }

        return true;
    };

    // Validate all fields
    formFields.forEach(field => {
        const value = submissionData[field.name];
        validateField(field, value);
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        validatedData
    };
};

/**
 * Express middleware to validate form submission
 */
const validateSubmission = (req, res, next) => {
    const { formFields, submissionData } = req.body;

    if (!formFields || !submissionData) {
        return res.status(400).json({
            success: false,
            message: 'Missing form fields or submission data'
        });
    }

    const validation = validateFormSubmission(formFields, submissionData);

    if (!validation.isValid) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validation.errors
        });
    }

    req.validatedData = validation.validatedData;
    next();
};

module.exports = {
    validateFormSubmission,
    validateSubmission
};
