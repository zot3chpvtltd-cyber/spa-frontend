import { useState, useEffect } from "react";
import api from "../../services/api";
import bookingService from "../../services/bookingService";
import { toast } from 'react-toastify';
import "./BookingsManagement.css";

function BookingsManagement() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showBookForm, setShowBookForm] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    room: "",
    serviceId: "",
    date: "",
    time: ""
  });

  useEffect(() => {
    loadBookings();
    loadServices();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await api.get('/admin/bookings');
      // Map API DTO to component state structure
      const mappedBookings = response.data.map(b => ({
        id: b.bookingId,
        name: b.customerName,
        phone: b.customerPhone,
        email: b.customerEmail,
        service: b.serviceName,
        package: b.servicePrice,
        date: b.bookingDate ? (typeof b.bookingDate === 'string' ? b.bookingDate.split('T')[0] : b.bookingDate) : '',
        time: b.bookingTime || '', // Assuming format is HH:mm:ss
        room: "", // Not supported in backend yet
        status: b.status ? b.status.toLowerCase() : 'pending'
      }));
      setBookings(mappedBookings);
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast.error("Failed to load bookings");
    }
  };

  const loadServices = async () => {
    try {
      const response = await api.get('/admin/services');
      setServices(response.data);
    } catch (error) {
      console.error("Error loading services:", error);
    }
  };

  const updateBookingStatus = async (id, newStatus) => {
    try {
      // Capitalize first letter for backend enum/string match if needed
      const statusToSend = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);

      await api.put(`/admin/bookings/${id}/status`, { status: statusToSend });

      setBookings(bookings.map(b =>
        b.id === id ? { ...b, status: newStatus } : b
      ));
      toast.success(`Booking status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const deleteBooking = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await api.delete(`/admin/bookings/${id}`);
        setBookings(bookings.filter(booking => booking.id !== id));
        toast.success("Booking deleted successfully");
      } catch (error) {
        console.error("Error deleting booking:", error);
        toast.error("Failed to delete booking");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      const bookingData = {
        serviceId: parseInt(formData.serviceId),
        customerName: formData.name,
        customerEmail: formData.email || "admin-entry@example.com", // Default if not provided in admin form
        customerPhone: formData.phone,
        bookingDate: formData.date,
        bookingTime: formData.time + ":00",
        specialRequests: "Booked via Admin Panel"
      };

      await bookingService.createBooking(bookingData);

      toast.success("Appointment booked successfully!");
      setShowBookForm(false);
      setFormData({
        name: "",
        phone: "",
        email: "",
        room: "",
        serviceId: "",
        date: "",
        time: ""
      });
      loadBookings(); // Reload list
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Failed to book appointment");
    }
  };

  const getFilteredBookingsByDate = () => {
    const now = new Date();
    let startDate = new Date();

    switch (dateFilter) {
      case "3months":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "6months":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "1year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return bookings;
    }

    return bookings.filter(booking => {
      if (!booking.date) return false;
      const bookingDate = new Date(booking.date);
      return bookingDate >= startDate && bookingDate <= now;
    });
  };

  const downloadExcel = () => {
    let dataToExport = filter === "all" ? bookings : bookings.filter(b => b.status === filter);

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date();
      let startDate = new Date();
      switch (dateFilter) {
        case "3months":
          startDate.setMonth(now.getMonth() - 3);
          break;
        case "6months":
          startDate.setMonth(now.getMonth() - 6);
          break;
        case "1year":
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      dataToExport = dataToExport.filter(booking => {
        if (!booking.date) return false;
        const bookingDate = new Date(booking.date);
        return bookingDate >= startDate && bookingDate <= now;
      });
    }

    // Create CSV content
    const headers = ["ID", "Name", "Phone", "Service", "Date", "Time", "Room", "Status"];
    const csvContent = [
      headers.join(","),
      ...dataToExport.map(booking => [
        booking.id,
        `"${booking.name}"`,
        booking.phone,
        `"${booking.service}"`,
        booking.date,
        booking.time,
        booking.room || "N/A",
        booking.status
      ].join(","))
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `bookings_${dateFilter}_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredBookings = filter === "all"
    ? bookings
    : bookings.filter(booking => booking.status === filter);

  return (
    <div className="bookings-management">
      <div className="bookings-header">
        <h1>Appointments Management</h1>
        <div className="header-actions">
          <button className="book-appointment-btn" onClick={() => setShowBookForm(!showBookForm)}>
            + Book Appointment
          </button>
          <div className="download-section">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="date-filter-select"
            >
              <option value="all">All Time</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last 1 Year</option>
            </select>
            <button className="download-excel-btn" onClick={downloadExcel}>
              📥 Download Excel
            </button>
          </div>
        </div>
      </div>

      {showBookForm && (
        <div className="book-appointment-form-container">
          <h2>Book New Appointment</h2>
          <form onSubmit={handleBookAppointment} className="book-appointment-form">
            <div className="form-row">
              <div className="form-group">
                <label>Customer Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter customer name"
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
              </div>
              <div className="form-group">
                <label>Room Number</label>
                <input
                  type="text"
                  name="room"
                  value={formData.room}
                  onChange={handleInputChange}
                  placeholder="Enter room number (optional)"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Service</label>
                <select
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Service</option>
                  {services.map(service => (
                    <option key={service.ServiceId} value={service.ServiceId}>
                      {service.Title} - ₹{service.Price}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">Book Appointment</button>
              <button type="button" onClick={() => setShowBookForm(false)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="filter-section">
        <div className="filter-buttons">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All ({bookings.length})
          </button>
          <button
            className={filter === "pending" ? "active" : ""}
            onClick={() => setFilter("pending")}
          >
            Pending ({bookings.filter(b => b.status === "pending").length})
          </button>
          <button
            className={filter === "confirmed" ? "active" : ""}
            onClick={() => setFilter("confirmed")}
          >
            Confirmed ({bookings.filter(b => b.status === "confirmed").length})
          </button>
          <button
            className={filter === "completed" ? "active" : ""}
            onClick={() => setFilter("completed")}
          >
            Completed ({bookings.filter(b => b.status === "completed").length})
          </button>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="empty-state">
          <p>No bookings found</p>
        </div>
      ) : (
        <div className="bookings-table-container">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Service</th>
                <th>Package</th>
                <th>Date</th>
                <th>Time</th>
                <th>Room</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>#{booking.id}</td>
                  <td>{booking.name}</td>
                  <td>{booking.phone}</td>
                  <td>{booking.service}</td>
                  <td>{booking.package ? `₹${parseFloat(booking.package).toLocaleString('en-IN')}` : "N/A"}</td>
                  <td>{booking.date}</td>
                  <td>{booking.time}</td>
                  <td>{booking.room || "N/A"}</td>
                  <td>
                    <select
                      value={booking.status}
                      onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                      className={`status-select status-${booking.status}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deleteBooking(booking.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BookingsManagement;

