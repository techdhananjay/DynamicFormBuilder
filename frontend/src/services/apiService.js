import api from '../utils/api';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Login admin
 */
export const loginAdmin = async (username, password) => {
    const response = await api.post(API_ENDPOINTS.LOGIN, { username, password });
    return response.data;
};

/**
 * Get current admin
 */
export const getCurrentAdmin = async () => {
    const response = await api.get(API_ENDPOINTS.GET_ME);
    return response.data;
};

/**
 * Get all forms
 */
export const getAllForms = async (includeInactive = false) => {
    const response = await api.get(API_ENDPOINTS.FORMS, {
        params: { includeInactive }
    });
    return response.data;
};

/**
 * Get form by ID
 */
export const getFormById = async (id) => {
    const response = await api.get(API_ENDPOINTS.FORM_BY_ID(id));
    return response.data;
};

/**
 * Create new form
 */
export const createForm = async (formData) => {
    const response = await api.post(API_ENDPOINTS.FORMS, formData);
    return response.data;
};

/**
 * Update form
 */
export const updateForm = async (id, formData) => {
    const response = await api.put(API_ENDPOINTS.FORM_BY_ID(id), formData);
    return response.data;
};

/**
 * Delete form
 */
export const deleteForm = async (id) => {
    const response = await api.delete(API_ENDPOINTS.FORM_BY_ID(id));
    return response.data;
};

/**
 * Reorder form fields
 */
export const reorderFormFields = async (id, fields) => {
    const response = await api.put(API_ENDPOINTS.REORDER_FIELDS(id), { fields });
    return response.data;
};

/**
 * Submit form
 */
export const submitForm = async (formId, answers) => {
    const response = await api.post(API_ENDPOINTS.SUBMISSIONS, {
        formId,
        answers
    });
    return response.data;
};

/**
 * Get form submissions
 */
export const getFormSubmissions = async (formId, page = 1, limit = 20) => {
    const response = await api.get(API_ENDPOINTS.FORM_SUBMISSIONS(formId), {
        params: { page, limit }
    });
    return response.data;
};

/**
 * Get submission by ID
 */
export const getSubmissionById = async (id) => {
    const response = await api.get(API_ENDPOINTS.SUBMISSION_DETAIL(id));
    return response.data;
};

/**
 * Export submissions as CSV
 */
export const exportSubmissionsCSV = async (formId) => {
    const response = await api.get(API_ENDPOINTS.EXPORT_CSV(formId), {
        responseType: 'blob'
    });
    return response.data;
};

/**
 * Delete submission
 */
export const deleteSubmission = async (id) => {
    const response = await api.delete(API_ENDPOINTS.SUBMISSION_DETAIL(id));
    return response.data;
};
