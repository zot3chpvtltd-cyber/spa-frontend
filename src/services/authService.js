import api from './api';
import { jwtDecode } from 'jwt-decode';

const authService = {
    // Spa Registration
    registerSpa: async (spaData) => {
        constresponse = await api.post('/auth/spa/register', spaData);
        return response.data;
    },

    // Login (Customer, SpaAdmin, MasterAdmin)
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Decode token to get role/spaId if needed
            const decoded = jwtDecode(response.data.token);
            localStorage.setItem('role', decoded.role);
        }
        return response.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        window.location.href = '/';
    },

    // Get current user
    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },

    // Get current role
    getRole: () => {
        return localStorage.getItem('role');
    },

    // Check if authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

export default authService;
