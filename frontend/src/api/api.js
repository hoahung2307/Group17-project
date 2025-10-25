import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;
const api = axios.create({
    baseURL,
    withCredentials: true
});

export const updateProfileImage = (formData) => {
    return api.put('/profile/image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const updateProfileName = (name) => {
    return api.put('/profile/name', { name });
};

export const requestPasswordReset = (email) => {
    return api.post('/reset-password', { email });
};

export const resetPassword = (token, password) => {
    return api.post(`/reset-password/${token}`, { password });
};

export const deleteUser = (id) => {
    return api.delete(`/users/${id}`);
};

export default api;