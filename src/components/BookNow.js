import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import publicService from "../services/publicService";
import bookingService from "../services/bookingService";
import "./BookNow.css";

function BookNow() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceId: "",
    date: "",
    time: "",
    message: ""
  });
  const [services, setServices] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await publicService.getServices();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookingData = {
        spaId: 1, // Default spa ID
        serviceId: parseInt(formData.serviceId),
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        bookingDate: formData.date,
        bookingTime: formData.time + ":00", // Add seconds for TimeSpan
        specialRequests: formData.message
      };

      await bookingService.createBooking(bookingData);

      setSubmitted(true);
      toast.success("Booking confirmed successfully!");

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.response?.data?.error || "Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="book-page">
        <div className="book-container">
          <div className="success-container">
            <div className="success-icon">✓</div>
            <h2>Booking Confirmed!</h2>
            <p>Thank you for choosing us. We've received your appointment request.</p>
            <p className="success-detail">A confirmation will be sent to {formData.email}</p>
            <div className="success-animation"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="book-page no-scrollbar">
      <div className="book-container">
        <div className="book-header">
          <h1>Book Your Appointment</h1>
          <p>Fill in the details below and we'll get back to you shortly</p>
        </div>

        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={handleInputChange}
                pattern="[0-9+\s\-]+"
                title="Please enter a valid phone number (numbers, +, spaces, and - allowed)"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="serviceId">Select Service *</label>
            <select
              id="serviceId"
              name="serviceId"
              value={formData.serviceId}
              onChange={handleInputChange}
              required
            >
              <option value="">Choose a service...</option>
              {services.map(service => (
                <option key={service.serviceId} value={service.serviceId}>
                  {service.title} - ₹{service.price}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Preferred Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">Preferred Time *</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="message">Special Requests (Optional)</label>
            <textarea
              id="message"
              name="message"
              placeholder="Any special requirements or preferences..."
              value={formData.message}
              onChange={handleInputChange}
              rows="4"
            ></textarea>
          </div>

          <button type="submit" className="book-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              'Confirm Booking'
            )}
          </button>

          <p className="form-note">
            * Required fields. We'll contact you within 24 hours to confirm your appointment.
          </p>
        </form>
      </div>
    </div>
  );
}

export default BookNow;
