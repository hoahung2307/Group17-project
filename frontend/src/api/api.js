import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;
const api = axios.create({
    baseURL,
    withCredentials: true
});

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