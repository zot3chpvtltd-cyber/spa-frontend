import api from './api';

const publicService = {
    // Get Spa Details (Public)
    // The backend determines the spa based on the domain/subdomain
    getSpaDetails: async () => {
        // We might need an endpoint that returns current spa details based on host
        // Currently we have /auth/spa/{id} but that requires ID.
        // Let's assume we'll create a public endpoint or use a specific one.
        // For now, let's try to fetch services which is tenant aware.
        const response = await api.get('/services');
        return response.data;
    },

    // Get Services List
    getServices: async () => {
        const response = await api.get('/services');
        return response.data;
    },

    // Get Service by ID
    getServiceById: async (id) => {
        const response = await api.get(`/services/${id}`);
        return response.data;
    }
};

export default publicService;
