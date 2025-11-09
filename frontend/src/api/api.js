import axios from 'axios';
import { REFRESH_TOKEN } from '../constants/constants.js';

const baseURL = import.meta.env.VITE_API_URL;
const api = axios.create({
    baseURL,
    withCredentials: true
});

// Add response interceptor for handling token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                .then(() => {
                    return api(originalRequest);
                })
                .catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;
            console.log("Refreshing token...");
            try {
                const refreshToken = localStorage.getItem(REFRESH_TOKEN);
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }
                // backend endpoint is /auth/refresh and expects { refreshToken }
                await api.post('/auth/refresh', { refreshToken });
                processQueue(null);
                // Remove Authorization header so the server can use refreshed cookie (backend sets httpOnly cookie)
                if (originalRequest && originalRequest.headers) {
                    delete originalRequest.headers.Authorization;
                    delete originalRequest.headers.authorization;
                }
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export const updateProfileImage = (formData) => {
    return api.put('/user/profile/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const updateProfileName = (name) => {
    return api.put('/user/profile/name', { name });
};

export const requestPasswordReset = (email) => {
    return api.post('/auth/forgot-password', { email });
};

export const resetPassword = (token, password) => {
    return api.post(`/auth/reset-password/${token}`, { newPassword: password });
};

export const deleteUser = (id) => {
    return api.delete(`/user/${id}`);
};

export default api;