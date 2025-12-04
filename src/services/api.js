import axios from 'axios';
import { toast } from 'react-toastify';

// Base URL for the backend API
// Change this if your backend runs on a different port
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token and spaId parameter
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // Development: Add spaId parameter if specified
        // You can set REACT_APP_SPA_ID in .env file or use URL parameter
        // EXCLUDE auth and master-admin endpoints from spaId parameter
        const isAuthEndpoint = config.url?.includes('/auth/');
        const isMasterAdminEndpoint = config.url?.includes('/master-admin/');

        if (!isAuthEndpoint && !isMasterAdminEndpoint) {
            const urlParams = new URLSearchParams(window.location.search);
            const spaIdFromUrl = urlParams.get('spaId');
            const spaIdFromEnv = process.env.REACT_APP_SPA_ID;
            const spaId = spaIdFromUrl || spaIdFromEnv;

            if (spaId && window.location.hostname === 'localhost') {
                // Append spaId to query parameters
                config.params = config.params || {};
                config.params.spaId = spaId;
                console.log(`[API] Adding spaId=${spaId} to request: ${config.url}`);
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const message = error.response?.data?.message || error.response?.data?.error || 'Something went wrong';

        // Handle 401 Unauthorized (Session expired)
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Optional: Redirect to login
            // window.location.href = '/login';
        }

        // Show error toast
        toast.error(message);

        return Promise.reject(error);
    }
);

export default api;
