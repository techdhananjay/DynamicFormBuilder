import { STORAGE_KEYS } from './constants';

/**
 * Store auth token and admin info
 */
export const setAuthData = (token, admin) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    if (admin) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_INFO, JSON.stringify(admin));
    }
};

/**
 * Get auth token
 */
export const getAuthToken = () => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Get admin info
 */
export const getAdminInfo = () => {
    const adminData = localStorage.getItem(STORAGE_KEYS.ADMIN_INFO);
    return adminData ? JSON.parse(adminData) : null;
};

/**
 * Clear auth data (logout)
 */
export const clearAuthData = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_INFO);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
    return !!getAuthToken();
};
