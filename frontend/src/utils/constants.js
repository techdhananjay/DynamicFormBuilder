// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/auth/login',
    GET_ME: '/auth/me',

    // Forms
    FORMS: '/forms',
    FORM_BY_ID: (id) => `/forms/${id}`,
    REORDER_FIELDS: (id) => `/forms/${id}/reorder`,

    // Submissions
    SUBMISSIONS: '/submissions',
    FORM_SUBMISSIONS: (formId) => `/submissions/${formId}`,
    SUBMISSION_DETAIL: (id) => `/submissions/detail/${id}`,
    EXPORT_CSV: (formId) => `/submissions/${formId}/export`,
};

// Field Types
export const FIELD_TYPES = {
    TEXT: 'text',
    TEXTAREA: 'textarea',
    NUMBER: 'number',
    EMAIL: 'email',
    DATE: 'date',
    CHECKBOX: 'checkbox',
    RADIO: 'radio',
    SELECT: 'select',
};

// Field Type Options for Form Builder
export const FIELD_TYPE_OPTIONS = [
    { value: FIELD_TYPES.TEXT, label: 'Text Input' },
    { value: FIELD_TYPES.TEXTAREA, label: 'Text Area' },
    { value: FIELD_TYPES.NUMBER, label: 'Number' },
    { value: FIELD_TYPES.EMAIL, label: 'Email' },
    { value: FIELD_TYPES.DATE, label: 'Date' },
    { value: FIELD_TYPES.CHECKBOX, label: 'Checkbox' },
    { value: FIELD_TYPES.RADIO, label: 'Radio' },
    { value: FIELD_TYPES.SELECT, label: 'Select Dropdown' },
];

// Fields that support nested fields
export const FIELDS_WITH_NESTED_SUPPORT = [
    FIELD_TYPES.RADIO,
    FIELD_TYPES.SELECT,
];

// Fields that require options
export const FIELDS_REQUIRING_OPTIONS = [
    FIELD_TYPES.CHECKBOX,
    FIELD_TYPES.RADIO,
    FIELD_TYPES.SELECT,
];

// Local Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'formBuilderToken',
    ADMIN_INFO: 'formBuilderAdmin',
};

// Validation Messages
export const VALIDATION_MESSAGES = {
    REQUIRED: (fieldName) => `${fieldName} is required`,
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_NUMBER: 'Please enter a valid number',
    MIN_LENGTH: (fieldName, min) => `${fieldName} must be at least ${min} characters`,
    MAX_LENGTH: (fieldName, max) => `${fieldName} must be at most ${max} characters`,
    MIN_VALUE: (fieldName, min) => `${fieldName} must be at least ${min}`,
    MAX_VALUE: (fieldName, max) => `${fieldName} must be at most ${max}`,
};

// UI Constants
export const UI_CONSTANTS = {
    ITEMS_PER_PAGE: 20,
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    DEBOUNCE_DELAY: 300,
};

// Routes
export const ROUTES = {
    HOME: '/',
    ADMIN_LOGIN: '/admin/login',
    ADMIN_DASHBOARD: '/admin/dashboard',
    FORM_BUILDER: '/admin/form-builder',
    EDIT_FORM: '/admin/form-builder/:id',
    SUBMISSIONS: '/admin/submissions/:formId',
    PUBLIC_FORMS: '/',
    FORM_RENDER: '/form/:id',
};
