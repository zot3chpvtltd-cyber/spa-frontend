import api from './api';

const bookingService = {
    // Create Booking
    createBooking: async (bookingData) => {
        // Send spaId in body, backend will use it from there
        const response = await api.post('/bookings', bookingData);
        return response.data;
    },

    // Get My Bookings (Customer)
    getMyBookings: async () => {
        const response = await api.get('/bookings/my');
        return response.data;
    }
};

export default bookingService;
