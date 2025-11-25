import { FIELD_TYPES, VALIDATION_MESSAGES } from './constants';

/**
 * Validates a single field based on its configuration
 */
export const validateField = (field, value) => {
    const errors = [];

    // Check required
    if (field.required && (value === undefined || value === null || value === '')) {
        errors.push(VALIDATION_MESSAGES.REQUIRED(field.label));
        return errors;
    }

    // Skip further validation if empty and not required
    if (value === undefined || value === null || value === '') {
        return errors;
    }

    // Type-specific validation
    switch (field.type) {
        case FIELD_TYPES.EMAIL:
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errors.push(VALIDATION_MESSAGES.INVALID_EMAIL);
            }
            break;

        case FIELD_TYPES.NUMBER:
            if (isNaN(Number(value))) {
                errors.push(VALIDATION_MESSAGES.INVALID_NUMBER);
            } else {
                const numValue = Number(value);
                if (field.validation?.min !== undefined && numValue < field.validation.min) {
                    errors.push(
                        field.validation.message ||
                        VALIDATION_MESSAGES.MIN_VALUE(field.label, field.validation.min)
                    );
                }
                if (field.validation?.max !== undefined && numValue > field.validation.max) {
                    errors.push(
                        field.validation.message ||
                        VALIDATION_MESSAGES.MAX_VALUE(field.label, field.validation.max)
                    );
                }
            }
            break;

        case FIELD_TYPES.TEXT:
        case FIELD_TYPES.TEXTAREA:
            if (field.validation?.regex) {
                const regex = new RegExp(field.validation.regex);
                if (!regex.test(value)) {
                    errors.push(field.validation.message || 'Invalid format');
                }
            }
            if (field.validation?.min && value.length < field.validation.min) {
                errors.push(VALIDATION_MESSAGES.MIN_LENGTH(field.label, field.validation.min));
            }
            if (field.validation?.max && value.length > field.validation.max) {
                errors.push(VALIDATION_MESSAGES.MAX_LENGTH(field.label, field.validation.max));
            }
            break;

        case FIELD_TYPES.RADIO:
        case FIELD_TYPES.SELECT:
            if (field.options && field.options.length > 0) {
                const validOption = field.options.find(opt => opt.value === value);
                if (!validOption) {
                    errors.push(`Invalid selection for ${field.label}`);
                }
            }
            break;
    }

    return errors;
};

/**
 * Validates all fields in a form
 */
export const validateForm = (fields, formData) => {
    const errors = {};
    let isValid = true;

    fields.forEach(field => {
        const fieldErrors = validateField(field, formData[field.name]);
        if (fieldErrors.length > 0) {
            errors[field.name] = fieldErrors[0]; // Show first error
            isValid = false;
        }

        // Validate nested fields if parent field has a value
        const parentValue = formData[field.name];
        if (parentValue && field.options) {
            const selectedOption = field.options.find(opt => opt.value === parentValue);
            if (selectedOption?.nestedFields) {
                selectedOption.nestedFields.forEach(nestedField => {
                    const nestedFieldName = `${field.name}_${nestedField.name}`;
                    const nestedErrors = validateField(nestedField, formData[nestedFieldName]);
                    if (nestedErrors.length > 0) {
                        errors[nestedFieldName] = nestedErrors[0];
                        isValid = false;
                    }
                });
            }
        }
    });

    return { isValid, errors };
};

/**
 * Debounce function for input validation
 */
export const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

/**
 * Format date for input[type="date"]
 */
export const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
};

/**
 * Download CSV file
 */
export const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};
